/**
 * SavedVoicesContext
 * 
 * Provides shared state for saved voices across the app.
 * Syncs voices with Supabase for cross-device persistence.
 */

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

import { useAuth } from './AuthContext';

// Saved voice item type
export interface SavedVoice {
  id: string;
  name: string;
  duration: string;
  date: string;
  uri: string;
  voiceId?: string; // ElevenLabs voice_id
}

// Database row type (matches Supabase table)
interface SavedVoiceRow {
  id: string;
  user_id: string;
  name: string;
  duration: string;
  voice_id: string | null;
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
    uri: '', // URI is local-only, not stored in DB
    voiceId: row.voice_id || undefined,
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

  // Add a voice (save to Supabase)
  const addVoice = async (voice: SavedVoice) => {
    if (!user) {
      console.error('[SavedVoices] Cannot save voice: user not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_voices')
        .insert({
          id: voice.id,
          user_id: user.id,
          name: voice.name,
          duration: voice.duration,
          voice_id: voice.voiceId || null,
        });

      if (error) {
        console.error('[SavedVoices] Error saving voice:', error.message);
        throw error;
      }

      // Add to local state immediately for responsiveness
      setSavedVoices((prev) => [voice, ...prev]);
      console.log('[SavedVoices] Voice saved successfully:', voice.name);
    } catch (error) {
      console.error('[SavedVoices] Error:', error);
      throw error;
    }
  };

  // Remove a voice (delete from Supabase)
  const removeVoice = async (id: string) => {
    if (!user) return;

    try {
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
