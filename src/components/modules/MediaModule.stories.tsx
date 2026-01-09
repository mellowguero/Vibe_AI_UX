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
