import { useState } from 'react'
import { useNameGenerator, useNameHistory } from '../../src/react'
import type { NameStyle, GenderCharacteristic, IGeneratorResult } from '../../src/core/types'

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
      const newResult = await generate()
      setSelectedName(newResult)
      addToHistory(newResult)
    } catch (err) {
      // Error handling is done by the hook
    }
  }

  const handleBulkGenerate = async () => {
    try {
      const results = await bulkGenerate(count)
      results.forEach(addToHistory)
      setSelectedName(results[results.length - 1])
    } catch (err) {
      // Error handling is done by the hook
    }
  }

  const handleNameClick = (name: IGeneratorResult) => {
    setSelectedName(name)
  }

  const handleRemoveFromFavorites = (index: number) => {
    unfavoriteItem(index)
    if (selectedName && favorites[index]?.name === selectedName.name) {
      setSelectedName(null)
    }
  }

  return (
    <div className="center stack-large">
      <header className="stack">
        <h1 className="heading">Fantasy Name Generator</h1>
        {error && (
          <div className="alert alert--error">
            {error.message}
          </div>
        )}
      </header>

      <main className="grid">
        <section className="generator">
          <div className="generator__controls">
            <div className="stack">
              <label htmlFor="style">Style</label>
              <select
                id="style"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as NameStyle)}
                className="input"
                disabled={loading}
              >
                {styles.map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="stack">
              <label htmlFor="gender">Gender Characteristic</label>
              <select
                id="gender"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value as GenderCharacteristic)}
                className="input"
                disabled={loading}
              >
                {genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="cluster">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="button"
              >
                {loading ? 'Generating...' : 'Generate Name'}
              </button>

              <button
                onClick={handleBulkGenerate}
                disabled={loading}
                className="button button--secondary"
              >
                Generate {count} Names
              </button>
            </div>
          </div>

          {selectedName && (
            <div className="generator__result">
              <h2>{selectedName.name}</h2>
              <p>Style: {selectedName.style} • Gender: {selectedName.gender}</p>
              <p className="generator__result-details">
                Syllables: {selectedName.syllables.join(' - ')}
                <br />
                Stress Pattern: {selectedName.stress}
              </p>
            </div>
          )}
        </section>

        <div className="stack-large">
          <section className="card">
            <div className="card__header">
              <h2 className="heading">History</h2>
              <button
                onClick={clearHistory}
                className="button button--secondary"
              >
                Clear
              </button>
            </div>
            <ul className="name-list">
              {history.map((item, index) => (
                <li key={`${item.name}-${index}`} className="name-list__item">
                  <div className="name-list__content">
                    <button 
                      className="name-list__name-button"
                      onClick={() => handleNameClick(item)}
                    >
                      {item.name}
                    </button>
                    <button
                      onClick={() => favoriteItem(index)}
                      className="button button--icon"
                    >
                      ★
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="heading">Favorites</h2>
            <ul className="name-list">
              {favorites.map((item, index) => (
                <li key={`${item.name}-${index}`} className="name-list__item">
                  <div className="name-list__content">
                    <button 
                      className="name-list__name-button"
                      onClick={() => handleNameClick(item)}
                    >
                      {item.name}
                    </button>
                    <div className="name-list__actions">
                      <button
                        onClick={() => handleRemoveFromFavorites(index)}
                        className="button button--icon button--danger"
                        aria-label="Remove from favorites"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
