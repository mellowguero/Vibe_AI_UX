import React from 'react';

interface TertiaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  // Placeholder props for future features
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export function TertiaryButton({
  children,
  onClick,
  disabled = false,
  className = '',
  // Placeholder props (not yet implemented)
  // iconLeft,
  // iconRight,
  // size,
  // loading,
  // fullWidth,
}: TertiaryButtonProps) {
  const baseClasses = 'button-base button-tertiary';
  const classes = `${baseClasses} ${className}`.trim();

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

