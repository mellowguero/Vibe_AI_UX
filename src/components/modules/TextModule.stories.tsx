import type { Meta, StoryObj } from '@storybook/react';
import { TextModule } from './TextModule';
import { textModuleData } from '../../stories/mocks';

const meta: Meta<typeof TextModule> = {
  title: 'Modules/TextModule',
  component: TextModule,
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
type Story = StoryObj<typeof TextModule>;

const mockOnUpdate = (data: any) => {
  console.log('TextModule onUpdate:', data);
};

export const Default: Story = {
  args: {
    data: textModuleData,
    onUpdate: mockOnUpdate,
  },
};

export const Empty: Story = {
  args: {
    data: {
      text: '',
    },
    onUpdate: mockOnUpdate,
  },
};

export const LongText: Story = {
  args: {
    data: {
      text: 'This is a longer text content that demonstrates how the text module handles multiple lines of content. The textarea will grow to accommodate the content and can be scrolled if it exceeds the maximum height.',
    },
    onUpdate: mockOnUpdate,
  },
};

