import React from 'react';

interface IconButton40pxProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

// Rounded square outline icon matching Figma design
// 24px total: 16px inner square + 4px padding on each side
const RoundedSquareIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 24, 
  className = '' 
}) => {
  const scale = size / 24;
  const innerSize = 16 * scale;
  const padding = 4 * scale;
  const borderRadius = 4 * scale;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x={padding}
        y={padding}
        width={innerSize}
        height={innerSize}
        rx={borderRadius}
        stroke="currentColor"
        strokeWidth={2 * scale}
        fill="none"
      />
    </svg>
  );
};

export function IconButton40px({
  onClick,
  disabled = false,
  className = '',
  'aria-label': ariaLabel = 'Icon button',
}: IconButton40pxProps) {
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
      <RoundedSquareIcon className="button-icon-40px-icon" />
    </button>
  );
}

