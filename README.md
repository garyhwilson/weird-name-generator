# Weird Name Generator

A flexible and customizable weird name generator with support for various styles, customizable rules, and React integration. Generate unique names for characters, places, or any other fantasy/sci-fi elements with options for different styles, gender characteristics, and special character rules.

## Demo

Check out the [live demo](https://weird-name-generator-demo.vercel.app) to see the generator in action. The demo source code is available in the `demo/` directory and showcases a full-featured React implementation using the generator and its hooks. For instructions on running the demo locally, see [DEMO.md](./demo/README.md).

## Features

- Multiple preset name styles (Elven, Draconic, Nordic, etc.)
- Gender characteristic options
- Syllable customization
- Special characters and diacritical marks support
- React hook for easy integration
- History and favorites management
- Full TypeScript support
- Zero dependencies (except React for hook usage)

## Installation

```bash
npm install weird-name-generator
```

## Core Usage

### Basic Usage

```typescript
import { NameGenerator } from 'weird-name-generator';

const generator = new NameGenerator();

// Generate a simple name
const result = generator.generate();
console.log(result.name); // e.g., "Kaleth"

// Generate with specific style
const elvenName = generator.generate('elven');
console.log(elvenName.name); // e.g., "Aethindril"

// Generate with gender characteristic
const femaleName = generator.generate('elven', {}, 'feminine');
console.log(femaleName.name); // e.g., "Elowen"
```

### Available Styles

- `simple` - Basic names
- `elven` - Elegant, flowing names with soft sounds
- `dwarf` - Sturdy, consonant-heavy names
- `mythical` - Exotic, mystical-sounding names
- `draconic` - Strong, imposing names with harsh sounds
- `fae` - Whimsical, ethereal names
- `orcish` - Brutal, guttural names
- `celestial` - Divine, harmonious names
- `coastal` - Flowing, water-themed names
- `desert` - Arid, harsh-sounding names
- `nordic` - Norse-inspired names
- `sylvan` - Nature-themed, flowing names

### Generation Options

```typescript
interface IGenerationOptions {
  minSyllables?: number;
  maxSyllables?: number;
  forceEnding?: boolean;
  maxAttempts?: number;
}

// Example usage
const options: IGenerationOptions = {
  minSyllables: 2,
  maxSyllables: 3,
  forceEnding: true
};

const name = generator.generate('elven', options);
```

### Special Characters and Punctuation

```typescript
interface IPunctuationOptions {
  enabled: boolean;
  maxPerName?: number;
}

// Example with special characters
const punctuationOptions: IPunctuationOptions = {
  enabled: true,
  maxPerName: 2
};

const nameWithSpecialChars = generator.generate('nordic', {}, 'neutral', undefined, punctuationOptions);
console.log(nameWithSpecialChars.name); // e.g., "Bjørn"
```

### Bulk Generation

```typescript
const names = generator.bulkGenerate(5, 'elven');
console.log(names.map(result => result.name));
```

## React Hook Usage

### useNameGenerator Hook

```typescript
import { useNameGenerator } from 'weird-name-generator/react';

function NameGeneratorComponent() {
  const {
    generate,
    bulkGenerate,
    result,
    loading,
    error
  } = useNameGenerator({
    defaultStyle: 'elven',
    defaultGender: 'neutral'
  });

  const handleGenerate = async () => {
    try {
      const newName = await generate({
        style: 'elven',
        punctuationOptions: {
          enabled: true,
          maxPerName: 1
        }
      });
      console.log(newName);
    } catch (err) {
      console.error('Failed to generate name:', err);
    }
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        Generate Name
      </button>
      {result && <div>{result.name}</div>}
      {error && <div>{error.message}</div>}
    </div>
  );
}
```

### useNameHistory Hook

```typescript
import { useNameHistory } from 'weird-name-generator/react';

function NameHistoryComponent() {
  const {
    history,
    addToHistory,
    favorites,
    favoriteItem,
    unfavoriteItem,
    clearHistory
  } = useNameHistory({
    maxHistorySize: 50,
    persistToStorage: true
  });

  return (
    <div>
      <h2>History</h2>
      <ul>
        {history.map((item, index) => (
          <li key={`${item.name}-${index}`}>
            {item.name}
            <button onClick={() => favoriteItem(index)}>
              Add to Favorites
            </button>
          </li>
        ))}
      </ul>

      <h2>Favorites</h2>
      <ul>
        {favorites.map((item, index) => (
          <li key={`${item.name}-${index}`}>
            {item.name}
            <button onClick={() => unfavoriteItem(index)}>
              Remove from Favorites
            </button>
          </li>
        ))}
      </ul>

      <button onClick={clearHistory}>Clear History</button>
    </div>
  );
}
```

### Hook Options

#### useNameGenerator Options
```typescript
interface UseNameGeneratorOptions {
  defaultStyle?: NameStyle;
  defaultGender?: GenderCharacteristic;
  defaultOptions?: IGenerationOptions;
  defaultCustomRules?: ICustomRules;
}
```

#### useNameHistory Options
```typescript
interface UseNameHistoryOptions {
  maxHistorySize?: number;
  persistToStorage?: boolean;
}
```

## Custom Rules

You can customize name generation with custom rules:

```typescript
interface ICustomRules {
  avoidConsonants?: string[];
  preferredConsonants?: string[];
  stressPreference?: Record<number, string> | null;
}

const customRules: ICustomRules = {
  avoidConsonants: ['x', 'z'],
  preferredConsonants: ['m', 'n', 'l']
};

const name = generator.generate('simple', {}, 'neutral', customRules);
```

## Type Definitions

The package includes comprehensive TypeScript definitions for all features:

```typescript
type NameStyle = 'simple' | 'elven' | 'dwarf' | 'mythical' | 'draconic' | 
                 'fae' | 'orcish' | 'celestial' | 'coastal' | 'desert' | 
                 'nordic' | 'sylvan';

type GenderCharacteristic = 'feminine' | 'masculine' | 'neutral';

interface IGeneratorResult {
  name: string;
  syllables: string[];
  stress: string;
  style: NameStyle;
  gender: GenderCharacteristic;
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
