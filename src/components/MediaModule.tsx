import type { MediaModuleData } from '../types/modules'

interface MediaModuleProps {
  data: MediaModuleData
  onUpdate: (data: MediaModuleData) => void
}

export function MediaModule({ data, onUpdate }: MediaModuleProps) {
  return (
    <div className="media-module">
      <input
        type="text"
        placeholder="Title"
        value={data.title}
        onChange={(e) => onUpdate({ ...data, title: e.target.value })}
        className="module-input"
      />
      <input
        type="text"
        placeholder="Audio URL"
        value={data.audioUrl}
        onChange={(e) => onUpdate({ ...data, audioUrl: e.target.value })}
        className="module-input"
      />
      {data.audioUrl && (
        <audio
          src={data.audioUrl}
          controls
          style={{ width: '100%', marginTop: '0.5rem' }}
        />
      )}
    </div>
  )
}
