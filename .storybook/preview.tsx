import type { Preview } from '@storybook/react-vite';
import React from 'react';
import '../src/styles/tokens.css';
import '../src/styles/modules.css';
// Note: GUI styles are in index.css, but we mainly need tokens and modules.css for Storybook

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;