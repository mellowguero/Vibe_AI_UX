import type { CompositionAction } from './compositionRules'

type CompositionMenuProps = {
  actions: CompositionAction[]
  position: { x: number; y: number }
  onSelect: (action: CompositionAction) => void
  onCancel: () => void
}

export function CompositionMenu({
  actions,
  position,
  onSelect,
  onCancel,
}: CompositionMenuProps) {
  return (
    <div
      className="composition-menu"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
      }}
    >
      <div className="composition-menu-inner">
        {actions.map((action, index) => (
          <button
            key={index}
            className="composition-menu-button"
            onClick={() => onSelect(action)}
          >
            {action.label}
          </button>
        ))}
        <button
          className="composition-menu-cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

