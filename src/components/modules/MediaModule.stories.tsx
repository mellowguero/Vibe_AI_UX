import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MediaModule } from './MediaModule/MediaModule';
import { mediaWithVideo, mediaLoading, mediaAudioOnly } from '../../stories/mocks';

const meta: Meta<typeof MediaModule> = {
  title: 'Modules/MediaModule',
  component: MediaModule,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MediaModule>;

const mockOnUpdate = (data: any) => {
  console.log('MediaModule onUpdate:', data);
};

export const DesktopStandalone: Story = {
  args: {
    data: mediaWithVideo,
    onUpdate: mockOnUpdate,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Loading: Story = {
  args: {
    data: mediaLoading,
    onUpdate: mockOnUpdate,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const AudioOnly: Story = {
  args: {
    data: mediaAudioOnly,
    onUpdate: mockOnUpdate,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

// Nested preview (chat)
export const NestedPreview: Story = {
  render: () => (
    <div className="nested-module-preview">
      <div className="nested-module-preview-content">
        <div className="nested-module-preview-icon">🎵</div>
        <div className="nested-module-preview-text">
          <div className="nested-module-preview-title">Music Player</div>
          <div className="nested-module-preview-subtitle">Bob Dylan - Like a Rolling Stone</div>
        </div>
      </div>
    </div>
  ),
};

// Nested expanded (chat)
export const NestedExpanded: Story = {
  args: {
    data: mediaWithVideo,
    onUpdate: mockOnUpdate,
  },
  decorators: [
    (Story) => (
      <div className="media-module-nested" style={{ maxWidth: '400px' }}>
        <div className="media-title-nested">Bob Dylan - Like a Rolling Stone</div>
        <div className="media-channel-nested">BobDylanVEVO</div>
        <div className="media-embed-nested">
          <div className="youtube-thumbnail-placeholder">
            <div className="play-button">▶</div>
            <div className="youtube-logo">YouTube</div>
          </div>
        </div>
      </div>
    ),
  ],
};

// Note: Sub-components (MediaControls, PlayButton, MediaControlButton) 
// have their own stories under Components/Buttons/ for individual inspection
// SongTitle component has its own stories under Components/SongTitle

