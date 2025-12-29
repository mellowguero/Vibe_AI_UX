import { useRef, useState, useEffect, useCallback } from 'react'

interface AudioProgressBarProps {
  progress: number // 0-1
  duration?: number // Total duration in seconds
  currentTime?: number // Current time in seconds
  onSeek?: (progress: number) => void // Callback when user seeks (0-1)
  color?: string // Extracted color for styling
  showHandle?: boolean // Whether to show the draggable handle
  disabled?: boolean // Whether interaction is disabled
  className?: string
}

export function AudioProgressBar({
  progress,
  duration,
  currentTime,
  onSeek,
  color,
  showHandle = false,
  disabled = false,
  className = '',
}: AudioProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragProgress, setDragProgress] = useState<number | null>(null)

  // Calculate display progress (use drag progress if dragging, otherwise use prop)
  const displayProgress = isDragging && dragProgress !== null ? dragProgress : progress

  // Handle mouse/touch events for seeking
  const calculateProgressFromEvent = useCallback((clientX: number): number => {
    if (!containerRef.current) return 0

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const width = rect.width
    const calculatedProgress = Math.max(0, Math.min(1, x / width))

    return calculatedProgress
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return

      e.preventDefault()
      setIsDragging(true)
      const newProgress = calculateProgressFromEvent(e.clientX)
      setDragProgress(newProgress)

      if (onSeek) {
        onSeek(newProgress)
      }
    },
    [disabled, calculateProgressFromEvent, onSeek]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || disabled) return

      const newProgress = calculateProgressFromEvent(e.clientX)
      setDragProgress(newProgress)

      if (onSeek) {
        onSeek(newProgress)
      }
    },
    [isDragging, disabled, calculateProgressFromEvent, onSeek]
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      setDragProgress(null)
    }
  }, [isDragging])

  // Handle touch events for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return

      e.preventDefault()
      setIsDragging(true)
      const touch = e.touches[0]
      const newProgress = calculateProgressFromEvent(touch.clientX)
      setDragProgress(newProgress)

      if (onSeek) {
        onSeek(newProgress)
      }
    },
    [disabled, calculateProgressFromEvent, onSeek]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || disabled) return

      e.preventDefault()
      const touch = e.touches[0]
      const newProgress = calculateProgressFromEvent(touch.clientX)
      setDragProgress(newProgress)

      if (onSeek) {
        onSeek(newProgress)
      }
    },
    [isDragging, disabled, calculateProgressFromEvent, onSeek]
  )

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      setDragProgress(null)
    }
  }, [isDragging])

  // Set up global mouse/touch event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  // Apply color as CSS variable if provided
  const containerStyle: React.CSSProperties = color
    ? { '--audio-progress-color': color } as React.CSSProperties
    : {}

  return (
    <div
      className={`audio-progress-bar-container ${className}`.trim()}
      style={containerStyle}
    >
      <div
        ref={containerRef}
        className={`audio-progress-bar-track ${disabled ? 'audio-progress-bar-track--disabled' : ''}`.trim()}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ cursor: disabled ? 'default' : 'pointer' }}
      >
        <div
          className="audio-progress-bar-fill"
          style={{ width: `${displayProgress * 100}%` }}
        />
        {showHandle && (
          <div
            className={`audio-progress-bar-handle ${isDragging ? 'audio-progress-bar-handle--dragging' : ''}`.trim()}
            style={{ left: `${displayProgress * 100}%` }}
          />
        )}
      </div>
    </div>
  )
}

