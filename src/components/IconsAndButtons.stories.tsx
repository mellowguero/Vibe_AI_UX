import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MediaControlButton } from './modules/MediaModule/MediaControlButton';
import { PlayButton } from './modules/MediaModule/PlayButton';
import { PrimaryButton } from './shared/PrimaryButton';
import { SecondaryButton } from './shared/SecondaryButton';
import { TertiaryButton } from './shared/TertiaryButton';
import { RoundButton } from './shared/RoundButton';
import { IconButton40px } from './shared/IconButton40px';
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
  PlaylistIcon,
  SoundIcon,
} from './shared/Icon';

const meta: Meta = {
  title: 'Components/Icons and Buttons',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const decorator = (Story: React.ComponentType) => (
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
);

// Icons Section
export const AllIcons: Story = {
  render: () => {
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
      { name: 'PlaylistIcon', component: PlaylistIcon },
      { name: 'SoundIcon', component: SoundIcon },
    ];

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '2rem',
        padding: '2rem',
        backgroundColor: '#ffffff',
      }}>
        {allIcons.map(({ name, component: IconComponent }) => (
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
            <IconComponent size="md" color="#000000" />
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
  },
};

// Buttons Section
export const AllButtons: Story = {
  render: () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      padding: '2rem',
      backgroundColor: '#ffffff',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>Text Buttons</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <PrimaryButton>Primary Button</PrimaryButton>
          <SecondaryButton>Secondary Button</SecondaryButton>
          <TertiaryButton>Tertiary Button</TertiaryButton>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>Round Button</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <RoundButton variant="light">Round Light</RoundButton>
          <RoundButton variant="dark">Round Dark</RoundButton>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>Play Button</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1rem', borderRadius: '8px' }}>
            <PlayButton isPlaying={false} />
          </div>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1rem', borderRadius: '8px' }}>
            <PlayButton isPlaying={true} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>Media Control Buttons</h3>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1rem',
          borderRadius: '8px',
        }}>
          <MediaControlButton
            icon={<ShuffleIcon size="md" />}
            aria-label="Shuffle"
          />
          <MediaControlButton
            icon={<LastTrackIcon size="md" />}
            aria-label="Previous track"
          />
          <MediaControlButton
            icon={<NextTrackIcon size="md" />}
            aria-label="Next track"
          />
          <MediaControlButton
            icon={<RepeatIcon size="md" />}
            aria-label="Repeat"
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>Icon Button 40px</h3>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1rem',
          borderRadius: '8px',
        }}>
          <IconButton40px aria-label="Icon button" />
          <IconButton40px aria-label="Close button" />
        </div>
      </div>
    </div>
  ),
};
