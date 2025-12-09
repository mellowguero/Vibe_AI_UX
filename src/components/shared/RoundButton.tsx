import React from 'react';

interface RoundButtonProps {
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

export function RoundButton({
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
}: RoundButtonProps) {
  const wrapperClasses = `button-round-wrapper ${className}`.trim();
  const buttonClasses = 'button-base button-round';

  return (
    <div 
      className={wrapperClasses}
      onClick={disabled ? undefined : onClick}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <button
        className={buttonClasses}
        onClick={onClick}
        disabled={disabled}
        type="button"
      >
        {children}
      </button>
    </div>
  );
}

