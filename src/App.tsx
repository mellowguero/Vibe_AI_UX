import { useState, useRef, useCallback } from 'react'
import type { ModuleType, ModuleInstance, ImageModuleData, MediaModuleData, TextModuleData, MapModuleData, SearchModuleData } from './types/modules'
import { ModuleCard } from './components/ModuleCard'
import { Inspector } from './components/Inspector'
import { CompositionMenu } from './components/CompositionMenu'
import { compositionRules } from './compositionRules'
import type { CompositionAction } from './compositionRules'

type PendingComposition = {
  fromId: string
  toId: string
  actions: CompositionAction[]
  position: { x: number; y: number }
} | null

const CARD_WIDTH = 250         // matches .module-card width
const CARD_HEIGHT = 140        // slightly larger than min-height
const PUSH_OFFSET_Y = CARD_HEIGHT + 16

function rectsOverlap(
  a: { x: number; y: number },
  b: { x: number; y: number }
) {
  return !(
    a.x + CARD_WIDTH < b.x ||
    a.x > b.x + CARD_WIDTH ||
    a.y + CARD_HEIGHT < b.y ||
    a.y > b.y + CARD_HEIGHT
  )
}

function App() {
  const [modules, setModules] = useState<ModuleInstance[]>([])
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [draggedModuleId, setDraggedModuleId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [pendingComposition, setPendingComposition] = useState<PendingComposition>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const moduleRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const addModule = (type: ModuleType) => {
    setModules((prev) => {
      const maxZ = prev.length ? Math.max(...prev.map((m) => m.z)) : 0
      let newModule: ModuleInstance

      if (type === 'image') {
        newModule = {
          id: crypto.randomUUID(),
          type: 'image',
          x: 100,
          y: 100,
          z: maxZ + 1,
          data: {
            imageUrl: '',
            label: '',
          },
        }
      } else if (type === 'media') {
        newModule = {
          id: crypto.randomUUID(),
          type: 'media',
          x: 140,
          y: 140,
          z: maxZ + 1,
          data: {
            title: 'New track',
            audioUrl: '',
          },
        }
      } else if (type === 'text') {
        newModule = {
          id: crypto.randomUUID(),
          type: 'text',
          x: 80,
          y: 80,
          z: maxZ + 1,
          data: {
            text: '',
          },
        }
      } else if (type === 'map') {
        newModule = {
          id: crypto.randomUUID(),
          type: 'map',
          x: 120,
          y: 120,
          z: maxZ + 1,
          data: {
            locationQuery: '',
            description: '',
          },
        }
      } else {
        // search
        newModule = {
          id: crypto.randomUUID(),
          type: 'search',
          x: 160,
          y: 160,
          z: maxZ + 1,
          data: {
            query: '',
            results: [],
          },
        }
      }

      // Check for overlaps and push existing modules down
      const adjustedExisting = prev.map(module => {
        if (rectsOverlap(newModule, module)) {
          return {
            ...module,
            y: module.y + PUSH_OFFSET_Y,
          }
        }
        return module
      })

      return [...adjustedExisting, newModule]
    })
  }

  const updateModule = (moduleId: string, newData: ImageModuleData | MediaModuleData | TextModuleData | MapModuleData | SearchModuleData) => {
    setModules((prevModules) =>
      prevModules.map((module) =>
        module.id === moduleId ? { ...module, data: newData } : module
      )
    )
  }

  const bringToFront = (moduleId: string) => {
    setModules((prevModules) => {
      if (prevModules.length === 0) return prevModules
      const maxZ = Math.max(...prevModules.map(m => m.z))
      return prevModules.map((module) =>
        module.id === moduleId ? { ...module, z: maxZ + 1 } : module
      )
    })
  }

  const handleMouseDown = (e: React.MouseEvent, moduleId: string, moduleX: number, moduleY: number) => {
    // Don't prevent default if clicking on interactive elements
    const target = e.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'BUTTON' ||
      target.closest('input, textarea, button')
    ) {
      return
    }
    
    e.preventDefault()
    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const mouseX = e.clientX - canvasRect.left
      const mouseY = e.clientY - canvasRect.top
      
      setDraggedModuleId(moduleId)
      setDragOffset({
        x: mouseX - moduleX,
        y: mouseY - moduleY,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedModuleId && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const newX = e.clientX - canvasRect.left - dragOffset.x
      const newY = e.clientY - canvasRect.top - dragOffset.y

      setModules((prevModules) =>
        prevModules.map((module) =>
          module.id === draggedModuleId
            ? { ...module, x: Math.max(0, newX), y: Math.max(0, newY) }
            : module
        )
      )
    }
  }

  const checkOverlap = (rect1: DOMRect, rect2: DOMRect): boolean => {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    )
  }

  const handleMouseUp = () => {
    if (draggedModuleId) {
      const draggedElement = moduleRefs.current.get(draggedModuleId)
      
      if (draggedElement) {
        const draggedRect = draggedElement.getBoundingClientRect()
        
        // Find the dragged module (from)
        const from = modules.find(m => m.id === draggedModuleId)
        
        if (from) {
          // Check against all other modules
          for (const [moduleId, element] of moduleRefs.current.entries()) {
            if (moduleId !== draggedModuleId) {
              const otherRect = element.getBoundingClientRect()
              
              if (checkOverlap(draggedRect, otherRect)) {
                // Find the overlapped module (to)
                const to = modules.find(m => m.id === moduleId)
                
                if (to) {
                  // Look up composition rule
                  const rule = compositionRules.find(
                    (r) => r.from === from.type && r.to === to.type
                  )
                  
                  if (rule && rule.actions.length > 0) {
                    const menuPosition = {
                      x: to.x + 20,
                      y: to.y + 20,
                    }
                    
                    setPendingComposition({
                      fromId: from.id,
                      toId: to.id,
                      actions: rule.actions,
                      position: menuPosition,
                    })
                    
                    setDraggedModuleId(null)
                    return // don't mutate modules here anymore
                  }
                }
              }
            }
          }
        }
      }
    }
    
    setDraggedModuleId(null)
  }


  const registerModuleRef = useCallback((moduleId: string, element: HTMLDivElement | null) => {
    if (element) {
      moduleRefs.current.set(moduleId, element)
    } else {
      moduleRefs.current.delete(moduleId)
    }
  }, [])

  return (
    <div className="app">
      <aside className="sidebar">
        <button onClick={() => addModule('image')}>Add Image</button>
        <button onClick={() => addModule('media')}>Add Music Player</button>
        <button onClick={() => addModule('text')}>Add Text</button>
        <button onClick={() => addModule('map')}>Add Map</button>
        <button onClick={() => addModule('search')}>Add Search</button>
      </aside>
      <div className="main-area">
        <div
          ref={canvasRef}
          className="canvas-container"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              isSelected={module.id === selectedModuleId}
              onSelect={() => setSelectedModuleId(module.id)}
              onMouseDown={handleMouseDown}
              onUpdate={(newData) => updateModule(module.id, newData)}
              moduleRef={(el) => registerModuleRef(module.id, el)}
              onBringToFront={() => bringToFront(module.id)}
            />
          ))}
          {pendingComposition && (
            <CompositionMenu
              actions={pendingComposition.actions}
              position={pendingComposition.position}
              onSelect={(action) => {
                setModules((prev) => {
                  const from = prev.find(
                    (m) => m.id === pendingComposition.fromId
                  )
                  const to = prev.find(
                    (m) => m.id === pendingComposition.toId
                  )
                  if (!from || !to) return prev

                  const [updatedFrom, updatedTo] = action.apply(from, to)

                  return prev.map((m) => {
                    if (m.id === updatedFrom.id) return updatedFrom
                    if (m.id === updatedTo.id) return updatedTo
                    return m
                  })
                })

                setPendingComposition(null)
              }}
              onCancel={() => setPendingComposition(null)}
            />
          )}
        </div>
        <Inspector
          selectedModule={modules.find((m) => m.id === selectedModuleId) || null}
          onChangeModule={(updated) =>
            setModules((prev) =>
              prev.map((m) => (m.id === updated.id ? updated : m))
            )
          }
        />
      </div>
    </div>
  )
}

export default App
