import type { ChatMessage, ModuleType } from '../types/modules'
import { ExpandIcon, CollapseIcon, ExtractIcon, DragHandleIcon } from './shared/Icon'

interface UserMessageBubbleProps {
  message: ChatMessage
  isExpanded: boolean
  onToggleExpand: () => void
  onExtract: () => void
  onDragStart: (e: React.MouseEvent) => void
  renderNestedModule: (message: ChatMessage, isExpanded: boolean) => React.ReactNode
  onExtractModule?: (moduleType: ModuleType, moduleData: any, position: { x: number; y: number }) => void
}

export function UserMessageBubble({
  message,
  isExpanded,
  onToggleExpand,
  onExtract,
  onDragStart,
  renderNestedModule,
  onExtractModule,
}: UserMessageBubbleProps) {
  return (
    <div className="chat-message chat-message-user">
      <div className="chat-message-bubble">
        {message.text && (
          <div className="chat-message-text">{message.text}</div>
        )}
        {message.nestedModule?.type === 'media' && (
          <div className="music-module-placeholder"></div>
        )}
        {message.nestedModule && message.nestedModule.type !== 'media' && (
          <div className="chat-message-nested">
            {renderNestedModule(message, isExpanded)}
            <div className="nested-module-actions">
              <button
                className="nested-module-toggle"
                onClick={onToggleExpand}
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <CollapseIcon size="xs" /> : <ExpandIcon size="xs" />}
              </button>
              {onExtractModule && (
                <>
                  <button
                    className="nested-module-extract"
                    onClick={onExtract}
                    title="Extract to desktop"
                  >
                    <ExtractIcon size="xs" />
                  </button>
                  <div
                    className="nested-module-drag-handle"
                    onMouseDown={onDragStart}
                    title="Drag to desktop"
                  >
                    <DragHandleIcon size="xs" />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="chat-message-time">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}
