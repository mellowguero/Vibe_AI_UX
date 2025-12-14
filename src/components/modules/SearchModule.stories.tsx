import type { Meta, StoryObj } from '@storybook/react';
import { SearchModule } from './SearchModule';
import { searchWithResults, searchLoading } from '../../stories/mocks';

const meta: Meta<typeof SearchModule> = {
  title: 'Modules/SearchModule',
  component: SearchModule,
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
type Story = StoryObj<typeof SearchModule>;

const mockOnChange = (data: any) => {
  console.log('SearchModule onChange:', data);
};

export const WithResults: Story = {
  args: {
    data: searchWithResults,
    onChange: mockOnChange,
  },
};

export const Loading: Story = {
  args: {
    data: searchLoading,
    onChange: mockOnChange,
  },
};

export const Empty: Story = {
  args: {
    data: {
      query: '',
      results: [],
      isLoading: false,
    },
    onChange: mockOnChange,
  },
};

export const NoResults: Story = {
  args: {
    data: {
      query: 'nonexistent search query xyz123',
      results: [],
      isLoading: false,
    },
    onChange: mockOnChange,
  },
};
