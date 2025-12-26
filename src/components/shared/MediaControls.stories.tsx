import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MediaControls } from './MediaControls';

const meta: Meta<typeof MediaControls> = {
  title: 'Components/Buttons/MediaControls',
  component: MediaControls,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['Full', 'Partial', 'Chat'],
    },
    isPlaying: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MediaControls>;

const decorator = (Story: React.ComponentType) => (
  <div style={{ 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  }}>
    <Story />
  </div>
);

export const Full: Story = {
  args: {
    variant: 'Full',
    isPlaying: false,
    disabled: false,
    onPlayPause: () => console.log('Play/Pause clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onNext: () => console.log('Next clicked'),
    onShuffle: () => console.log('Shuffle clicked'),
    onRepeat: () => console.log('Repeat clicked'),
  },
  decorators: [decorator],
};

export const FullPlaying: Story = {
  args: {
    variant: 'Full',
    isPlaying: true,
    disabled: false,
    onPlayPause: () => console.log('Play/Pause clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onNext: () => console.log('Next clicked'),
    onShuffle: () => console.log('Shuffle clicked'),
    onRepeat: () => console.log('Repeat clicked'),
  },
  decorators: [decorator],
};

export const Partial: Story = {
  args: {
    variant: 'Partial',
    isPlaying: false,
    disabled: false,
    onPlayPause: () => console.log('Play/Pause clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onNext: () => console.log('Next clicked'),
  },
  decorators: [decorator],
};

export const PartialPlaying: Story = {
  args: {
    variant: 'Partial',
    isPlaying: true,
    disabled: false,
    onPlayPause: () => console.log('Play/Pause clicked'),
    onPrevious: () => console.log('Previous clicked'),
    onNext: () => console.log('Next clicked'),
  },
  decorators: [decorator],
};

export const Chat: Story = {
  args: {
    variant: 'Chat',
    isPlaying: false,
    disabled: false,
    onPlayPause: () => console.log('Play/Pause clicked'),
  },
  decorators: [decorator],
};

export const ChatPlaying: Story = {
  args: {
    variant: 'Chat',
    isPlaying: true,
    disabled: false,
    onPlayPause: () => console.log('Play/Pause clicked'),
  },
  decorators: [decorator],
};

export const Disabled: Story = {
  args: {
    variant: 'Full',
    isPlaying: false,
    disabled: true,
  },
  decorators: [decorator],
};

export const Interactive: Story = {
  render: () => {
    const [isPlaying, setIsPlaying] = useState(false);
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
      }}>
        <MediaControls
          variant="Full"
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onPrevious={() => console.log('Previous clicked')}
          onNext={() => console.log('Next clicked')}
          onShuffle={() => console.log('Shuffle clicked')}
          onRepeat={() => console.log('Repeat clicked')}
        />
      </div>
    );
  },
};

