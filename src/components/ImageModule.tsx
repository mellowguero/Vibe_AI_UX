import type { ImageModuleData } from '../types/modules'

interface ImageModuleProps {
  data: ImageModuleData
  onUpdate: (data: ImageModuleData) => void
}

export function ImageModule({ data, onUpdate }: ImageModuleProps) {
  return (
    <div className="image-module">
      <input
        type="text"
        placeholder="Image URL"
        value={data.imageUrl}
        onChange={(e) => onUpdate({ ...data, imageUrl: e.target.value })}
        className="module-input"
      />
      <input
        type="text"
        placeholder="Label (optional)"
        value={data.label || ''}
        onChange={(e) => onUpdate({ ...data, label: e.target.value })}
        className="module-input"
      />
      {data.imageUrl && (
        <img src={data.imageUrl} alt={data.label || 'Image'} className="image-preview" />
      )}
    </div>
  )
}
