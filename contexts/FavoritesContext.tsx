/**
 * FavoritesContext
 * 
 * Provides shared state for favorited stories across the app.
 * Tracks which stories the user has hearted.
 */

import React, { createContext, ReactNode, useContext, useState } from 'react';

interface FavoritesContextType {
  favorites: string[]; // Array of story IDs
  isFavorite: (storyId: string) => boolean;
  toggleFavorite: (storyId: string) => void;
  addFavorite: (storyId: string) => void;
  removeFavorite: (storyId: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const isFavorite = (storyId: string): boolean => {
    return favorites.includes(storyId);
  };

  const toggleFavorite = (storyId: string) => {
    if (favorites.includes(storyId)) {
      setFavorites((prev) => prev.filter((id) => id !== storyId));
    } else {
      setFavorites((prev) => [storyId, ...prev]);
    }
  };

  const addFavorite = (storyId: string) => {
    if (!favorites.includes(storyId)) {
      setFavorites((prev) => [storyId, ...prev]);
    }
  };

  const removeFavorite = (storyId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== storyId));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        isFavorite, 
        toggleFavorite, 
        addFavorite, 
        removeFavorite, 
        clearFavorites 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
