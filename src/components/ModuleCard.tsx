import { useRef, useEffect } from 'react'
import type { ModuleInstance, ImageModuleData, MediaModuleData, TextModuleData, MapModuleData, SearchModuleData } from '../types/modules'
import { ImageModule } from './ImageModule'
import { MediaModule } from './MediaModule'
import { TextModule } from './TextModule'
import { MapModule } from './MapModule'
import { SearchModule } from './SearchModule'

interface ModuleCardProps {
  module: ModuleInstance
  isSelected: boolean
  onSelect: () => void
  onMouseDown: (e: React.MouseEvent, moduleId: string, moduleX: number, moduleY: number) => void
  onUpdate: (newData: ImageModuleData | MediaModuleData | TextModuleData | MapModuleData | SearchModuleData) => void
  moduleRef: (element: HTMLDivElement | null) => void
  onBringToFront: () => void
  onDelete: () => void
}

export function ModuleCard({ module, isSelected, onSelect, onMouseDown, onUpdate, moduleRef, onBringToFront, onDelete }: ModuleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    moduleRef(cardRef.current)
    return () => moduleRef(null)
  }, [moduleRef])

  const getModuleLabel = (type: ModuleInstance['type']) => {
    switch (type) {
      case 'image':
        return 'Image'
      case 'media':
        return 'Music Player'
      case 'text':
        return 'Text'
      case 'map':
        return 'Map'
      case 'search':
        return 'Search'
    }
  }

  return (
    <div
      ref={cardRef}
      className="module-card"
      style={{
        left: `${module.x}px`,
        top: `${module.y}px`,
        zIndex: module.z,
        outline: isSelected ? '2px solid #4c8dff' : 'none',
      }}
      onMouseDown={(e) => {
        // Don't start dragging if clicking on an input, textarea, or button
        const target = e.target as HTMLElement
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'BUTTON' ||
          target.closest('input, textarea, button')
        ) {
          return
        }
        onSelect()
        onBringToFront()
        onMouseDown(e, module.id, module.x, module.y)
      }}
    >
      <div
        className="module-header"
        onMouseDown={(e) => {
          onBringToFront()
          onMouseDown(e, module.id, module.x, module.y)
        }}
      >
        {getModuleLabel(module.type)}
        <button
          className="module-close-button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          onMouseDown={(e) => e.stopPropagation()}
          title="Close module"
        >
          ×
        </button>
      </div>
      <div className="module-content">
        {module.type === 'image' && (
          <ImageModule
            data={module.data}
            onUpdate={(data) => onUpdate(data)}
          />
        )}
        {module.type === 'media' && (
          <MediaModule
            data={module.data}
            onUpdate={(data) => onUpdate(data)}
          />
        )}
        {module.type === 'text' && (
          <TextModule
            data={module.data}
            onUpdate={(data) => onUpdate(data)}
          />
        )}
        {module.type === 'map' && (
          <MapModule
            data={module.data}
            onChange={(data) => onUpdate(data)}
            moduleId={module.id}
          />
        )}
        {module.type === 'search' && (
          <SearchModule
            data={module.data}
            onChange={(data) => onUpdate(data)}
          />
        )}
      </div>
    </div>
  )
}
