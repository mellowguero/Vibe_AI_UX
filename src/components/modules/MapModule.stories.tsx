import type { Meta, StoryObj } from '@storybook/react';
import { MapModule } from './MapModule';
import { mapWithLocation, mapLoading } from '../../stories/mocks';

const meta: Meta<typeof MapModule> = {
  title: 'Modules/MapModule',
  component: MapModule,
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
type Story = StoryObj<typeof MapModule>;

const mockOnChange = (data: any) => {
  console.log('MapModule onChange:', data);
};

export const WithLocation: Story = {
  args: {
    data: mapWithLocation,
    onChange: mockOnChange,
    moduleId: 'map-story-1',
  },
};

export const Loading: Story = {
  args: {
    data: mapLoading,
    onChange: mockOnChange,
    moduleId: 'map-story-2',
  },
};

export const Empty: Story = {
  args: {
    data: {
      locationQuery: '',
      isLoading: false,
    },
    onChange: mockOnChange,
    moduleId: 'map-story-3',
  },
};
