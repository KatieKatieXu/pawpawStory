/**
 * PlaybackProgressContext
 * 
 * Tracks playback progress for stories so users can continue where they left off.
 * Stores the position and duration for each story.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PlaybackProgress {
  storyId: string;
  positionMs: number;
  durationMs: number;
  voiceId?: string; // Optional: the voice used for this story
  lastPlayedAt: number; // Timestamp for sorting by recency
}

interface PlaybackProgressContextType {
  progress: PlaybackProgress[];
  getProgress: (storyId: string) => PlaybackProgress | undefined;
  saveProgress: (storyId: string, positionMs: number, durationMs: number, voiceId?: string) => void;
  clearProgress: (storyId: string) => void;
  clearAllProgress: () => void;
  getInProgressStories: () => PlaybackProgress[];
}

const PlaybackProgressContext = createContext<PlaybackProgressContextType | undefined>(undefined);

// Consider a story "in progress" if it's been started but not finished (>5% and <95%)
const MIN_PROGRESS_PERCENT = 0.05;
const MAX_PROGRESS_PERCENT = 0.95;

export function PlaybackProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<PlaybackProgress[]>([]);

  const getProgress = (storyId: string): PlaybackProgress | undefined => {
    return progress.find((p) => p.storyId === storyId);
  };

  const saveProgress = (storyId: string, positionMs: number, durationMs: number, voiceId?: string) => {
    // Don't save if duration is 0 or position is at the start
    if (durationMs <= 0) return;

    const progressPercent = positionMs / durationMs;
    
    // If completed (>95%), remove from progress
    if (progressPercent >= MAX_PROGRESS_PERCENT) {
      setProgress((prev) => prev.filter((p) => p.storyId !== storyId));
      return;
    }
    
    // If barely started (<5%), don't save yet
    if (progressPercent < MIN_PROGRESS_PERCENT) {
      return;
    }

    setProgress((prev) => {
      const existing = prev.find((p) => p.storyId === storyId);
      if (existing) {
        return prev.map((p) =>
          p.storyId === storyId
            ? { ...p, positionMs, durationMs, voiceId, lastPlayedAt: Date.now() }
            : p
        );
      }
      return [
        { storyId, positionMs, durationMs, voiceId, lastPlayedAt: Date.now() },
        ...prev,
      ];
    });
  };

  const clearProgress = (storyId: string) => {
    setProgress((prev) => prev.filter((p) => p.storyId !== storyId));
  };

  const clearAllProgress = () => {
    setProgress([]);
  };

  // Get stories that are in progress, sorted by most recently played
  const getInProgressStories = (): PlaybackProgress[] => {
    return [...progress].sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);
  };

  return (
    <PlaybackProgressContext.Provider
      value={{
        progress,
        getProgress,
        saveProgress,
        clearProgress,
        clearAllProgress,
        getInProgressStories,
      }}
    >
      {children}
    </PlaybackProgressContext.Provider>
  );
}

export function usePlaybackProgress() {
  const context = useContext(PlaybackProgressContext);
  if (context === undefined) {
    throw new Error('usePlaybackProgress must be used within a PlaybackProgressProvider');
  }
  return context;
}

