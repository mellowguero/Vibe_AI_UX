import React from 'react';
import { componentIcons } from '../../types/modules';
import { renderIcon } from '../../utils/iconConfig';

interface RoundButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'light' | 'dark';
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
  variant = 'light',
  // Placeholder props (not yet implemented)
  // iconLeft,
  // iconRight,
  // size,
  // loading,
  // fullWidth,
}: RoundButtonProps) {
  const wrapperClasses = `button-round-wrapper ${variant === 'dark' ? 'button-round-dark' : ''} ${className}`.trim();
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
        <div className="button-round-icon">
          {children || renderIcon(componentIcons.RoundButton, { size: 'sm' })}
        </div>
      </button>
    </div>
  );
}

