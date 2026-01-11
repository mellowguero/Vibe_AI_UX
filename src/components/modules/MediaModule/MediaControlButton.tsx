import React from 'react';
import type { ComponentLayout } from '../../../types/layout';

interface MediaControlButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  layout?: ComponentLayout;
}

export function MediaControlButton({
  icon,
  onClick,
  disabled = false,
  className = '',
  'aria-label': ariaLabel = 'Media control button',
  layout,
}: MediaControlButtonProps) {
  const baseClasses = 'button-base button-icon-40px';
  const classes = `${baseClasses} ${className}`.trim();
  
  // Build dynamic styles from layout config
  const buildStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {}
    
    if (layout?.spacing) {
      if (layout.spacing.margin) style.margin = layout.spacing.margin
      if (layout.spacing.marginTop) style.marginTop = layout.spacing.marginTop
      if (layout.spacing.marginRight) style.marginRight = layout.spacing.marginRight
      if (layout.spacing.marginBottom) style.marginBottom = layout.spacing.marginBottom
      if (layout.spacing.marginLeft) style.marginLeft = layout.spacing.marginLeft
    }
    
    if (layout?.size) {
      if (layout.size.width) style.width = layout.size.width
      if (layout.size.height) style.height = layout.size.height
      if (layout.size.minWidth) style.minWidth = layout.size.minWidth
      if (layout.size.minHeight) style.minHeight = layout.size.minHeight
      if (layout.size.maxWidth) style.maxWidth = layout.size.maxWidth
      if (layout.size.maxHeight) style.maxHeight = layout.size.maxHeight
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
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label={ariaLabel}
      style={dynamicStyle}
    >
      <div className="button-icon-40px-icon">
        {icon}
      </div>
    </button>
  );
}




