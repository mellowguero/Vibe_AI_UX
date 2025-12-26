import React from 'react';
import { RoundButton } from '../../shared/RoundButton';
import { PlayIcon, PauseIcon } from '../../shared/Icon';

interface PlayButtonProps {
  isPlaying: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function PlayButton({
  isPlaying,
  onClick,
  disabled = false,
  className = '',
}: PlayButtonProps) {
  return (
    <RoundButton
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {isPlaying ? (
        <PauseIcon size="md" />
      ) : (
        <PlayIcon size="md" />
      )}
    </RoundButton>
  );
}

