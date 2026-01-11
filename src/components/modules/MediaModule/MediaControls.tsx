import React from 'react';
import { PlayButton } from './PlayButton';
import { MediaControlButton } from './MediaControlButton';
import {
  LastTrackIcon,
  NextTrackIcon,
  RepeatIcon,
  ShuffleIcon,
} from '../../shared/Icon';
import type { MediaControlsLayout } from '../../../types/layout';

interface MediaControlsProps {
  variant?: 'Full' | 'Partial' | 'Chat';
  isPlaying: boolean;
  onPlayPause?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onShuffle?: () => void;
  onRepeat?: () => void;
  disabled?: boolean;
  className?: string;
  layout?: MediaControlsLayout;
}

export function MediaControls({
  variant = 'Full',
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
  disabled = false,
  className = '',
  layout,
}: MediaControlsProps) {
  const isFull = variant === 'Full';
  const isPartial = variant === 'Partial';
  const isChat = variant === 'Chat';
  
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
    
    // Use orientation if provided, otherwise use flex direction
    if (layout?.orientation) {
      style.flexDirection = layout.orientation === 'vertical' ? 'column' : 'row'
    }
    
    // Use buttonSpacing if provided
    if (layout?.buttonSpacing) {
      style.gap = layout.buttonSpacing
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

  return (
    <div className={`media-controls ${className}`.trim()} style={dynamicStyle}>
      {isFull && (
        <MediaControlButton
          icon={<ShuffleIcon size="md" />}
          onClick={onShuffle}
          disabled={disabled}
          aria-label="Shuffle"
        />
      )}
      {(isFull || isPartial) && (
        <MediaControlButton
          icon={<LastTrackIcon size="md" />}
          onClick={onPrevious}
          disabled={disabled}
          aria-label="Previous track"
        />
      )}
      <PlayButton
        isPlaying={isPlaying}
        onClick={onPlayPause}
        disabled={disabled}
      />
      {(isFull || isPartial) && (
        <MediaControlButton
          icon={<NextTrackIcon size="md" />}
          onClick={onNext}
          disabled={disabled}
          aria-label="Next track"
        />
      )}
      {isFull && (
        <MediaControlButton
          icon={<RepeatIcon size="md" />}
          onClick={onRepeat}
          disabled={disabled}
          aria-label="Repeat"
        />
      )}
    </div>
  );
}




