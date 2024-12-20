import { describe, test, expect, beforeEach } from 'vitest';
import { NameGenerator } from '../../src/core/generator';
import { NameStyle, GenderCharacteristic, IPunctuationOptions } from '../../src/core/types';
import { VALIDATION_RULES, PUNCTUATION_RULES } from '../../src/core/constants';

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

    const options = {
      minSyllables: 2,
      maxSyllables: 3,
      maxAttempts: 100  // Increase max attempts for more complex styles
    };

    styles.forEach(style => {
      const result = generator.generate(style, options);
      expect(result.name).toBeTruthy();
      expect(result.style).toBe(style);
      expect(result.syllables.length).toBeGreaterThanOrEqual(options.minSyllables);
      expect(result.syllables.length).toBeLessThanOrEqual(options.maxSyllables);
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

  // New tests for punctuation features
  describe('Punctuation Features', () => {
    test('should not apply punctuation when disabled', () => {
      const punctuationOptions: IPunctuationOptions = {
        enabled: false
      };

      const result = generator.generate('elven', {}, 'neutral', undefined, punctuationOptions);
      // Check that no special characters are present
      expect(result.name).toMatch(/^[a-zA-Z]+$/);
    });

    test('should respect maxPerName limit when applying punctuation', () => {
      const punctuationOptions: IPunctuationOptions = {
        enabled: true,
        maxPerName: 1
      };

      const results = generator.bulkGenerate(20, 'elven', {}, 'neutral', undefined, punctuationOptions);

      results.forEach(result => {
        // Count special characters (this is a simplified check)
        const specialCharCount = (result.name.match(/[^a-zA-Z]/g) || []).length;
        expect(specialCharCount).toBeLessThanOrEqual(1);
      });
    });

    test('should not apply punctuation to adjacent characters', () => {
      const punctuationOptions: IPunctuationOptions = {
        enabled: true,
        maxPerName: 2
      };

      const results = generator.bulkGenerate(20, 'elven', {}, 'neutral', undefined, punctuationOptions);

      results.forEach(result => {
        // Check that no special characters are adjacent
        expect(result.name).not.toMatch(/[^a-zA-Z][^a-zA-Z]/);
      });
    });

    test('should only apply style-appropriate punctuation', () => {
      const punctuationOptions = {
        enabled: true,
        maxPerName: 2
      };

      // Test with Nordic style which has specific punctuation rules
      const options = {
        minSyllables: 2,
        maxSyllables: 3,
        maxAttempts: 100
      };

      // Generate multiple names to increase chance of getting punctuation
      const results = generator.bulkGenerate(10, 'nordic', options, 'neutral', undefined, punctuationOptions);

      results.forEach(result => {
        const name = result.name;

        // If the name contains special characters
        if (!/^[a-zA-Z]+$/.test(name)) {
          // Should only contain Nordic-specific characters
          const hasNonNordicSpecialChars = /[^a-zA-ZøæåØÆÅ]/.test(name);
          expect(hasNonNordicSpecialChars).toBe(false);

          // If there are special characters, they should be Nordic ones
          const specialChars = name.match(/[^a-zA-Z]/g) || [];
          specialChars.forEach(char => {
            expect(['ø', 'æ', 'å', 'Ø', 'Æ', 'Å']).toContain(char);
          });
        }
      });
    });
  });
});
