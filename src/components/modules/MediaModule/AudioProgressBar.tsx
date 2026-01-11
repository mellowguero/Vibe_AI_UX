import { useRef, useState, useEffect, useCallback } from 'react'
import type { AudioProgressBarLayout } from '../../../types/layout'

interface AudioProgressBarProps {
  progress: number // 0-1
  duration?: number // Total duration in seconds
  currentTime?: number // Current time in seconds
  onSeek?: (progress: number) => void // Callback when user seeks (0-1)
  color?: string // Extracted color for styling
  showHandle?: boolean // Whether to show the draggable handle
  disabled?: boolean // Whether interaction is disabled
  className?: string
  layout?: AudioProgressBarLayout
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
  layout,
}: AudioProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragProgress, setDragProgress] = useState<number | null>(null)

  // Calculate display progress (use drag progress if dragging, otherwise use prop)
  const displayProgress = isDragging && dragProgress !== null ? dragProgress : progress
  
  // Build dynamic styles from layout config
  const buildStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {}
    
    if (layout?.spacing) {
      if (layout.spacing.margin) style.margin = layout.spacing.margin
      if (layout.spacing.marginTop) style.marginTop = layout.spacing.marginTop
      if (layout.spacing.marginRight) style.marginRight = layout.spacing.marginRight
      if (layout.spacing.marginBottom) style.marginBottom = layout.spacing.marginBottom
      if (layout.spacing.marginLeft) style.marginLeft = layout.spacing.marginLeft
      if (layout.spacing.padding) style.padding = layout.spacing.padding
      if (layout.spacing.paddingTop) style.paddingTop = layout.spacing.paddingTop
      if (layout.spacing.paddingRight) style.paddingRight = layout.spacing.paddingRight
      if (layout.spacing.paddingBottom) style.paddingBottom = layout.spacing.paddingBottom
      if (layout.spacing.paddingLeft) style.paddingLeft = layout.spacing.paddingLeft
      if (layout.spacing.gap) style.gap = layout.spacing.gap
    }
    
    if (layout?.size) {
      if (layout.size.width) style.width = layout.size.width
      if (layout.size.height) style.height = layout.size.height
      if (layout.size.minWidth) style.minWidth = layout.size.minWidth
      if (layout.size.minHeight) style.minHeight = layout.size.minHeight
      if (layout.size.maxWidth) style.maxWidth = layout.size.maxWidth
      if (layout.size.maxHeight) style.maxHeight = layout.size.maxHeight
    }
    
    if (layout?.flex) {
      if (layout.flex.direction) style.flexDirection = layout.flex.direction
      if (layout.flex.align) style.alignItems = layout.flex.align
      if (layout.flex.justify) style.justifyContent = layout.flex.justify
      if (layout.flex.wrap) style.flexWrap = layout.flex.wrap
      if (layout.flex.grow !== undefined) style.flexGrow = layout.flex.grow
      if (layout.flex.shrink !== undefined) style.flexShrink = layout.flex.shrink
      if (layout.flex.basis) style.flexBasis = layout.flex.basis
    }
    
    if (layout?.positioning) {
      if (layout.positioning.position) style.position = layout.positioning.position
      if (layout.positioning.top !== undefined) style.top = layout.positioning.top
      if (layout.positioning.right !== undefined) style.right = layout.positioning.right
      if (layout.positioning.bottom !== undefined) style.bottom = layout.positioning.bottom
      if (layout.positioning.left !== undefined) style.left = layout.positioning.left
      if (layout.positioning.zIndex !== undefined) style.zIndex = layout.positioning.zIndex
    }
    
    return style
  }
  
  const dynamicStyle = buildStyle()

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
  const containerStyle: React.CSSProperties = {
    ...dynamicStyle,
    ...(color ? { '--audio-progress-color': color } as React.CSSProperties : {}),
  }

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

