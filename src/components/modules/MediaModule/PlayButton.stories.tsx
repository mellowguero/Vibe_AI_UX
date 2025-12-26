import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PlayButton } from './PlayButton';

const meta: Meta<typeof PlayButton> = {
  title: 'Components/Modules/MediaModule/PlayButton',
  component: PlayButton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isPlaying: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    onClick: {
      action: 'clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlayButton>;

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

export const Paused: Story = {
  args: {
    isPlaying: false,
    disabled: false,
  },
  decorators: [decorator],
};

export const Playing: Story = {
  args: {
    isPlaying: true,
    disabled: false,
  },
  decorators: [decorator],
};

export const Disabled: Story = {
  args: {
    isPlaying: false,
    disabled: true,
  },
  decorators: [decorator],
};

export const WithClick: Story = {
  args: {
    isPlaying: false,
    disabled: false,
    onClick: () => {
      console.log('Play button clicked');
    },
  },
  decorators: [decorator],
};

