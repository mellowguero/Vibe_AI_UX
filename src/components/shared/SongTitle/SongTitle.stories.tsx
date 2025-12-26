import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SongTitle } from './SongTitle';

const meta: Meta<typeof SongTitle> = {
  title: 'Components/SongTitle',
  component: SongTitle,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    currentTime: {
      control: 'number',
    },
    variant: {
      control: 'select',
      options: ['master', 'chat', 'collapsed'],
    },
    isActive: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SongTitle>;

export const MasterActive: Story = {
  args: {
    title: 'The Beatles - Hey Jude',
    currentTime: 0,
    variant: 'master',
    isActive: true,
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#1a1a1a', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const MasterActiveWithTime: Story = {
  args: {
    title: 'The Beatles - Hey Jude',
    currentTime: 72,
    variant: 'master',
    isActive: true,
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#1a1a1a', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const MasterInactive: Story = {
  args: {
    title: 'Paul Simon - Graceland',
    variant: 'master',
    isActive: false,
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#1a1a1a', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const Chat: Story = {
  args: {
    title: 'The Beatles - Hey Jude',
    currentTime: 12,
    variant: 'chat',
    isActive: false,
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#1a1a1a', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const ChatMultiple: Story = {
  render: () => (
    <div style={{ background: '#1a1a1a', padding: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <SongTitle
        title="The Beatles - Hey Jude"
        currentTime={12}
        variant="chat"
        isActive={false}
      />
      <SongTitle
        title="Paul Simon - Graceland"
        currentTime={83}
        variant="chat"
        isActive={false}
      />
      <SongTitle
        title="Bob Dylan - Like a Rolling Stone"
        currentTime={0}
        variant="chat"
        isActive={false}
      />
    </div>
  ),
};

export const Collapsed: Story = {
  args: {
    title: 'The Beatles - Hey Jude',
    variant: 'collapsed',
    isActive: false,
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#1a1a1a', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const CollapsedMultiple: Story = {
  render: () => (
    <div style={{ background: '#1a1a1a', padding: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <SongTitle
        title="The Beatles - Hey Jude"
        variant="collapsed"
        isActive={false}
      />
      <SongTitle
        title="Paul Simon - Graceland"
        variant="collapsed"
        isActive={false}
      />
      <SongTitle
        title="Song Without Artist"
        variant="collapsed"
        isActive={false}
      />
    </div>
  ),
};

export const TimeUpdates: Story = {
  render: () => {
    const [time, setTime] = React.useState(0);
    
    React.useEffect(() => {
      const interval = setInterval(() => {
        setTime((prev) => (prev >= 300 ? 0 : prev + 1));
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div style={{ background: '#1a1a1a', padding: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <div style={{ color: 'white', marginBottom: '1rem' }}>
          Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
        </div>
        <SongTitle
          title="The Beatles - Hey Jude"
          currentTime={time}
          variant="master"
          isActive={true}
        />
        <SongTitle
          title="Paul Simon - Graceland"
          currentTime={time}
          variant="chat"
          isActive={false}
        />
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ background: '#1a1a1a', padding: '2rem', display: 'flex', gap: '2rem', flexDirection: 'column' }}>
      <div>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Master Variant</h3>
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <SongTitle
            title="The Beatles - Hey Jude"
            currentTime={72}
            variant="master"
            isActive={true}
          />
          <SongTitle
            title="Paul Simon - Graceland"
            variant="master"
            isActive={false}
          />
        </div>
      </div>
      <div>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Chat Variant</h3>
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <SongTitle
            title="The Beatles - Hey Jude"
            currentTime={12}
            variant="chat"
            isActive={false}
          />
          <SongTitle
            title="Paul Simon - Graceland"
            currentTime={83}
            variant="chat"
            isActive={false}
          />
        </div>
      </div>
      <div>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Collapsed Variant</h3>
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <SongTitle
            title="The Beatles - Hey Jude"
            variant="collapsed"
            isActive={false}
          />
          <SongTitle
            title="Paul Simon - Graceland"
            variant="collapsed"
            isActive={false}
          />
        </div>
      </div>
    </div>
  ),
};

