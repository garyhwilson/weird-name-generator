import { useState, useCallback, useEffect } from 'react';
import type { IGeneratorResult } from '../core/types';

const STORAGE_KEY = 'weird-name-generator-history';

export interface UseNameHistoryOptions {
  maxHistorySize?: number;
  persistToStorage?: boolean;
}

export interface UseNameHistoryResult {
  history: IGeneratorResult[];
  addToHistory: (result: IGeneratorResult) => void;
  clearHistory: () => void;
  removeFromHistory: (index: number) => void;
  favoriteItem: (index: number) => void;
  unfavoriteItem: (index: number) => void;
  favorites: IGeneratorResult[];
}

export function useNameHistory({
  maxHistorySize = 100,
  persistToStorage = true
}: UseNameHistoryOptions = {}): UseNameHistoryResult {
  const [history, setHistory] = useState<IGeneratorResult[]>(() => {
    if (persistToStorage) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.warn('Failed to load name history from localStorage:', error);
      }
    }
    return [];
  });

  const [favorites, setFavorites] = useState<IGeneratorResult[]>([]);

  // Persist history to localStorage when it changes
  useEffect(() => {
    if (persistToStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.warn('Failed to save name history to localStorage:', error);
      }
    }
  }, [history, persistToStorage]);

  const addToHistory = useCallback((result: IGeneratorResult) => {
    setHistory(prev => {
      const newHistory = [result, ...prev].slice(0, maxHistorySize);
      return newHistory;
    });
  }, [maxHistorySize]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setFavorites([]); // Make sure favorites are also cleared
    if (persistToStorage) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to clear name history from localStorage:', error);
      }
    }
  }, [persistToStorage]);
  
  const removeFromHistory = useCallback((index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  }, []);

  const favoriteItem = useCallback((index: number) => {
    setHistory(prev => {
      const item = prev[index];
      if (!item) return prev;
      
      setFavorites(currFavorites => {
        if (currFavorites.some(fav => fav.name === item.name)) return currFavorites;
        return [...currFavorites, item];
      });
      
      return prev;
    });
  }, []);

  const unfavoriteItem = useCallback((index: number) => {
    setFavorites(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
    favoriteItem,
    unfavoriteItem,
    favorites
  };
}
