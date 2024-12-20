import { IGeneratorResult, NameStyle, GenderCharacteristic, IGenerationOptions, ICustomRules, IStylePattern } from './types';
import { STYLE_PATTERNS, GENDER_CHARACTERISTICS, STRESS_PATTERNS, PHONETICS, VALIDATION_RULES } from './constants';

export class NameGenerator {
    private history: IGeneratorResult[] = [];
  
    private getWeightedRandom(obj: Record<string, number>): string {
      const entries = Object.entries(obj);
      const total = entries.reduce((sum, [_, weight]) => sum + weight, 0);
      let random = Math.random() * total;
      
      for (const [item, weight] of entries) {
        random -= weight;
        if (random <= 0) return item;
      }
      return entries[0][0];
    }
  
    private generatePhoneme(type: string, rules: ICustomRules & Record<string, unknown>): string {
      let pool: Record<string, number>;
  
      switch (type) {
        case 'C':
          pool = rules.consonantPreference === 'rare' 
            ? { ...PHONETICS.consonants.common, ...PHONETICS.consonants.rare }
            : PHONETICS.consonants.common;
          break;
        case 'V':
          pool = rules.vowelPreference === 'diphthongs'
            ? { ...PHONETICS.vowels.common, ...PHONETICS.vowels.diphthongs }
            : PHONETICS.vowels.common;
          break;
        default:
          return type.toLowerCase();
      }
  
      let result: string;
      do {
        result = this.getWeightedRandom(pool);
      } while (
        (rules.avoidConsonants?.includes(result) && type === 'C') ||
        (result.length > 1 && Math.random() > 0.3)
      );
  
      return result;
    }
  
    private generateSyllable(pattern: string, rules: ICustomRules & Record<string, unknown>): string {
      return pattern.split('').map(char => {
        if (char === 'C' && Math.random() < 0.3) {
          return this.getWeightedRandom(PHONETICS.consonantBlends.initial);
        }
        return this.generatePhoneme(char, rules);
      }).join('');
    }
  
    private applyStress(syllables: string[], stressPattern: string): string[] {
      return syllables.map((syllable, index) => {
        const stress = parseInt(stressPattern[index]);
        switch (stress) {
          case 1:
            return syllable.toUpperCase();
          case 2:
            return syllable.charAt(0).toUpperCase() + syllable.slice(1);
          default:
            return syllable.toLowerCase();
        }
      });
    }
  
    private validateWord(word: string, isSingleSyllable: boolean): boolean {
      if (isSingleSyllable) {
        const length = word.length;
        const rules = VALIDATION_RULES.singleSyllableRules;
        
        if (length < rules.minLength || length > rules.maxLength) return false;
        return rules.preferredPatterns.some(pattern => pattern.test(word));
      }
  
      for (const pattern of VALIDATION_RULES.disallowedPatterns) {
        if (pattern.test(word)) return false;
      }
  
      for (const pattern of VALIDATION_RULES.disallowedEndings) {
        if (pattern.test(word)) return false;
      }
  
      return word.length >= 3 && word.length <= 12;
    }
  
    public generate(
      style: NameStyle = 'simple',
      options: IGenerationOptions = {},
      gender: GenderCharacteristic = 'neutral',
      customRules?: ICustomRules
    ): IGeneratorResult {
      const baseStylePattern = STYLE_PATTERNS[style];
      const genderTraits = GENDER_CHARACTERISTICS[gender];
      
      const mergedRules = {
        ...baseStylePattern,
        ...genderTraits,
        ...customRules,
        preferredPatterns: customRules?.preferredPatterns || baseStylePattern.preferredPatterns
      } as IStylePattern & ICustomRules;
  
      const {
        minSyllables = mergedRules.minSyllables ?? 1,
        maxSyllables = mergedRules.maxSyllables ?? 3,
        forceEnding = true,
        maxAttempts = 50
      } = options;
  
      let attempts = 0;
      let word: string;
      let syllables: string[];
      let stressPattern: string;
      let currentSyllableCount: number;
  
      do {
        attempts++;
        syllables = [];
        
        currentSyllableCount = Math.floor(
          Math.random() * (maxSyllables - minSyllables + 1) + minSyllables
        );
  
        for (let i = 0; i < currentSyllableCount; i++) {
          const patternObj = this.getWeightedRandom(
            Object.fromEntries(
              mergedRules.preferredPatterns.map(p => [p.pattern, p.weight])
            )
          );
          syllables.push(this.generateSyllable(patternObj, mergedRules as ICustomRules & Record<string, unknown>));
        }
  
        const stressPreference = mergedRules.stressPreference;
        stressPattern = (stressPreference && 
                        typeof stressPreference === 'object' && 
                        currentSyllableCount in stressPreference &&
                        typeof stressPreference[currentSyllableCount as keyof typeof stressPreference] === 'string')
          ? stressPreference[currentSyllableCount as keyof typeof stressPreference]
          : this.getWeightedRandom(
              Object.fromEntries(
                STRESS_PATTERNS[currentSyllableCount as keyof typeof STRESS_PATTERNS]
                  .map(p => [p.pattern, p.weight])
              )
            );
        
        const stressedSyllables = this.applyStress(syllables, stressPattern);
  
        if (forceEnding) {
          const ending = this.getWeightedRandom(mergedRules.endings);
          if (/[aeiou]$/i.test(stressedSyllables[stressedSyllables.length - 1]) && 
              /^[aeiou]/i.test(ending)) {
            stressedSyllables[stressedSyllables.length - 1] = 
              stressedSyllables[stressedSyllables.length - 1].slice(0, -1);
          }
          stressedSyllables.push(ending.toLowerCase());
          syllables.push(ending);
        }
  
        word = stressedSyllables.join('');
  
      } while (!this.validateWord(word, currentSyllableCount === 1) && attempts < maxAttempts);
  
      if (attempts >= maxAttempts) {
        throw new Error(`Failed to generate valid name after ${maxAttempts} attempts`);
      }
  
      word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  
      const result: IGeneratorResult = {
        name: word,
        syllables,
        stress: stressPattern,
        style,
        gender
      };
  
      this.history.push(result);
  
      return result;
    }
  
    public bulkGenerate(
      count: number,
      style?: NameStyle,
      options?: IGenerationOptions,
      gender?: GenderCharacteristic,
      customRules?: ICustomRules
    ): IGeneratorResult[] {
      const names = new Set<IGeneratorResult>();
      let attempts = 0;
      const maxBulkAttempts = 100;

      while (names.size < count && attempts < maxBulkAttempts) {
        try {
          const result = this.generate(style, options, gender, customRules);
          names.add(result);
        } catch (error) {
          attempts++;
          if (attempts >= maxBulkAttempts) {
            throw new Error(`Failed to generate ${count} unique names after ${maxBulkAttempts} attempts`);
          }
        }
      }
      return Array.from(names);
    }
  
    public getHistory(): IGeneratorResult[] {
      return this.history;
    }
  
    public clearHistory(): void {
      this.history = [];
    }
  }
  