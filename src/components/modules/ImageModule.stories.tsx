import type { Meta, StoryObj } from '@storybook/react';
import { ImageModule } from './ImageModule';
import { imageWithUrl, imageLoading } from '../../stories/mocks';

const meta: Meta<typeof ImageModule> = {
  title: 'Modules/ImageModule',
  component: ImageModule,
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
type Story = StoryObj<typeof ImageModule>;

const mockOnUpdate = (data: any) => {
  console.log('ImageModule onUpdate:', data);
};

export const WithImage: Story = {
  args: {
    data: imageWithUrl,
    onUpdate: mockOnUpdate,
  },
};

export const Loading: Story = {
  args: {
    data: imageLoading,
    onUpdate: mockOnUpdate,
  },
};

export const Empty: Story = {
  args: {
    data: {
      imageUrl: '',
      label: '',
      isLoading: false,
    },
    onUpdate: mockOnUpdate,
  },
};
