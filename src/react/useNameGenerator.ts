import { useState, useCallback, useRef } from 'react';
import { NameGenerator } from '../core/generator';
import type {
  NameStyle,
  GenderCharacteristic,
  IGenerationOptions,
  IGeneratorResult,
  ICustomRules,
  IPunctuationOptions,
} from '../core/types';

export interface UseNameGeneratorOptions {
  defaultStyle?: NameStyle;
  defaultGender?: GenderCharacteristic;
  defaultOptions?: IGenerationOptions;
  defaultCustomRules?: ICustomRules;
}

export interface GenerateOptions {
  style?: NameStyle;
  gender?: GenderCharacteristic;
  options?: IGenerationOptions;
  customRules?: ICustomRules;
  punctuationOptions?: IPunctuationOptions;
}

export interface UseNameGeneratorResult {
  generate: (options?: GenerateOptions) => Promise<IGeneratorResult>;
  bulkGenerate: (count: number, options?: GenerateOptions) => Promise<IGeneratorResult[]>;
  result: IGeneratorResult | null;
  history: IGeneratorResult[];
  loading: boolean;
  error: Error | null;
}

export function useNameGenerator({
  defaultStyle = 'simple',
  defaultGender = 'neutral',
  defaultOptions = {},
  defaultCustomRules = {},
}: UseNameGeneratorOptions = {}): UseNameGeneratorResult {
  const generator = useRef<NameGenerator>(new NameGenerator());
  const [result, setResult] = useState<IGeneratorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generate = useCallback(
    async ({
      style = defaultStyle,
      gender = defaultGender,
      options = defaultOptions,
      customRules = defaultCustomRules,
      punctuationOptions = { enabled: false },
    }: GenerateOptions = {}) => {
      setLoading(true);
      setResult(null);
      setError(null);

      try {
        const newResult = generator.current.generate(
          style,
          options,
          gender,
          customRules,
          punctuationOptions
        );
        setResult(newResult);
        return newResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to generate name');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [defaultStyle, defaultGender, defaultOptions, defaultCustomRules]
  );

  const bulkGenerate = useCallback(
    async (
      count: number,
      {
        style = defaultStyle,
        gender = defaultGender,
        options = defaultOptions,
        customRules = defaultCustomRules,
        punctuationOptions = { enabled: false },
      }: GenerateOptions = {}
    ) => {
      setLoading(true);
      setError(null);

      try {
        const results = generator.current.bulkGenerate(
          count,
          style,
          options,
          gender,
          customRules,
          punctuationOptions
        );
        return results;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to generate names');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [defaultStyle, defaultGender, defaultOptions, defaultCustomRules]
  );

  return {
    generate,
    bulkGenerate,
    result,
    history: generator.current.getHistory(),
    loading,
    error,
  };
}
