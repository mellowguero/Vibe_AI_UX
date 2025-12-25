import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SendIcon,
  CloseIcon,
  ExpandIcon,
  CollapseIcon,
  ExtractIcon,
  DragHandleIcon,
  PlayIcon,
  NextTrackIcon,
  LastTrackIcon,
  RepeatIcon,
  ShuffleIcon,
  PlaceholderIcon,
} from './index';

const meta: Meta = {
  title: 'Components/Icons',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Icon grid component for displaying all icons
const IconGrid = ({ icons, size = 'md' }: { icons: Array<{ name: string; component: React.ComponentType<any> }>; size?: 'xs' | 'sm' | 'md' | 'lg' }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '2rem',
      padding: '2rem',
    }}>
      {icons.map(({ name, component: IconComponent }) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
          }}
        >
          <IconComponent size={size} color="#000000" />
          <span style={{
            fontSize: '0.75rem',
            color: '#666',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  );
};

const allIcons = [
  { name: 'SendIcon', component: SendIcon },
  { name: 'CloseIcon', component: CloseIcon },
  { name: 'ExpandIcon', component: ExpandIcon },
  { name: 'CollapseIcon', component: CollapseIcon },
  { name: 'ExtractIcon', component: ExtractIcon },
  { name: 'DragHandleIcon', component: DragHandleIcon },
  { name: 'PlayIcon', component: PlayIcon },
  { name: 'NextTrackIcon', component: NextTrackIcon },
  { name: 'LastTrackIcon', component: LastTrackIcon },
  { name: 'RepeatIcon', component: RepeatIcon },
  { name: 'ShuffleIcon', component: ShuffleIcon },
  { name: 'PlaceholderIcon', component: PlaceholderIcon },
];

export const AllIcons: Story = {
  render: () => <IconGrid icons={allIcons} size="md" />,
};

export const AllIconsSmall: Story = {
  render: () => <IconGrid icons={allIcons} size="sm" />,
};

export const AllIconsLarge: Story = {
  render: () => <IconGrid icons={allIcons} size="lg" />,
};

export const AllIconsExtraSmall: Story = {
  render: () => <IconGrid icons={allIcons} size="xs" />,
};

// Individual icon stories for detailed view
export const SendIconStory: Story = {
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <SendIcon size="md" color="#000000" />
      <span style={{ fontSize: '1rem', fontFamily: 'system-ui, sans-serif' }}>SendIcon</span>
    </div>
  ),
};

export const CloseIconStory: Story = {
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <CloseIcon size="md" color="#000000" />
      <span style={{ fontSize: '1rem', fontFamily: 'system-ui, sans-serif' }}>CloseIcon</span>
    </div>
  ),
};

export const PlayIconStory: Story = {
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <PlayIcon size="md" color="#000000" />
      <span style={{ fontSize: '1rem', fontFamily: 'system-ui, sans-serif' }}>PlayIcon</span>
    </div>
  ),
};

