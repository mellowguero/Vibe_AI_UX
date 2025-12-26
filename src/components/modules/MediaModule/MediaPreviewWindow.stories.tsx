import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MediaPreviewWindow } from './MediaPreviewWindow';

const meta: Meta<typeof MediaPreviewWindow> = {
  title: 'Components/Modules/MediaModule/MediaPreviewWindow',
  component: MediaPreviewWindow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isExpanded: {
      control: 'boolean',
      description: 'Controls expanded/collapsed state',
    },
    albumArtworkUrl: {
      control: 'text',
      description: 'Album artwork image URL',
    },
    videoThumbnailUrl: {
      control: 'text',
      description: 'YouTube thumbnail for background (optional)',
    },
    videoUrl: {
      control: 'text',
      description: 'Video file URL for background (optional, takes precedence over videoThumbnailUrl)',
    },
    title: {
      control: 'text',
      description: 'Song title (for alt text)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MediaPreviewWindow>;

// Sample image URLs for stories - using local placeholder assets
const sampleAlbumArtwork = '/assets/media-preview/graceland_cover.jpg';
const sampleVideoThumbnail = '/assets/media-preview/graceland_cover.jpg';
const sampleVideoUrl = '/assets/media-preview/Paul Simon - You Can Call Me Al (Official Video).mp4';

export const Expanded: Story = {
  args: {
    isExpanded: true,
    albumArtworkUrl: sampleAlbumArtwork,
    videoUrl: sampleVideoUrl,
    title: 'Paul Simon - You Can Call Me Al',
  },
};

export const ExpandedWithoutVideo: Story = {
  args: {
    isExpanded: true,
    albumArtworkUrl: sampleAlbumArtwork,
    title: 'Paul Simon - Graceland',
  },
};

export const ExpandedPlaceholder: Story = {
  args: {
    isExpanded: true,
    title: 'Unknown Song',
  },
};

export const Collapsed: Story = {
  args: {
    isExpanded: false,
    albumArtworkUrl: sampleAlbumArtwork,
    title: 'Bob Dylan - Like a Rolling Stone',
  },
};

export const CollapsedPlaceholder: Story = {
  args: {
    isExpanded: false,
    title: 'Unknown Song',
  },
};

