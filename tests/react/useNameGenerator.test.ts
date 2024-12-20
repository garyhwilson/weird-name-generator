import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNameGenerator } from '../../src/react/useNameGenerator';
import { useNameHistory } from '../../src/react/useNameHistory';

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
      const generatedName = await result.current.generate();
      expect(generatedName.name).toBeTruthy();
      expect(result.current.result).toEqual(generatedName);
    });
  });

  test('should handle bulk generation', async () => {
    const { result } = renderHook(() => useNameGenerator());
    const count = 5;

    await act(async () => {
      const names = await result.current.bulkGenerate(count);
      expect(names.length).toBe(count);
      expect(new Set(names.map(n => n.name)).size).toBe(count); // Should be unique
    });
  });

  test('should handle errors', async () => {
    const { result } = renderHook(() => useNameGenerator());

    await act(async () => {
      try {
        // Force an error by passing invalid options
        await result.current.generate({ 
          options: { minSyllables: -1 } as any 
        });
      } catch (error) {
        expect(result.current.error).toBeTruthy();
      }
    });
  });
});

describe('useNameHistory', () => {
  beforeEach(() => {
    localStorage.clear();
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
});
