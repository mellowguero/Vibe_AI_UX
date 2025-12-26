import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MediaPreviewWindow } from './MediaPreviewWindow';
import { extractDominantColor, extractColorPalette, rgbToRgba, rgbToHex, rgbToRgb } from '../../../utils/colorExtraction';

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

// Color Extraction Playground Story
export const ColorExtractionPlayground: Story = {
  render: () => {
    const [imageUrl, setImageUrl] = useState('/assets/media-preview/graceland_cover.jpg');
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [dominantColor, setDominantColor] = useState<{ r: number; g: number; b: number } | null>(null);
    const [palette, setPalette] = useState<Array<{ r: number; g: number; b: number }>>([]);
    const [paletteCount, setPaletteCount] = useState(5);
    const [showPalette, setShowPalette] = useState(true);
    const [manualColor, setManualColor] = useState<string>('');
    const [useManualColor, setUseManualColor] = useState(false);
    const [scrimColor, setScrimColor] = useState<string>('');

    const assetImages = [
      { label: 'Graceland Cover', url: '/assets/media-preview/graceland_cover.jpg' },
    ];

    const currentImageUrl = uploadedImageUrl || imageUrl;

    useEffect(() => {
      if (!currentImageUrl) {
        setDominantColor(null);
        setPalette([]);
        setScrimColor('');
        return;
      }

      const extractColors = async () => {
        try {
          const dominant = await extractDominantColor(currentImageUrl);
          setDominantColor(dominant);
          
          if (dominant) {
            setScrimColor(rgbToRgba(dominant, 0.61));
          }

          if (showPalette) {
            const colors = await extractColorPalette(currentImageUrl, paletteCount);
            setPalette(colors);
          } else {
            setPalette([]);
          }
        } catch (error) {
          console.error('Error extracting colors:', error);
          setDominantColor(null);
          setPalette([]);
          setScrimColor('');
        }
      };

      extractColors();
    }, [currentImageUrl, paletteCount, showPalette]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setUploadedImageUrl(objectUrl);
        setImageUrl(''); // Clear asset selection
      }
    };

    const handlePaletteColorClick = (color: { r: number; g: number; b: number }) => {
      setDominantColor(color);
      setScrimColor(rgbToRgba(color, 0.61));
      setUseManualColor(false);
    };

    const finalScrimColor = useManualColor && manualColor 
      ? manualColor 
      : scrimColor || 'rgba(128, 128, 128, 0.61)';

    return (
      <div style={{ padding: '2rem', maxWidth: '800px' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Color Extraction Playground</h2>
        
        {/* Image Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Image Selection</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Select from Assets:
            </label>
            <select
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setUploadedImageUrl(null);
              }}
              style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem' }}
            >
              <option value="">-- Select Asset --</option>
              {assetImages.map((asset, idx) => (
                <option key={idx} value={asset.url}>{asset.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Upload Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ fontSize: '0.875rem' }}
            />
            {uploadedImageUrl && (
              <button
                onClick={() => {
                  URL.revokeObjectURL(uploadedImageUrl);
                  setUploadedImageUrl(null);
                }}
                style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              >
                Clear Upload
              </button>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Manual URL:
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setUploadedImageUrl(null);
              }}
              placeholder="Enter image URL"
              style={{ width: '100%', padding: '0.5rem', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* Image Preview */}
        {currentImageUrl && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Image Preview</h3>
            <img
              src={currentImageUrl}
              alt="Preview"
              style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
        )}

        {/* Dominant Color Display */}
        {dominantColor && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Dominant Color</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: rgbToRgb(dominantColor),
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                }}
              />
              <div>
                <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  RGB: {rgbToRgb(dominantColor)}
                </div>
                <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Hex: {rgbToHex(dominantColor)}
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  RGBA (0.61): {rgbToRgba(dominantColor, 0.61)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Color Palette Display */}
        {showPalette && palette.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Color Palette</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {palette.map((color, idx) => (
                <div
                  key={idx}
                  onClick={() => handlePaletteColorClick(color)}
                  style={{
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '2px solid transparent',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#007AFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: rgbToRgb(color),
                      borderRadius: '4px',
                      marginBottom: '0.25rem',
                      border: '1px solid #ddd',
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', textAlign: 'center' }}>
                    {rgbToRgb(color)}
                  </div>
                  <div style={{ fontSize: '0.75rem', textAlign: 'center', color: '#666' }}>
                    {rgbToHex(color)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
              Click a color to use it as the dominant color
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Controls</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={showPalette}
                onChange={(e) => setShowPalette(e.target.checked)}
              />
              Show Palette
            </label>
            {showPalette && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  Palette Color Count: {paletteCount}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={paletteCount}
                  onChange={(e) => setPaletteCount(Number(e.target.value))}
                  style={{ width: '200px' }}
                />
              </div>
            )}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={useManualColor}
                onChange={(e) => setUseManualColor(e.target.checked)}
              />
              Use Manual Color Override
            </label>
            {useManualColor && (
              <input
                type="text"
                value={manualColor}
                onChange={(e) => setManualColor(e.target.value)}
                placeholder="rgba(r, g, b, a)"
                style={{ width: '200px', padding: '0.5rem', fontSize: '0.875rem' }}
              />
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Live Preview</h3>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', backgroundColor: '#f5f5f5' }}>
            <div style={{ '--color-media-preview-scrim': finalScrimColor } as React.CSSProperties}>
              <MediaPreviewWindow
                isExpanded={true}
                albumArtworkUrl={currentImageUrl}
                title="Test Song"
              />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
            Scrim Color: {finalScrimColor}
          </div>
        </div>
      </div>
    );
  },
};

