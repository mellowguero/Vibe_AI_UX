import type { Meta, StoryObj } from '@storybook/react';
import { RoundButton } from './RoundButton';

const meta: Meta<typeof RoundButton> = {
  title: 'Components/Buttons/RoundButton',
  component: RoundButton,
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
    className: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RoundButton>;

export const Default: Story = {
  args: {
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithClick: Story = {
  args: {
    onClick: () => {
      console.log('Round button clicked');
    },
  },
};

export const Dark: Story = {
  args: {
    variant: 'dark',
    disabled: false,
  },
};

export const DarkHover: Story = {
  args: {
    variant: 'dark',
    disabled: false,
  },
  parameters: {
    pseudo: {
      hover: true,
    },
  },
};

export const DarkDisabled: Story = {
  args: {
    variant: 'dark',
    disabled: true,
  },
};
