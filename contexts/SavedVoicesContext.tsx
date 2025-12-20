/**
 * SavedVoicesContext
 * 
 * Provides shared state for saved voices across the app.
 * This allows the browse screen to access voices saved in the record screen.
 */

import { createContext, ReactNode, useContext, useState } from 'react';

// Saved voice item type
export interface SavedVoice {
  id: string;
  name: string;
  duration: string;
  date: string;
  uri: string;
  voiceId?: string; // ElevenLabs voice_id
}

interface SavedVoicesContextType {
  savedVoices: SavedVoice[];
  addVoice: (voice: SavedVoice) => void;
  removeVoice: (id: string) => void;
  clearVoices: () => void;
}

const SavedVoicesContext = createContext<SavedVoicesContextType | undefined>(undefined);

export function SavedVoicesProvider({ children }: { children: ReactNode }) {
  const [savedVoices, setSavedVoices] = useState<SavedVoice[]>([]);

  const addVoice = (voice: SavedVoice) => {
    setSavedVoices((prev) => [voice, ...prev]);
  };

  const removeVoice = (id: string) => {
    setSavedVoices((prev) => prev.filter((voice) => voice.id !== id));
  };

  const clearVoices = () => {
    setSavedVoices([]);
  };

  return (
    <SavedVoicesContext.Provider value={{ savedVoices, addVoice, removeVoice, clearVoices }}>
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

