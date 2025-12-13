import { useRef, useEffect } from 'react'
import { RoundButton } from './shared/RoundButton'
import { SendIcon } from './shared/Icon'

interface TextInputProps {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  onActionClick?: () => void
  disabled?: boolean
  className?: string
}

export function TextInput({
  value = '',
  placeholder = 'Test',
  onChange,
  onActionClick,
  disabled = false,
  className = '',
}: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const textInputContainerRef = useRef<HTMLDivElement>(null)
  const inputTextFieldRef = useRef<HTMLDivElement>(null)

  const updateSizeAndBorderRadius = () => {
    const target = textareaRef.current
    if (!target) return

    const maxHeight = 104 // Max height in pixels
    const minHeight = 40 // Min height in pixels

    // Auto-resize textarea
    target.style.height = 'auto'
    const scrollHeight = target.scrollHeight
    const newHeight = Math.min(scrollHeight, maxHeight)
    target.style.height = `${newHeight}px`

    // Enable scrolling if content exceeds max height
    if (scrollHeight > maxHeight) {
      target.style.overflowY = 'auto'
    } else {
      target.style.overflowY = 'hidden'
    }

    // Update border-radius based on height
    // Interpolate from 4rem (at minHeight) to 2rem (at maxHeight)
    const heightRange = maxHeight - minHeight
    const currentHeight = Math.min(newHeight, maxHeight)
    const heightProgress = Math.max(0, Math.min(1, (currentHeight - minHeight) / heightRange))

    // Use ease-out curve to reduce border-radius faster in early stages
    // ease-out cubic: 1 - (1 - progress)^3
    const easedProgress = 1 - Math.pow(1 - heightProgress, 3)

    // Interpolate: 4rem at 0% progress, 2rem at 100% progress
    const borderRadius = 4 - (easedProgress * 2) // 4rem to 2rem

    // Update Text_Input container border-radius
    if (textInputContainerRef.current) {
      textInputContainerRef.current.style.borderRadius = `${borderRadius}rem`
    }

    // Update input_text_field border-radius
    if (inputTextFieldRef.current) {
      inputTextFieldRef.current.style.borderRadius = `${borderRadius}rem`
    }

    // Always scroll to bottom to show latest content
    target.scrollTop = target.scrollHeight
  }

  useEffect(() => {
    updateSizeAndBorderRadius()
  }, [value])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
    updateSizeAndBorderRadius()
  }

  return (
    <div className={`Text_Input ${className}`} ref={textInputContainerRef}>
      <div className="input_field">
        <div className="Text Container">
          <div className="input_text_field" ref={inputTextFieldRef}>
            <textarea
              ref={textareaRef}
              className="Text"
              value={value}
              placeholder={placeholder}
              onChange={handleInput}
              disabled={disabled}
              rows={1}
            />
          </div>
        </div>
      </div>
      <RoundButton
        onClick={onActionClick}
        disabled={disabled}
      >
        <SendIcon size="sm" className="submit-icon" />
      </RoundButton>
    </div>
  )
}
