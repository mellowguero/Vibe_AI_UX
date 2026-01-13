import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MediaModule } from './MediaModule/MediaModule';
import { mediaWithVideo, mediaLoading, mediaAudioOnly } from '../../stories/mocks';

const darkGlassDecorator = (Story: React.ComponentType) => (
  <div
    style={{
      backgroundImage: 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      // Override light glass variables with dark glass variables
      '--glass-bg-light': 'rgba(42, 42, 42, 0.35)',
      '--glass-border-light': 'rgba(255, 255, 255, 0.1)',
      '--color-media-chat-bg': 'rgba(42, 42, 42, 0.7)',
    } as React.CSSProperties}
  >
    <Story />
  </div>
);

const meta: Meta<typeof MediaModule> = {
  title: 'Modules/MediaModule',
  component: MediaModule,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [darkGlassDecorator],
  argTypes: {
    data: {
      control: 'object',
    },
    variant: {
      control: 'select',
      options: ['standalone', 'chat'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MediaModule>;

const mockOnUpdate = (data: any) => {
  console.log('MediaModule onUpdate:', data);
};

export const WithVideo: Story = {
  args: {
    data: mediaWithVideo,
    onUpdate: mockOnUpdate,
    variant: 'standalone',
  },
};

export const Loading: Story = {
  args: {
    data: mediaLoading,
    onUpdate: mockOnUpdate,
    variant: 'standalone',
  },
};

export const AudioOnly: Story = {
  args: {
    data: mediaAudioOnly,
    onUpdate: mockOnUpdate,
    variant: 'standalone',
  },
};

export const ChatVariant: Story = {
  args: {
    data: mediaWithVideo,
    onUpdate: mockOnUpdate,
    variant: 'chat',
  },
};

export const Empty: Story = {
  args: {
    data: {
      title: '',
      audioUrl: '',
      isLoading: false,
    },
    onUpdate: mockOnUpdate,
    variant: 'standalone',
  },
};
