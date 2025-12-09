import React from 'react';

interface SecondaryButtonProps {
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

export function SecondaryButton({
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
}: SecondaryButtonProps) {
  const baseClasses = 'button-base button-secondary';
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

