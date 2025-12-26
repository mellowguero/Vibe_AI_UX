import type { Meta, StoryObj } from '@storybook/react';
import { IconButton40px } from './IconButton40px';

const meta: Meta<typeof IconButton40px> = {
  title: 'Components/Buttons/IconButton40px',
  component: IconButton40px,
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
    'aria-label': {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton40px>;

export const Default: Story = {
  args: {
    disabled: false,
    'aria-label': 'Icon button',
  },
  decorators: [
    (Story) => (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
      }}>
        <Story />
      </div>
    ),
  ],
};

export const Hover: Story = {
  args: {
    disabled: false,
    'aria-label': 'Icon button hover state',
  },
  decorators: [
    (Story) => (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
      }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    pseudo: {
      hover: true,
    },
  },
};

export const Active: Story = {
  args: {
    disabled: false,
    'aria-label': 'Icon button active state',
  },
  decorators: [
    (Story) => (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
      }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    pseudo: {
      active: true,
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Icon button disabled',
  },
  decorators: [
    (Story) => (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
      }}>
        <Story />
      </div>
    ),
  ],
};

export const WithClick: Story = {
  args: {
    onClick: () => {
      console.log('Icon button clicked');
    },
    'aria-label': 'Clickable icon button',
  },
  decorators: [
    (Story) => (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
      }}>
        <Story />
      </div>
    ),
  ],
};

