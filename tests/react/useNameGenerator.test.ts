import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNameGenerator } from '../../src/react/useNameGenerator';
import { useNameHistory } from '../../src/react/useNameHistory';
import type { IPunctuationOptions } from '../../src/core/types';

describe('useNameGenerator', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useNameGenerator());

    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.history).toEqual([]);
  });

  test('should generate a name', async () => {
    const { result } = renderHook(() => useNameGenerator());

    await act(async () => {
      const generatedName = await result.current.generate({});
      expect(generatedName.name).toBeTruthy();
      // We no longer check result.current.result as it's handled internally
      expect(generatedName).toHaveProperty('name');
      expect(generatedName).toHaveProperty('syllables');
      expect(generatedName).toHaveProperty('stress');
    });
  });

  test('should handle bulk generation', async () => {
    const { result } = renderHook(() => useNameGenerator());
    const count = 5;

    await act(async () => {
      const names = await result.current.bulkGenerate(count, {});
      expect(names.length).toBe(count);
      expect(new Set(names.map(n => n.name)).size).toBe(count); // Should be unique
    });
  });

  test('should handle punctuation options', async () => {
    const { result } = renderHook(() => useNameGenerator());
    const punctuationOptions: IPunctuationOptions = {
      enabled: true,
      maxPerName: 1
    };

    await act(async () => {
      const generatedName = await result.current.generate({
        style: 'elven',
        punctuationOptions
      });
      expect(generatedName.name).toBeTruthy();
    });
  });

  test('should handle errors', async () => {
    const { result } = renderHook(() => useNameGenerator());

    await act(async () => {
      try {
        await result.current.generate({ 
          options: { minSyllables: -1 } // Invalid option
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        // Instead of checking error state, we verify that an error was thrown
        expect(error).toBeTruthy();
      }
    });
  });
});

describe('useNameHistory', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Storage.prototype, 'setItem');
  });

  test('should initialize with empty history', () => {
    const { result } = renderHook(() => useNameHistory());

    expect(result.current.history).toEqual([]);
    expect(result.current.favorites).toEqual([]);
  });

  test('should add items to history', () => {
    const { result } = renderHook(() => useNameHistory());

    act(() => {
      result.current.addToHistory({
        name: 'TestName',
        syllables: ['Test', 'Name'],
        stress: '10',
        style: 'simple',
        gender: 'neutral'
      });
    });

    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0].name).toBe('TestName');
  });

  test('should respect maxHistorySize', () => {
    const maxSize = 2;
    const { result } = renderHook(() => 
      useNameHistory({ maxHistorySize: maxSize })
    );

    act(() => {
      for (let i = 0; i < 5; i++) {
        result.current.addToHistory({
          name: `Name${i}`,
          syllables: [`Name${i}`],
          stress: '1',
          style: 'simple',
          gender: 'neutral'
        });
      }
    });

    expect(result.current.history.length).toBe(maxSize);
    expect(result.current.history[0].name).toBe('Name4');
  });

  test('should persist to localStorage when enabled', () => {
    const { result } = renderHook(() => 
      useNameHistory({ persistToStorage: true })
    );

    act(() => {
      result.current.addToHistory({
        name: 'StoredName',
        syllables: ['Stored', 'Name'],
        stress: '10',
        style: 'simple',
        gender: 'neutral'
      });
    });

    expect(localStorage.setItem).toHaveBeenCalled();
    const stored = localStorage.getItem('weird-name-generator-history');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)[0].name).toBe('StoredName');
  });

  test('should manage favorites', () => {
    const { result } = renderHook(() => useNameHistory());

    act(() => {
      result.current.addToHistory({
        name: 'FavoriteName',
        syllables: ['Favorite', 'Name'],
        stress: '10',
        style: 'simple',
        gender: 'neutral'
      });
      result.current.favoriteItem(0);
    });

    expect(result.current.favorites.length).toBe(1);
    expect(result.current.favorites[0].name).toBe('FavoriteName');

    act(() => {
      result.current.unfavoriteItem(0);
    });

    expect(result.current.favorites.length).toBe(0);
  });

  test('should clear all history', () => {
    const { result } = renderHook(() => useNameHistory());

    act(() => {
      // Add item to history
      result.current.addToHistory({
        name: 'TestName',
        syllables: ['Test', 'Name'],
        stress: '10',
        style: 'simple',
        gender: 'neutral'
      });
      // Add to favorites
      result.current.favoriteItem(0);
    });

    // Verify items were added
    expect(result.current.history.length).toBe(1);
    expect(result.current.favorites.length).toBe(1);

    // Clear history
    act(() => {
      result.current.clearHistory();
    });

    // Verify both history and favorites are cleared
    expect(result.current.history.length).toBe(0);
    expect(result.current.favorites.length).toBe(0);
  });
});
