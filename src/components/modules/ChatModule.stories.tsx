import type { Meta, StoryObj } from '@storybook/react';
import { ChatModule } from './ChatModule';
import {
  emptyChatData,
  chatWithMessages,
  chatWithLongMessages,
  chatWithNestedModule,
  chatLoading,
  chatWithError,
} from '../../stories/mocks';

const meta: Meta<typeof ChatModule> = {
  title: 'Modules/ChatModule',
  component: ChatModule,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatModule>;

// Mock callbacks
const mockOnUpdate = (data: any) => {
  console.log('ChatModule onUpdate:', data);
};

const mockOnExtractModule = (moduleType: any, moduleData: any, position: { x: number; y: number }) => {
  console.log('Extract module:', moduleType, moduleData, position);
};

export const Empty: Story = {
  args: {
    data: emptyChatData,
    onUpdate: mockOnUpdate,
  },
};

export const WithMessages: Story = {
  args: {
    data: chatWithMessages,
    onUpdate: mockOnUpdate,
  },
};

export const WithLongMessages: Story = {
  args: {
    data: chatWithLongMessages,
    onUpdate: mockOnUpdate,
  },
};

export const WithNestedModule: Story = {
  args: {
    data: chatWithNestedModule,
    onUpdate: mockOnUpdate,
    onExtractModule: mockOnExtractModule,
  },
};

export const Loading: Story = {
  args: {
    data: chatLoading,
    onUpdate: mockOnUpdate,
  },
};

export const Error: Story = {
  args: {
    data: chatWithError,
    onUpdate: mockOnUpdate,
  },
};

// Full modal chat container with glass effect
export const FullModalChat: Story = {
  args: {
    data: chatWithMessages,
    onUpdate: mockOnUpdate,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '2rem',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '506px',
            minHeight: '400px',
          }}
        >
          <div className="chat-module-full" style={{ height: '600px' }}>
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
};

// Collapsed chat module
export const Collapsed: Story = {
  args: {
    data: emptyChatData,
    onUpdate: mockOnUpdate,
  },
  render: () => (
    <div className="chat-module-collapsed">
      <div className="chat-module-header-collapsed">
        <span>Chat</span>
        <button className="chat-expand-button">+</button>
      </div>
    </div>
  ),
};

// Glass effect with interactive controls
export const GlassEffect: Story = {
  args: {
    data: chatWithMessages,
    onUpdate: mockOnUpdate,
    lightIntensity: 80,
    refraction: 80,
    depth: 63,
    dispersion: 67,
    frost: 19,
    bgR: 255,
    bgG: 255,
    bgB: 255,
    borderWidth: 1,
    shadowBlur: 6,
    shadowSpread: 0,
    saturation: 100,
    brightness: 100,
  },
  argTypes: {
    lightIntensity: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Light intensity percentage',
    },
    refraction: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Refraction value',
    },
    depth: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Depth value',
    },
    dispersion: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Dispersion value',
    },
    frost: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Frost/blur amount',
    },
    bgR: {
      control: { type: 'range', min: 0, max: 255, step: 1 },
      description: 'Background red channel',
    },
    bgG: {
      control: { type: 'range', min: 0, max: 255, step: 1 },
      description: 'Background green channel',
    },
    bgB: {
      control: { type: 'range', min: 0, max: 255, step: 1 },
      description: 'Background blue channel',
    },
    borderWidth: {
      control: { type: 'range', min: 0, max: 5, step: 0.1 },
      description: 'Border width in pixels',
    },
    shadowBlur: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
      description: 'Shadow blur in pixels',
    },
    shadowSpread: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
      description: 'Shadow spread in pixels',
    },
    saturation: {
      control: { type: 'range', min: 0, max: 200, step: 1 },
      description: 'Saturation percentage',
    },
    brightness: {
      control: { type: 'range', min: 0, max: 200, step: 1 },
      description: 'Brightness percentage',
    },
  },
  render: (args) => {
    const {
      lightIntensity,
      refraction,
      depth,
      dispersion,
      frost,
      bgR,
      bgG,
      bgB,
      borderWidth,
      shadowBlur,
      shadowSpread,
      saturation,
      brightness,
      data,
      onUpdate,
    } = args;

    // Calculate blur based on frost value
    const blurAmount = 5 + (frost / 100) * 15; // 5px to 20px

    // Calculate background opacity based on depth and intensity
    const baseOpacity = 0.1;
    const opacity = baseOpacity + (depth / 100) * 0.15 + (lightIntensity / 100) * 0.1;

    // Calculate border opacity based on refraction
    const borderOpacity = 0.18 + (refraction / 100) * 0.12;

    // Apply background color
    const bgColor = `rgba(${bgR}, ${bgG}, ${bgB}, ${opacity})`;

    return (
      <div
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '2rem',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="chat-module-full"
          style={{
            width: '100%',
            maxWidth: '506px',
            height: '600px',
            backdropFilter: `blur(${blurAmount}px) saturate(${saturation}%) brightness(${brightness}%)`,
            WebkitBackdropFilter: `blur(${blurAmount}px) saturate(${saturation}%) brightness(${brightness}%)`,
            background: bgColor,
            border: `${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity})`,
            boxShadow: `0 4px ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, 0.1)`,
          }}
        >
          <ChatModule data={data} onUpdate={onUpdate} />
        </div>
      </div>
    );
  },
};
