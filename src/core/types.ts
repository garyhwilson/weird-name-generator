export type NameStyle = 'simple' | 'celestial' | 'coastal' | 'desert' | 'draconic' | 'dwarf' | 'elven' | 'fae' | 'mythical' | 'nordic' | 'orcish' | 'sylvan';
export type GenderCharacteristic = 'feminine' | 'masculine' | 'neutral';

export interface IGenerationOptions {
  minSyllables?: number;
  maxSyllables?: number;
  forceEnding?: boolean;
  maxAttempts?: number;
}

export interface IPhoneticPatterns {
  preferredPatterns: Array<{
    pattern: string;
    weight: number;
  }>;
  endings: Record<string, number>;
}

export interface IStylePattern {
  minSyllables?: number;
  maxSyllables?: number;
  preferredPatterns: Array<{
    pattern: string;
    weight: number;
  }>;
  endings: Record<string, number>;
  consonantPreference?: 'rare' | 'common';
  vowelPreference?: 'diphthongs' | 'common' | 'mixed';
}

export interface ICustomRules extends Partial<IPhoneticPatterns>, Partial<IStylePattern> {
  avoidConsonants?: string[];
  preferredConsonants?: string[];
  stressPreference?: Record<number, string> | null;
}

export interface IGeneratorResult {
  name: string;
  syllables: string[];
  stress: string;
  style: NameStyle;
  gender: GenderCharacteristic;
}
