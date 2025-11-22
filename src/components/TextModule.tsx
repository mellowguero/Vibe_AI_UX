import type { TextModuleData } from '../types/modules'

interface TextModuleProps {
  data: TextModuleData
  onUpdate: (data: TextModuleData) => void
}

export function TextModule({ data, onUpdate }: TextModuleProps) {
  return (
    <div className="text-module">
      <textarea
        placeholder="Enter text..."
        value={data.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        className="module-textarea"
      />
    </div>
  )
}
