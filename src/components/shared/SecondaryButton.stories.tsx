import type { Meta, StoryObj } from '@storybook/react';
import { SecondaryButton } from './SecondaryButton';

const meta: Meta<typeof SecondaryButton> = {
  title: 'Components/Buttons/SecondaryButton',
  component: SecondaryButton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
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
type Story = StoryObj<typeof SecondaryButton>;

export const Default: Story = {
  args: {
    children: 'Secondary Button',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Secondary Disabled',
    disabled: true,
  },
};

export const WithClick: Story = {
  args: {
    children: 'Click Me',
    onClick: () => {
      console.log('Secondary button clicked');
    },
  },
};
