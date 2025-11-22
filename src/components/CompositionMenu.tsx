import type { CompositionAction } from '../compositionRules'

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
            onClick={() => onSelect(action)}
            className="composition-menu-button"
          >
            {action.label}
          </button>
        ))}
        <button onClick={onCancel} className="composition-menu-cancel">
          Cancel
        </button>
      </div>
    </div>
  )
}
