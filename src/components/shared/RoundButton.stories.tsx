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
    disabled: {
      control: 'boolean',
    },
    onClick: {
      action: 'clicked',
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

export const Active: Story = {
  render: () => (
    <div className="button-round-wrapper demo-active">
      <RoundButton onClick={() => console.log('Round button clicked')} />
    </div>
  ),
};

export const WithClick: Story = {
  args: {
    onClick: () => {
      console.log('Round button clicked');
    },
  },
};
