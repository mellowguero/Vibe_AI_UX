import React from 'react';

interface MediaControlButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function MediaControlButton({
  icon,
  onClick,
  disabled = false,
  className = '',
  'aria-label': ariaLabel = 'Media control button',
}: MediaControlButtonProps) {
  const baseClasses = 'button-base button-icon-40px';
  const classes = `${baseClasses} ${className}`.trim();

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label={ariaLabel}
    >
      <div className="button-icon-40px-icon">
        {icon}
      </div>
    </button>
  );
}

