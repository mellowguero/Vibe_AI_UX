import type { Meta, StoryObj } from '@storybook/react';
import { AIMessageBubble } from './AIMessageBubble';
import { MediaModule } from './modules/MediaModule/MediaModule';
import { ImageModule } from './modules/ImageModule';
import { TextModule } from './modules/TextModule';
import { MapModule } from './modules/MapModule';
import { SearchModule } from './modules/SearchModule';
import { createMessage } from '../stories/mocks';

const meta: Meta = {
  title: 'Components/MessageBubbles',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Helper to render nested module
const renderNestedModule = (message: any, isExpanded: boolean) => {
  if (!message.nestedModule) return null;
  const { type, data } = message.nestedModule;

  if (isExpanded) {
    switch (type) {
      case 'media':
        return <MediaModule data={data} onUpdate={() => {}} />;
      case 'image':
        return <ImageModule data={data} onUpdate={() => {}} />;
      case 'text':
        return <TextModule data={data} onUpdate={() => {}} />;
      case 'map':
        return <MapModule data={data} onChange={() => {}} moduleId="story" />;
      case 'search':
        return <SearchModule data={data} onChange={() => {}} />;
      default:
        return null;
    }
  } else {
    // Preview mode
    return (
      <div className="nested-module-preview">
        <div className="nested-module-preview-content">
          <div className="nested-module-preview-icon">
            {type === 'media' ? '🎵' : type === 'image' ? '🖼️' : type === 'text' ? '📝' : type === 'map' ? '📍' : '🔍'}
          </div>
          <div className="nested-module-preview-text">
            <div className="nested-module-preview-title">
              {type === 'media' ? 'Music Player' : type === 'image' ? 'Image' : type === 'text' ? 'Text' : type === 'map' ? 'Map' : 'Search'}
            </div>
            <div className="nested-module-preview-subtitle">
              {type === 'media' ? data.title || 'Untitled' : type === 'image' ? data.label || '' : type === 'text' ? (data.text?.substring(0, 50) || 'Empty note') : type === 'map' ? data.locationQuery || 'No location' : data.query || 'No query'}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

// User Message Bubbles
export const UserMessageBottomTailShort: Story = {
  render: () => {
    const message = createMessage('user', 'This is a user message');
    return (
      <div className="chat-message chat-message-user">
        <div className="chat-message-bubble tail-bottom">
          <div className="chat-message-text">{message.text}</div>
        </div>
        <div className="chat-message-time">07:16 PM</div>
      </div>
    );
  },
};

export const UserMessageTopTailShort: Story = {
  render: () => {
    const message = createMessage('user', 'This is a user message');
    return (
      <div className="chat-message chat-message-user">
        <div className="chat-message-bubble tail-top">
          <div className="chat-message-text">{message.text}</div>
        </div>
        <div className="chat-message-time">07:16 PM</div>
      </div>
    );
  },
};

export const UserMessageBottomTailLong: Story = {
  render: () => {
    const message = createMessage('user', 'This is a longer user message that demonstrates how the bubble scales with content. The text will wrap naturally and the bubble will grow to accommodate it, but it will never exceed the maximum width of 400px as specified in the design.');
    return (
      <div className="chat-message chat-message-user">
        <div className="chat-message-bubble tail-bottom">
          <div className="chat-message-text">{message.text}</div>
        </div>
        <div className="chat-message-time">07:16 PM</div>
      </div>
    );
  },
};

export const UserMessageTopTailLong: Story = {
  render: () => {
    const message = createMessage('user', 'This is a longer user message that demonstrates how the bubble scales with content. The text will wrap naturally and the bubble will grow to accommodate it, but it will never exceed the maximum width of 400px as specified in the design.');
    return (
      <div className="chat-message chat-message-user">
        <div className="chat-message-bubble tail-top">
          <div className="chat-message-text">{message.text}</div>
        </div>
        <div className="chat-message-time">07:16 PM</div>
      </div>
    );
  },
};

export const UserMessageWithMusic: Story = {
  render: () => {
    const message = createMessage('user', 'Hey, check out this song!');
    return (
      <div className="chat-message chat-message-user">
        <div className="chat-message-bubble tail-bottom">
          <div className="chat-message-text">{message.text}</div>
          <div className="music-module-placeholder"></div>
        </div>
        <div className="chat-message-time">07:16 PM</div>
      </div>
    );
  },
};

// AI Message Bubbles
export const AIMessageBottomTailShort: Story = {
  render: () => {
    const message = createMessage('ai', 'This is an AI message from Alex Oskie');
    return (
      <div className="chat-message chat-message-ai">
        <div className="chat-message-bubble tail-bottom">
          <div className="chat-message-text">{message.text}</div>
        </div>
        <div className="chat-message-time">07:17 PM</div>
      </div>
    );
  },
};

export const AIMessageTopTailShort: Story = {
  render: () => {
    const message = createMessage('ai', 'This is an AI message from Alex Oskie');
    return (
      <div className="chat-message chat-message-ai">
        <div className="chat-message-bubble tail-top">
          <div className="chat-message-text">{message.text}</div>
        </div>
        <div className="chat-message-time">07:17 PM</div>
      </div>
    );
  },
};

export const AIMessageBottomTailLong: Story = {
  render: () => {
    const message = createMessage('ai', 'This is a longer AI message that demonstrates how the bubble scales with content. The text will wrap naturally and the bubble will grow to accommodate it, but it will never exceed the maximum width of 400px as specified in the design.');
    return (
      <div className="chat-message chat-message-ai">
        <div className="chat-message-bubble tail-bottom">
          <div className="chat-message-text">{message.text}</div>
        </div>
        <div className="chat-message-time">07:17 PM</div>
      </div>
    );
  },
};

export const AIMessageTopTailLong: Story = {
  render: () => {
    const message = createMessage('ai', 'This is a longer AI message that demonstrates how the bubble scales with content. The text will wrap naturally and the bubble will grow to accommodate it, but it will never exceed the maximum width of 400px as specified in the design.');
    return (
      <div className="chat-message chat-message-ai">
        <div className="chat-message-bubble tail-top">
          <div className="chat-message-text">{message.text}</div>
        </div>
        <div className="chat-message-time">07:17 PM</div>
      </div>
    );
  },
};

export const AIMessageWithMusic: Story = {
  render: () => {
    const message = createMessage('ai', "give 'Bob Dylan - Like a Rolling Stone' a spin. It's like a musical time machine back to the 60s.");
    return (
      <div className="chat-message chat-message-ai">
        <div className="chat-message-bubble tail-bottom">
          <div className="chat-message-text">{message.text}</div>
          <div className="music-module-placeholder"></div>
        </div>
        <div className="chat-message-time">07:17 PM</div>
      </div>
    );
  },
};

export const AIMessageWithNestedModule: Story = {
  render: () => {
    const message = createMessage('ai', 'Check out this song:', {
      type: 'media',
      data: {
        title: 'Bob Dylan - Like a Rolling Stone',
        audioUrl: '',
        videoId: 'IwOfCgkyEj0',
        channelTitle: 'BobDylanVEVO',
      },
    });
    return (
      <AIMessageBubble
        message={message}
        isExpanded={true}
        onToggleExpand={() => {}}
        onExtract={() => {}}
        onDragStart={() => {}}
        renderNestedModule={renderNestedModule}
      />
    );
  },
};

