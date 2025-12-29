import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { AudioProgressBar } from './AudioProgressBar';
import { extractDominantColor, rgbToRgba } from '../../../utils/colorExtraction';

const meta: Meta<typeof AudioProgressBar> = {
  title: 'Components/Modules/MediaModule/AudioProgressBar',
  component: AudioProgressBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Progress value from 0 to 1',
    },
    duration: {
      control: 'number',
      description: 'Total duration in seconds',
    },
    currentTime: {
      control: 'number',
      description: 'Current time in seconds',
    },
    showHandle: {
      control: 'boolean',
      description: 'Whether to show the draggable handle',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether interaction is disabled',
    },
    color: {
      control: 'color',
      description: 'Extracted color for styling',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AudioProgressBar>;

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

export const Default: Story = {
  args: {
    progress: 0,
    showHandle: false,
    disabled: false,
  },
  decorators: [decorator],
};

export const WithProgress: Story = {
  args: {
    progress: 0.33,
    showHandle: false,
    disabled: false,
  },
  decorators: [decorator],
};

export const WithHandle: Story = {
  args: {
    progress: 0.33,
    showHandle: true,
    disabled: false,
  },
  decorators: [decorator],
};

export const FullProgress: Story = {
  args: {
    progress: 1,
    showHandle: true,
    disabled: false,
  },
  decorators: [decorator],
};

export const WithColor: Story = {
  render: () => {
    const [color, setColor] = useState<string>('#ffffff');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const extractColor = async () => {
        setIsLoading(true);
        try {
          // Use the sample album artwork
          const dominantColor = await extractDominantColor('/assets/media-preview/graceland_cover.jpg');
          if (dominantColor) {
            // Use the color at full opacity for the progress bar
            setColor(`rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})`);
          }
        } catch (error) {
          console.error('Error extracting color:', error);
          setColor('#ffffff');
        } finally {
          setIsLoading(false);
        }
      };

      extractColor();
    }, []);

    if (isLoading) {
      return (
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
        }}>
          <div style={{ color: 'white' }}>Loading color extraction...</div>
        </div>
      );
    }

    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        minHeight: '200px',
      }}>
        <AudioProgressBar
          progress={0.33}
          showHandle={true}
          color={color}
        />
        <div style={{ color: 'white', fontSize: '0.875rem' }}>
          Color: {color}
        </div>
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration] = useState(180); // 3 minutes
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
      if (!isPlaying) return;

      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = Math.min(prev + 0.1, duration);
          setProgress(newTime / duration);
          if (newTime >= duration) {
            setIsPlaying(false);
          }
          return newTime;
        });
      }, 100);

      return () => clearInterval(interval);
    }, [isPlaying, duration]);

    const handleSeek = (newProgress: number) => {
      const newTime = newProgress * duration;
      setCurrentTime(newTime);
      setProgress(newProgress);
    };

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        minHeight: '200px',
      }}>
        <AudioProgressBar
          progress={progress}
          duration={duration}
          currentTime={currentTime}
          onSeek={handleSeek}
          showHandle={true}
        />
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              background: 'white',
              color: '#667eea',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <div style={{ color: 'white', fontSize: '0.875rem' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    progress: 0.5,
    showHandle: true,
    disabled: true,
  },
  decorators: [decorator],
};

export const WithColorExtraction: Story = {
  render: () => {
    const [color, setColor] = useState<string>('#ffffff');
    const [imageUrl, setImageUrl] = useState('/assets/media-preview/graceland_cover.jpg');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0.33);

    useEffect(() => {
      if (!imageUrl) {
        setColor('#ffffff');
        return;
      }

      const extractColor = async () => {
        setIsLoading(true);
        try {
          const dominantColor = await extractDominantColor(imageUrl);
          if (dominantColor) {
            setColor(`rgb(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b})`);
          } else {
            setColor('#ffffff');
          }
        } catch (error) {
          console.error('Error extracting color:', error);
          setColor('#ffffff');
        } finally {
          setIsLoading(false);
        }
      };

      extractColor();
    }, [imageUrl]);

    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        minHeight: '200px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ color: 'white', fontSize: '0.875rem' }}>
            Image URL:
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: 'none',
              width: '300px',
              fontSize: '0.875rem',
            }}
          />
        </div>

        {isLoading && (
          <div style={{ color: 'white', fontSize: '0.875rem' }}>Extracting color...</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ color: 'white', fontSize: '0.875rem' }}>
            Progress: {Math.round(progress * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            onChange={(e) => setProgress(parseFloat(e.target.value))}
            style={{ width: '248px' }}
          />
        </div>

        <AudioProgressBar
          progress={progress}
          showHandle={true}
          color={color}
        />

        <div style={{ color: 'white', fontSize: '0.875rem' }}>
          Extracted Color: {color}
        </div>
      </div>
    );
  },
};

