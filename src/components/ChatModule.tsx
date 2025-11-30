import { useState, useRef, useEffect } from 'react'
import type { ChatModuleData, ChatMessage, ModuleType } from '../types/modules'
import { chatWithAI } from '../api/services'
import { MediaModule } from './MediaModule'
import { ImageModule } from './ImageModule'
import { TextModule } from './TextModule'
import { MapModule } from './MapModule'
import { SearchModule } from './SearchModule'

interface ChatModuleProps {
  data: ChatModuleData
  onUpdate: (data: ChatModuleData) => void
  onExtractModule?: (moduleType: ModuleType, moduleData: any, position: { x: number; y: number }) => void
}

export function ChatModule({ data, onUpdate, onExtractModule }: ChatModuleProps) {
  const [inputText, setInputText] = useState('')
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data.messages])

  const handleSend = async () => {
    if (!inputText.trim() || data.isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: Date.now(),
    }

    // Add user message immediately
    const updatedMessages = [...data.messages, userMessage]
    onUpdate({
      ...data,
      messages: updatedMessages,
      isLoading: true,
      error: undefined,
    })

    setInputText('')

    try {
      // Call OpenAI API
      const aiMessage = await chatWithAI(updatedMessages)
      
      // Add AI response
      onUpdate({
        ...data,
        messages: [...updatedMessages, aiMessage],
        isLoading: false,
      })
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: error instanceof Error ? error.message : 'Failed to get AI response. Please check your OpenAI API key.',
        timestamp: Date.now(),
      }
      onUpdate({
        ...data,
        messages: [...updatedMessages, errorMessage],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleDragStart = (e: React.MouseEvent, messageId: string) => {
    const message = data.messages.find(m => m.id === messageId)
    if (!message?.nestedModule || !onExtractModule) return

    e.preventDefault()

    // Set up global mouse handlers for dragging
    const handleMouseUp = (upEvent: MouseEvent) => {
      const canvasContainer = document.querySelector('.canvas-container')
      if (canvasContainer) {
        const rect = canvasContainer.getBoundingClientRect()
        const x = upEvent.clientX - rect.left
        const y = upEvent.clientY - rect.top

        if (message.nestedModule) {
          onExtractModule(
            message.nestedModule.type,
            message.nestedModule.data,
            { x, y }
          )
        }
      }

      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleExtractButton = (messageId: string) => {
    const message = data.messages.find(m => m.id === messageId)
    if (!message?.nestedModule || !onExtractModule) return

    // Extract to a default position (offset from chat module)
    const chatModule = document.querySelector('.module-card')
    if (chatModule) {
      const rect = chatModule.getBoundingClientRect()
      const canvasContainer = document.querySelector('.canvas-container')
      if (canvasContainer) {
        const canvasRect = canvasContainer.getBoundingClientRect()
        const x = rect.right - canvasRect.left + 20
        const y = rect.top - canvasRect.top

        onExtractModule(
          message.nestedModule.type,
          message.nestedModule.data,
          { x, y }
        )
      }
    }
  }

  const renderNestedModule = (message: ChatMessage, isExpanded: boolean) => {
    if (!message.nestedModule) return null

    const { type, data: moduleData } = message.nestedModule

    if (isExpanded) {
      // Render full module
      return (
        <div className="nested-module-expanded">
          {type === 'media' && (
            <MediaModule
              data={moduleData}
              onUpdate={() => {}} // Read-only in chat
            />
          )}
          {type === 'image' && (
            <ImageModule
              data={moduleData}
              onUpdate={() => {}} // Read-only in chat
            />
          )}
          {type === 'text' && (
            <TextModule
              data={moduleData}
              onUpdate={() => {}} // Read-only in chat
            />
          )}
          {type === 'map' && (
            <MapModule
              data={moduleData}
              onChange={() => {}} // Read-only in chat
              moduleId={message.id}
            />
          )}
          {type === 'search' && (
            <SearchModule
              data={moduleData}
              onChange={() => {}} // Read-only in chat
            />
          )}
        </div>
      )
    } else {
      // Render compact preview
      return (
        <div className="nested-module-preview">
          {type === 'media' && (
            <div className="nested-module-preview-content">
              <div className="nested-module-preview-icon">🎵</div>
              <div className="nested-module-preview-text">
                <div className="nested-module-preview-title">Music Player</div>
                <div className="nested-module-preview-subtitle">{moduleData.title || 'Untitled'}</div>
              </div>
            </div>
          )}
          {type === 'image' && (
            <div className="nested-module-preview-content">
              {moduleData.imageUrl ? (
                <img src={moduleData.imageUrl} alt={moduleData.label || ''} className="nested-module-preview-image" />
              ) : (
                <div className="nested-module-preview-icon">🖼️</div>
              )}
              <div className="nested-module-preview-text">
                <div className="nested-module-preview-title">Image</div>
                {moduleData.label && (
                  <div className="nested-module-preview-subtitle">{moduleData.label}</div>
                )}
              </div>
            </div>
          )}
          {type === 'text' && (
            <div className="nested-module-preview-content">
              <div className="nested-module-preview-icon">📝</div>
              <div className="nested-module-preview-text">
                <div className="nested-module-preview-title">Text</div>
                <div className="nested-module-preview-subtitle">
                  {moduleData.text?.substring(0, 50) || 'Empty note'}
                  {moduleData.text && moduleData.text.length > 50 ? '...' : ''}
                </div>
              </div>
            </div>
          )}
          {type === 'map' && (
            <div className="nested-module-preview-content">
              <div className="nested-module-preview-icon">📍</div>
              <div className="nested-module-preview-text">
                <div className="nested-module-preview-title">Map</div>
                <div className="nested-module-preview-subtitle">{moduleData.locationQuery || 'No location'}</div>
              </div>
            </div>
          )}
          {type === 'search' && (
            <div className="nested-module-preview-content">
              <div className="nested-module-preview-icon">🔍</div>
              <div className="nested-module-preview-text">
                <div className="nested-module-preview-title">Search</div>
                <div className="nested-module-preview-subtitle">{moduleData.query || 'No query'}</div>
              </div>
            </div>
          )}
        </div>
      )
    }
  }

  return (
    <div className="chat-module" ref={chatContainerRef}>
      <div className="chat-messages">
        {data.messages.length === 0 && (
          <div className="chat-empty-state">
            Start a conversation with your AI friend!
          </div>
        )}
        {data.messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message chat-message-${message.sender}`}
          >
            <div className="chat-message-bubble">
              {message.text && (
                <div className="chat-message-text">{message.text}</div>
              )}
              {message.nestedModule && (
                <div className="chat-message-nested">
                  {renderNestedModule(message, expandedModuleId === message.id)}
                  <div className="nested-module-actions">
                    <button
                      className="nested-module-toggle"
                      onClick={() => setExpandedModuleId(
                        expandedModuleId === message.id ? null : message.id
                      )}
                      title={expandedModuleId === message.id ? 'Collapse' : 'Expand'}
                    >
                      {expandedModuleId === message.id ? '−' : '+'}
                    </button>
                    {onExtractModule && (
                      <>
                        <button
                          className="nested-module-extract"
                          onClick={() => handleExtractButton(message.id)}
                          title="Extract to desktop"
                        >
                          ↗
                        </button>
                        <div
                          className="nested-module-drag-handle"
                          onMouseDown={(e) => handleDragStart(e, message.id)}
                          title="Drag to desktop"
                        >
                          ⋮⋮
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
        ))}
        {data.isLoading && (
          <div className="chat-message chat-message-ai">
            <div className="chat-message-bubble">
              <div className="chat-loading">AI is typing...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {data.error && (
        <div className="chat-error">{data.error}</div>
      )}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={data.isLoading}
        />
        <button
          className="chat-send-button"
          onClick={handleSend}
          disabled={data.isLoading || !inputText.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}

