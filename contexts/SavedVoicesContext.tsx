/**
 * SavedVoicesContext
 * 
 * Provides shared state for saved voices across the app.
 * Syncs voices with Supabase for cross-device persistence.
 * Uploads recordings to Supabase Storage for playback across devices.
 */

import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

import { useAuth } from './AuthContext';

// Saved voice item type
export interface SavedVoice {
  id: string;
  name: string;
  duration: string;
  date: string;
  uri: string; // Local URI (for newly recorded) or remote URL (from storage)
  voiceId?: string; // ElevenLabs voice_id
  recordingUrl?: string; // Supabase Storage URL
}

// Database row type (matches Supabase table)
interface SavedVoiceRow {
  id: string;
  user_id: string;
  name: string;
  duration: string;
  voice_id: string | null;
  recording_url: string | null;
  created_at: string;
}

interface SavedVoicesContextType {
  savedVoices: SavedVoice[];
  isLoading: boolean;
  addVoice: (voice: SavedVoice) => Promise<void>;
  removeVoice: (id: string) => Promise<void>;
  clearVoices: () => void;
  refreshVoices: () => Promise<void>;
}

const SavedVoicesContext = createContext<SavedVoicesContextType | undefined>(undefined);

export function SavedVoicesProvider({ children }: { children: ReactNode }) {
  const [savedVoices, setSavedVoices] = useState<SavedVoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Convert database row to SavedVoice
  const rowToVoice = (row: SavedVoiceRow): SavedVoice => ({
    id: row.id,
    name: row.name,
    duration: row.duration,
    date: new Date(row.created_at).toLocaleDateString(),
    uri: row.recording_url || '', // Use storage URL for playback
    voiceId: row.voice_id || undefined,
    recordingUrl: row.recording_url || undefined,
  });

  // Fetch voices from Supabase
  const fetchVoices = useCallback(async () => {
    if (!user) {
      setSavedVoices([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_voices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[SavedVoices] Error fetching voices:', error.message);
        return;
      }

      if (data) {
        setSavedVoices(data.map(rowToVoice));
      }
    } catch (error) {
      console.error('[SavedVoices] Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load voices when user changes (login/logout)
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchVoices();
    } else {
      setSavedVoices([]);
    }
  }, [isAuthenticated, user, fetchVoices]);

  // Upload recording to Supabase Storage
  const uploadRecording = async (localUri: string, fileName: string): Promise<string> => {
    try {
      console.log('[SavedVoices] Uploading recording:', fileName);
      
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Upload to Supabase Storage
      const filePath = `${user!.id}/${fileName}.m4a`;
      const { data, error } = await supabase.storage
        .from('voice-recordings')
        .upload(filePath, decode(base64), {
          contentType: 'audio/m4a',
          upsert: true,
        });

      if (error) {
        console.error('[SavedVoices] Upload error:', error.message);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('voice-recordings')
        .getPublicUrl(filePath);

      console.log('[SavedVoices] Upload successful:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('[SavedVoices] Upload failed:', error);
      throw error;
    }
  };

  // Add a voice (save to Supabase)
  const addVoice = async (voice: SavedVoice) => {
    if (!user) {
      console.error('[SavedVoices] Cannot save voice: user not authenticated');
      throw new Error('Please sign in to save your voice recordings');
    }

    try {
      // Upload recording to Storage first
      let recordingUrl: string | null = null;
      if (voice.uri) {
        recordingUrl = await uploadRecording(voice.uri, voice.id);
      }

      // Save metadata to database
      const { error } = await supabase
        .from('saved_voices')
        .insert({
          id: voice.id,
          user_id: user.id,
          name: voice.name,
          duration: voice.duration,
          voice_id: voice.voiceId || null,
          recording_url: recordingUrl,
        });

      if (error) {
        console.error('[SavedVoices] Error saving voice:', error.message);
        throw error;
      }

      // Add to local state with the storage URL
      const savedVoice: SavedVoice = {
        ...voice,
        uri: recordingUrl || voice.uri,
        recordingUrl: recordingUrl || undefined,
      };
      setSavedVoices((prev) => [savedVoice, ...prev]);
      console.log('[SavedVoices] Voice saved successfully:', voice.name);
    } catch (error) {
      console.error('[SavedVoices] Error:', error);
      throw error;
    }
  };

  // Remove a voice (delete from Supabase + Storage)
  const removeVoice = async (id: string) => {
    if (!user) return;

    try {
      // Delete from Storage first
      const filePath = `${user.id}/${id}.m4a`;
      await supabase.storage
        .from('voice-recordings')
        .remove([filePath]);
      console.log('[SavedVoices] Recording deleted from storage');

      // Delete from database
      const { error } = await supabase
        .from('saved_voices')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('[SavedVoices] Error removing voice:', error.message);
        throw error;
      }

      // Remove from local state
      setSavedVoices((prev) => prev.filter((voice) => voice.id !== id));
      console.log('[SavedVoices] Voice removed successfully');
    } catch (error) {
      console.error('[SavedVoices] Error:', error);
      throw error;
    }
  };

  // Clear all voices (local state only - used on logout)
  const clearVoices = () => {
    setSavedVoices([]);
  };

  // Manual refresh
  const refreshVoices = async () => {
    await fetchVoices();
  };

  return (
    <SavedVoicesContext.Provider 
      value={{ 
        savedVoices, 
        isLoading, 
        addVoice, 
        removeVoice, 
        clearVoices,
        refreshVoices 
      }}
    >
      {children}
    </SavedVoicesContext.Provider>
  );
}

export function useSavedVoices() {
  const context = useContext(SavedVoicesContext);
  if (context === undefined) {
    throw new Error('useSavedVoices must be used within a SavedVoicesProvider');
  }
  return context;
}
