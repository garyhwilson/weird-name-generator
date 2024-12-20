export type NameStyle = 'simple' | 'celestial' | 'coastal' | 'desert' | 'draconic' | 'dwarf' | 'elven' | 'fae' | 'mythical' | 'nordic' | 'orcish' | 'sylvan';
export type GenderCharacteristic = 'feminine' | 'masculine' | 'neutral';

export type PunctuationType = 
  | 'grave'      // `
  | 'acute'      // ´
  | 'circumflex' // ^
  | 'umlaut'     // ¨
  | 'tilde'      // ~
  | 'apostrophe' // '
  | 'hyphen'     // -
  | 'ash'        // æ
  | 'slashed-o'  // ø
  | 'ring'       // å
  | 'oe'         // œ

export interface PunctuationRule {
  type: PunctuationType;
  probability: number;      // Chance of applying this punctuation (0-1)
  allowedPositions: ('start' | 'middle' | 'end')[]; // Where it can be applied
  allowedCharacters?: string[]; // Specific characters it can be applied to
  style?: NameStyle[];     // Optional: only apply to specific styles
}

export interface IPunctuationOptions {
  enabled: boolean;
  rules?: PunctuationRule[];
  maxPerName?: number;     // Maximum punctuation marks per name
}
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
