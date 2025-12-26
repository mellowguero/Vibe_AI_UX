import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MediaControlButton } from './MediaControlButton';
import {
  LastTrackIcon,
  NextTrackIcon,
  RepeatIcon,
  ShuffleIcon,
} from '../../shared/Icon';

const meta: Meta<typeof MediaControlButton> = {
  title: 'Components/Modules/MediaModule/MediaControlButton',
  component: MediaControlButton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    onClick: {
      action: 'clicked',
    },
    'aria-label': {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MediaControlButton>;

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

export const Shuffle: Story = {
  args: {
    icon: <ShuffleIcon size="md" />,
    disabled: false,
    'aria-label': 'Shuffle',
  },
  decorators: [decorator],
};

export const Previous: Story = {
  args: {
    icon: <LastTrackIcon size="md" />,
    disabled: false,
    'aria-label': 'Previous track',
  },
  decorators: [decorator],
};

export const Next: Story = {
  args: {
    icon: <NextTrackIcon size="md" />,
    disabled: false,
    'aria-label': 'Next track',
  },
  decorators: [decorator],
};

export const Repeat: Story = {
  args: {
    icon: <RepeatIcon size="md" />,
    disabled: false,
    'aria-label': 'Repeat',
  },
  decorators: [decorator],
};

export const Disabled: Story = {
  args: {
    icon: <ShuffleIcon size="md" />,
    disabled: true,
    'aria-label': 'Shuffle',
  },
  decorators: [decorator],
};

export const Hover: Story = {
  args: {
    icon: <ShuffleIcon size="md" />,
    disabled: false,
    'aria-label': 'Shuffle',
  },
  decorators: [decorator],
  parameters: {
    pseudo: {
      hover: true,
    },
  },
};

export const Active: Story = {
  args: {
    icon: <ShuffleIcon size="md" />,
    disabled: false,
    'aria-label': 'Shuffle',
  },
  decorators: [decorator],
  parameters: {
    pseudo: {
      active: true,
    },
  },
};

