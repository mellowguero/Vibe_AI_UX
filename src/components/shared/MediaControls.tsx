import React from 'react';
import { PlayButton } from './PlayButton';
import { MediaControlButton } from './MediaControlButton';
import {
  LastTrackIcon,
  NextTrackIcon,
  RepeatIcon,
  ShuffleIcon,
} from './Icon';

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
}: MediaControlsProps) {
  const isFull = variant === 'Full';
  const isPartial = variant === 'Partial';
  const isChat = variant === 'Chat';

  return (
    <div className={`media-controls ${className}`.trim()}>
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

