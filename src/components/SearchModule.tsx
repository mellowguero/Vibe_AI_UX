import type { SearchModuleData } from '../types/modules'

type SearchModuleProps = {
  data: SearchModuleData
  onChange: (data: SearchModuleData) => void
}

export function SearchModule({ data, onChange }: SearchModuleProps) {
  const hasResults = data.results && data.results.length > 0

  return (
    <div className="search-module">
      <input
        className="module-input"
        type="text"
        placeholder="Search query (e.g. best pizza in SF)"
        value={data.query}
        onChange={(e) =>
          onChange({
            ...data,
            query: e.target.value,
          })
        }
      />

      <div className="search-results">
        <div className="search-results-title">Search results</div>

        {hasResults ? (
          <div className="search-results-list">
            {data.results!.map((r) => (
              <div key={r.id} className="search-result-item">
                <div className="search-result-title">{r.title}</div>
                <div className="search-result-snippet">{r.snippet}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="search-results-empty">
            No results yet. (Stub)
            <br />
            Another module or future agent can populate this.
          </div>
        )}
      </div>
    </div>
  )
}

