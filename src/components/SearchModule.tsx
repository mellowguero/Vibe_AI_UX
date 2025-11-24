import { useEffect, useRef } from 'react'
import type { SearchModuleData } from '../types/modules'
import { searchDuckDuckGo } from '../api/services'

type SearchModuleProps = {
  data: SearchModuleData
  onChange: (data: SearchModuleData) => void
}

export function SearchModule({ data, onChange }: SearchModuleProps) {
  const hasResults = data.results && data.results.length > 0
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const query = data.query || ''
    const currentData = { ...data } // Capture current data to avoid stale closure

    // Don't search if query is empty
    if (!query.trim()) {
      onChange({
        ...currentData,
        query: query, // Ensure query is always a string
        results: [],
        isLoading: false,
      })
      return
    }

    // Set loading state
    onChange({
      ...currentData,
      isLoading: true,
    })

    // Debounce search API call
    debounceTimerRef.current = setTimeout(async () => {
      const results = await searchDuckDuckGo(query)
      console.log('SearchModule: Got results, updating state:', results)
      // Update with captured data
      onChange({
        ...currentData,
        results,
        isLoading: false,
      })
    }, 500) // 500ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.query]) // Only re-run when query changes

  return (
    <div className="search-module">
      <input
        className="module-input"
        type="text"
        placeholder="Search query (e.g. best pizza in SF)"
        value={data.query || ''}
        onChange={(e) =>
          onChange({
            ...data,
            query: e.target.value,
            isLoading: true, // Set loading immediately on input
          })
        }
      />

      <div className="search-results">
        <div className="search-results-title">Search results</div>

        {(() => {
          console.log('SearchModule render - isLoading:', data.isLoading, 'hasResults:', hasResults, 'results:', data.results)
          if (data.isLoading) {
            return <div className="search-results-empty">Searching...</div>
          }
          if (hasResults) {
            return (
              <div className="search-results-list">
                {data.results!.map((r) => (
                  <div key={r.id} className="search-result-item">
                    <div className="search-result-title">{r.title}</div>
                    <div className="search-result-snippet">{r.snippet}</div>
                  </div>
                ))}
              </div>
            )
          }
          return (
            <div className="search-results-empty">
              {(data.query || '').trim() ? 'No results found.' : 'Enter a search query to get results.'}
            </div>
          )
        })()}
      </div>
    </div>
  )
}

