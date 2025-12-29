import type {
  ChatModuleData,
  ChatMessage,
  MediaModuleData,
  ImageModuleData,
  TextModuleData,
  MapModuleData,
  SearchModuleData,
  ModuleType,
} from '../types/modules'

// Mock ChatModule data
export const emptyChatData: ChatModuleData = {
  messages: [],
  isLoading: false,
}

export const chatWithMessages: ChatModuleData = {
  messages: [
    {
      id: '1',
      sender: 'user',
      text: 'Hey, check out this song!',
      timestamp: Date.now() - 60000,
    },
    {
      id: '2',
      sender: 'ai',
      text: "give 'Bob Dylan - Like a Rolling Stone' a spin. It's like a musical time machine back to the 60s.",
      timestamp: Date.now() - 30000,
      nestedModule: {
        type: 'media',
        data: {
          title: 'Bob Dylan - Like a Rolling Stone',
          audioUrl: '',
          videoId: 'IwOfCgkyEj0',
          channelTitle: 'BobDylanVEVO',
          thumbnailUrl: 'https://img.youtube.com/vi/IwOfCgkyEj0/maxresdefault.jpg',
        },
      },
    },
  ],
  isLoading: false,
}

export const chatWithLongMessages: ChatModuleData = {
  messages: [
    {
      id: '1',
      sender: 'user',
      text: 'This is a longer user message that demonstrates how the bubble scales with content. The text will wrap naturally and the bubble will grow to accommodate it, but it will never exceed the maximum width of 400px as specified in the design.',
      timestamp: Date.now() - 60000,
    },
    {
      id: '2',
      sender: 'ai',
      text: 'This is a longer AI message that demonstrates how the bubble scales with content. The text will wrap naturally and the bubble will grow to accommodate it, but it will never exceed the maximum width of 400px as specified in the design.',
      timestamp: Date.now() - 30000,
    },
  ],
  isLoading: false,
}

export const chatWithNestedModule: ChatModuleData = {
  messages: [
    {
      id: '1',
      sender: 'ai',
      text: 'Check out this song:',
      timestamp: Date.now() - 60000,
      nestedModule: {
        type: 'media',
        data: {
          title: 'Bob Dylan - Like a Rolling Stone',
          audioUrl: '',
          videoId: 'IwOfCgkyEj0',
          channelTitle: 'BobDylanVEVO',
        },
      },
    },
  ],
  isLoading: false,
}

export const chatLoading: ChatModuleData = {
  messages: [
    {
      id: '1',
      sender: 'user',
      text: 'What is the weather like?',
      timestamp: Date.now() - 5000,
    },
  ],
  isLoading: true,
}

export const chatWithError: ChatModuleData = {
  messages: [
    {
      id: '1',
      sender: 'user',
      text: 'Test message',
      timestamp: Date.now() - 5000,
    },
  ],
  isLoading: false,
  error: 'Failed to get AI response. Please check your OpenAI API key.',
}

// Mock MediaModule data
export const mediaWithVideo: MediaModuleData = {
  title: 'Bob Dylan - Like a Rolling Stone',
  audioUrl: '',
  videoId: 'IwOfCgkyEj0',
  channelTitle: 'BobDylanVEVO',
  thumbnailUrl: 'https://img.youtube.com/vi/IwOfCgkyEj0/maxresdefault.jpg',
  isLoading: false,
}

export const mediaLoading: MediaModuleData = {
  title: 'Bob Dylan - Like a Rolling Stone',
  audioUrl: '',
  isLoading: true,
}

export const mediaAudioOnly: MediaModuleData = {
  title: 'Song Title',
  audioUrl: 'https://example.com/audio.mp3',
  isLoading: false,
}

// Mock ImageModule data
export const imageWithUrl: ImageModuleData = {
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  label: 'Mountain Landscape',
  isLoading: false,
}

export const imageLoading: ImageModuleData = {
  searchQuery: 'mountain',
  isLoading: true,
}

// Mock TextModule data
export const textModuleData: TextModuleData = {
  text: 'This is some sample text content that can be edited.',
}

// Mock MapModule data
export const mapWithLocation: MapModuleData = {
  locationQuery: 'San Francisco, CA',
  latitude: 37.7749,
  longitude: -122.4194,
  formattedAddress: 'San Francisco, CA, USA',
  isLoading: false,
}

export const mapLoading: MapModuleData = {
  locationQuery: 'New York',
  isLoading: true,
}

// Mock SearchModule data
export const searchWithResults: SearchModuleData = {
  query: 'best pizza in SF',
  results: [
    {
      id: '1',
      title: 'Best Pizza Places in San Francisco',
      snippet: 'Discover the top-rated pizza restaurants in San Francisco...',
    },
    {
      id: '2',
      title: 'Pizza in SF - Yelp',
      snippet: 'Find the best pizza near you in San Francisco...',
    },
  ],
  isLoading: false,
}

export const searchLoading: SearchModuleData = {
  query: 'best pizza',
  isLoading: true,
}

// Helper to create chat messages with different tail positions
export function createMessage(
  sender: 'user' | 'ai',
  text: string,
  hasNestedModule?: { type: ModuleType; data: any }
): ChatMessage {
  return {
    id: crypto.randomUUID(),
    sender,
    text,
    timestamp: Date.now(),
    nestedModule: hasNestedModule,
  }
}

