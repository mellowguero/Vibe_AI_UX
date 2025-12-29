import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';
import { useState } from 'react';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Empty: Story = {
  args: {
    value: '',
    placeholder: 'Type a message...',
    disabled: false,
  },
};

export const WithValue: Story = {
  args: {
    value: 'Sample text',
    placeholder: 'Type a message...',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: '',
    placeholder: 'Disabled',
    disabled: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TextInput
        value={value}
        onChange={setValue}
        placeholder="Type a message..."
        onActionClick={() => {
          console.log('Send clicked:', value);
        }}
      />
    );
  },
};

