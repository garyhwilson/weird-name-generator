import { useState } from 'react'
import { useNameGenerator, useNameHistory } from '../../src/react'
import { GenerateOptions } from '../../src/react/useNameGenerator';
import type { NameStyle, GenderCharacteristic, IGeneratorResult, IPunctuationOptions } from '../../src/core/types'
import {
  Theme,
  Container,
  Flex,
  Box,
  Card,
  Text,
  Button,
  Heading,
  IconButton
} from '@radix-ui/themes'
import { ChevronDownIcon, ChevronUpIcon, StarIcon, Cross2Icon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import * as Switch from '@radix-ui/react-switch';
import * as Slider from '@radix-ui/react-slider';
import * as Select from '@radix-ui/react-select';

const styles: NameStyle[] = [
  'simple', 'elven', 'dwarf', 'mythical', 'draconic',
  'fae', 'orcish', 'celestial', 'coastal', 'desert',
  'nordic', 'sylvan'
]

const genders: GenderCharacteristic[] = ['neutral', 'feminine', 'masculine']

export function App() {
  const [selectedStyle, setSelectedStyle] = useState<NameStyle>('simple')
  const [selectedGender, setSelectedGender] = useState<GenderCharacteristic>('neutral')
  const [count, _setCount] = useState(5)
  const [selectedName, setSelectedName] = useState<IGeneratorResult | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [punctuationOptions, setPunctuationOptions] = useState<IPunctuationOptions>({
    enabled: false,
    maxPerName: 2
  });

  const {
    generate,
    bulkGenerate,
    loading,
    error
  } = useNameGenerator({
    defaultStyle: selectedStyle,
    defaultGender: selectedGender
  })

  const {
    history,
    addToHistory,
    favorites,
    favoriteItem,
    unfavoriteItem,
    clearHistory
  } = useNameHistory()

  const handleGenerate = async () => {
    try {
      const options: GenerateOptions = {
        style: selectedStyle,
        gender: selectedGender,
        punctuationOptions
      };
      const newResult = await generate(options);
      setSelectedName(newResult);
      addToHistory(newResult);
    } catch (err) {
      // Error handling is done by the hook
    }
  };

  const handleBulkGenerate = async () => {
    try {
      const options: GenerateOptions = {
        style: selectedStyle,
        gender: selectedGender,
        punctuationOptions
      };
      const results = await bulkGenerate(count, options);
      results.forEach(addToHistory);
      setSelectedName(results[results.length - 1]);
    } catch (err) {
      // Error handling is done by the hook
    }
  };

  const handleNameClick = (name: IGeneratorResult) => {
    setSelectedName(name)
  }

  const handleRemoveFromFavorites = (index: number) => {
    unfavoriteItem(index)
    if (selectedName && favorites[index]?.name === selectedName.name) {
      setSelectedName(null)
    }
  }

  const handleClearHistory = () => {
    clearHistory();
    setSelectedName(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <Theme appearance={theme} accentColor="violet" grayColor="slate" scaling="100%">
      <Container size="3">
        <Flex direction="column" gap="4" py="4">
          <Flex justify="between" align="center">
            <Heading size="8">Weird Name Generator</Heading>
            <IconButton
              variant="ghost"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </IconButton>
          </Flex>

          {error && (
            <Text color="red" size="2">
              {error.message}
            </Text>
          )}

          <Flex gap="4">
            <Card size="2" style={{ flex: 1 }}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text as="label" size="2" weight="bold">
                    Style
                  </Text>
                  <Select.Root
                    value={selectedStyle}
                    onValueChange={(value) => setSelectedStyle(value as NameStyle)}
                  >
                    <Select.Trigger className="SelectTrigger" aria-label="Style">
                      <Select.Value placeholder="Select a style" />
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="SelectContent">
                        <Select.ScrollUpButton className="SelectScrollButton">
                          <ChevronUpIcon />
                        </Select.ScrollUpButton>

                        <Select.Viewport className="SelectViewport">
                          {styles.map((style) => (
                            <Select.Item key={style} value={style} className="SelectItem">
                              <Select.ItemText>
                                {style.charAt(0).toUpperCase() + style.slice(1)}
                              </Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>

                        <Select.ScrollDownButton className="SelectScrollButton">
                          <ChevronDownIcon />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </Box>

                <Box>
                  <Text as="label" size="2" weight="bold">
                    Gender Characteristic
                  </Text>
                  <Select.Root
                    value={selectedGender}
                    onValueChange={(value) => setSelectedGender(value as GenderCharacteristic)}
                  >
                    <Select.Trigger className="SelectTrigger" aria-label="Gender">
                      <Select.Value placeholder="Select a gender" />
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="SelectContent">
                        <Select.ScrollUpButton className="SelectScrollButton">
                          <ChevronUpIcon />
                        </Select.ScrollUpButton>

                        <Select.Viewport className="SelectViewport">
                          {genders.map((gender) => (
                            <Select.Item key={gender} value={gender} className="SelectItem">
                              <Select.ItemText>
                                {gender.charAt(0).toUpperCase() + gender.slice(1)}
                              </Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>

                        <Select.ScrollDownButton className="SelectScrollButton">
                          <ChevronDownIcon />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </Box>

                <Box>
                  <Card size="2">
                    <Heading size="3" mb="4">Punctuation Options</Heading>
                    <Flex direction="column" gap="4">
                      <Flex justify="between" align="center">
                        <Text as="label" size="2" htmlFor="punctuation-switch">
                          Enable Special Characters
                        </Text>
                        <Switch.Root
                          id="punctuation-switch"
                          checked={punctuationOptions.enabled}
                          onCheckedChange={(checked) =>
                            setPunctuationOptions(prev => ({ ...prev, enabled: checked }))
                          }
                          className="SwitchRoot"
                        >
                          <Switch.Thumb className="SwitchThumb" />
                        </Switch.Root>
                      </Flex>

                      {punctuationOptions.enabled && (
                        <Box>
                          <Text as="label" size="2" mb="2">
                            Maximum Special Characters Per Name: {punctuationOptions.maxPerName}
                          </Text>
                          <Slider.Root
                            className="SliderRoot"
                            min={1}
                            max={4}
                            step={1}
                            value={[punctuationOptions.maxPerName || 2]}
                            onValueChange={([value]) =>
                              setPunctuationOptions(prev => ({ ...prev, maxPerName: value }))
                            }
                          >
                            <Slider.Track className="SliderTrack">
                              <Slider.Range className="SliderRange" />
                            </Slider.Track>
                            <Slider.Thumb className="SliderThumb" />
                          </Slider.Root>
                        </Box>
                      )}
                    </Flex>
                  </Card>
                </Box>

                <Flex gap="3">
                  <Button
                    onClick={handleGenerate}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Name'}
                  </Button>

                  <Button
                    onClick={handleBulkGenerate}
                    disabled={loading}
                    variant="soft"
                  >
                    Generate {count} Names
                  </Button>
                </Flex>

                {selectedName && (
                  <Card variant="classic">
                    <Flex direction="column" gap="2">
                      <Heading size="4">{selectedName.name}</Heading>
                      <Text size="2" color="gray">
                        Style: {selectedName.style} • Gender: {selectedName.gender}
                      </Text>
                      <Text size="2" color="gray">
                        Syllables: {selectedName.syllables.join(' - ')}
                      </Text>
                      <Text size="2" color="gray">
                        Stress Pattern: {selectedName.stress}
                      </Text>
                    </Flex>
                  </Card>
                )}
              </Flex>
            </Card>

            <Flex direction="column" gap="4" style={{ flex: 1 }}>
              <Card size="2">
                <Flex direction="column" gap="3">
                  <Flex justify="between" align="center">
                    <Heading size="3">History</Heading>
                    <Button
                      onClick={handleClearHistory}
                      variant="soft"
                      color="red"
                    >
                      Clear
                    </Button>
                  </Flex>

                  {history.map((item, index) => (
                    <Flex key={`${item.name}-${index}`} justify="between" align="center">
                      <Button
                        variant="ghost"
                        onClick={() => handleNameClick(item)}
                      >
                        {item.name}
                      </Button>
                      <IconButton
                        variant="ghost"
                        onClick={() => favoriteItem(index)}
                        aria-label="Add to favorites"
                      >
                        <StarIcon />
                      </IconButton>
                    </Flex>
                  ))}
                </Flex>
              </Card>

              <Card size="2">
                <Flex direction="column" gap="3">
                  <Heading size="3">Favorites</Heading>
                  {favorites.map((item, index) => (
                    <Flex key={`${item.name}-${index}`} justify="between" align="center">
                      <Button
                        variant="ghost"
                        onClick={() => handleNameClick(item)}
                      >
                        {item.name}
                      </Button>
                      <Flex gap="2" align="center">
                        <IconButton
                          variant="ghost"
                          color="red"
                          onClick={() => handleRemoveFromFavorites(index)}
                          aria-label="Remove from favorites"
                        >
                          <Cross2Icon />
                        </IconButton>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </Card>
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </Theme>
  )
}
