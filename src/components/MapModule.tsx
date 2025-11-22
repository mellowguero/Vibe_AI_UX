import type { MapModuleData } from '../types/modules'

type MapModuleProps = {
  data: MapModuleData
  onChange: (data: MapModuleData) => void
}

export function MapModule({ data, onChange }: MapModuleProps) {
  return (
    <div className="map-module">
      <input
        className="module-input"
        type="text"
        placeholder="Location or query (e.g. Pizza in SF)"
        value={data.locationQuery}
        onChange={(e) =>
          onChange({
            ...data,
            locationQuery: e.target.value,
          })
        }
      />
      <textarea
        className="module-textarea"
        placeholder="Optional description"
        value={data.description ?? ''}
        onChange={(e) =>
          onChange({
            ...data,
            description: e.target.value,
          })
        }
      />
      <div className="map-view">
        {data.locationQuery ? (
          <>
            <div className="map-view-title">
              Map preview for: <strong>{data.locationQuery}</strong>
            </div>
            <div className="map-view-placeholder">
              {/* Real map can come later */}
              Map placeholder (hook real API later)
            </div>
          </>
        ) : (
          <div className="map-view-empty">
            Enter a location or query to see a map preview.
          </div>
        )}
      </div>
    </div>
  )
}
