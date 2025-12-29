import type { Meta, StoryObj } from '@storybook/react';
import { PrimaryButton } from './PrimaryButton';

const meta: Meta<typeof PrimaryButton> = {
  title: 'Components/Buttons/PrimaryButton',
  component: PrimaryButton,
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
type Story = StoryObj<typeof PrimaryButton>;

export const Default: Story = {
  args: {
    children: 'Primary Button',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Primary Disabled',
    disabled: true,
  },
};

export const WithClick: Story = {
  args: {
    children: 'Click Me',
    onClick: () => {
      console.log('Primary button clicked');
    },
  },
};

