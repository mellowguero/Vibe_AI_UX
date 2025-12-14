import type { Meta, StoryObj } from '@storybook/react';
import { TertiaryButton } from './TertiaryButton';

const meta: Meta<typeof TertiaryButton> = {
  title: 'Components/Buttons/TertiaryButton',
  component: TertiaryButton,
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
type Story = StoryObj<typeof TertiaryButton>;

export const Default: Story = {
  args: {
    children: 'Tertiary Button',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Tertiary Disabled',
    disabled: true,
  },
};

export const WithClick: Story = {
  args: {
    children: 'Click Me',
    onClick: () => {
      console.log('Tertiary button clicked');
    },
  },
};
