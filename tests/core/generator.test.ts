import { describe, test, expect, beforeEach } from 'vitest';
import { NameGenerator } from '../../src/core/generator';
import { NameStyle, GenderCharacteristic } from '../../src/core/types';
import { VALIDATION_RULES } from '../../src/core/constants';

describe('NameGenerator', () => {
  let generator: NameGenerator;

  beforeEach(() => {
    generator = new NameGenerator();
  });

  test('should generate a valid name with default settings', () => {
    const result = generator.generate();
    
    expect(result.name).toBeTruthy();
    expect(result.name.length).toBeGreaterThanOrEqual(2);
    expect(result.style).toBe('simple');
    expect(result.gender).toBe('neutral');
    expect(result.syllables.length).toBeGreaterThanOrEqual(1);
    expect(result.stress).toBeTruthy();
  });

  test('should generate names for all styles', () => {
    const styles: NameStyle[] = [
      'simple', 'elven', 'dwarf', 'mythical', 'draconic',
      'fae', 'orcish', 'celestial', 'coastal', 'desert',
      'nordic', 'sylvan'
    ];

    styles.forEach(style => {
      const result = generator.generate(style);
      expect(result.name).toBeTruthy();
      expect(result.style).toBe(style);
    });
  });

  test('should generate names for all genders', () => {
    const genders: GenderCharacteristic[] = ['feminine', 'masculine', 'neutral'];

    genders.forEach(gender => {
      const result = generator.generate('simple', {}, gender);
      expect(result.name).toBeTruthy();
      expect(result.gender).toBe(gender);
    });
  });

  test('should respect minimum and maximum syllable constraints', () => {
    const options = {
      minSyllables: 2,
      maxSyllables: 3
    };

    const result = generator.generate('simple', options);
    const syllableCount = result.syllables.length;
    
    expect(syllableCount).toBeGreaterThanOrEqual(options.minSyllables);
    expect(syllableCount).toBeLessThanOrEqual(options.maxSyllables);
  });

  test('should generate unique names in bulk', () => {
    const count = 10;
    const results = generator.bulkGenerate(count);
    
    expect(results.length).toBe(count);
    
    // Check uniqueness
    const names = results.map(r => r.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(count);
  });

  test('should maintain name generation history', () => {
    const count = 5;
    for (let i = 0; i < count; i++) {
      generator.generate();
    }

    const history = generator.getHistory();
    expect(history.length).toBe(count);
  });

  test('should clear history when requested', () => {
    for (let i = 0; i < 5; i++) {
      generator.generate();
    }

    generator.clearHistory();
    expect(generator.getHistory().length).toBe(0);
  });

  test('should validate generated names against rules', () => {
    const result = generator.generate();
    const name = result.name.toLowerCase();

    // Test against validation rules
    VALIDATION_RULES.disallowedPatterns.forEach(pattern => {
      expect(pattern.test(name)).toBe(false);
    });
  });

  test('should handle custom rules', () => {
    const customRules = {
      avoidConsonants: ['x', 'z'],
      preferredConsonants: ['m', 'n', 'l'],
    };

    const results = generator.bulkGenerate(20, 'simple', {}, 'neutral', customRules);
    
    results.forEach(result => {
      const name = result.name.toLowerCase();
      customRules.avoidConsonants.forEach(consonant => {
        expect(name.includes(consonant)).toBe(false);
      });
    });
  });
});
