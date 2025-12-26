export type ModuleType = 'image' | 'media' | 'text' | 'map' | 'search' | 'chat'

export type ImageModuleData = {
  imageUrl: string
  label?: string
  searchQuery?: string // For searching images
  isLoading?: boolean
  imageProvider?: 'unsplash' | 'google' // Image search provider
  error?: string // Error message to display
}

export type MediaModuleData = {
  title: string
  audioUrl: string
  videoId?: string // YouTube video ID
  channelTitle?: string
  thumbnailUrl?: string
  albumArtworkUrl?: string // Album artwork from iTunes or other source
  isLoading?: boolean
}

export type TextModuleData = {
  text: string
}

export type MapModuleData = {
  locationQuery: string
  description?: string
  latitude?: number
  longitude?: number
  formattedAddress?: string
  isLoading?: boolean
  error?: string
}

export type SearchModuleData = {
  query: string
  // stubbed for now; can be used later for real results
  results?: {
    id: string
    title: string
    snippet: string
  }[]
  isLoading?: boolean
}

export type ChatMessage = {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: number
  nestedModule?: {
    type: ModuleType
    data: any
  }
}

export type ChatModuleData = {
  messages: ChatMessage[]
  isLoading?: boolean
  error?: string
}

export type ModuleInstance =
  | {
      id: string
      type: 'image'
      x: number
      y: number
      z: number
      data: ImageModuleData
    }
  | {
      id: string
      type: 'media'
      x: number
      y: number
      z: number
      data: MediaModuleData
    }
  | {
      id: string
      type: 'text'
      x: number
      y: number
      z: number
      data: TextModuleData
    }
  | {
      id: string
      type: 'map'
      x: number
      y: number
      z: number
      data: MapModuleData
    }
  | {
      id: string
      type: 'search'
      x: number
      y: number
      z: number
      data: SearchModuleData
    }
  | {
      id: string
      type: 'chat'
      x: number
      y: number
      z: number
      width?: number
      data: ChatModuleData
    }

// Icon configuration for components
// Centralized icon mapping - change icons here instead of in individual components
export type IconName = 
  | 'SendIcon' 
  | 'LastTrackIcon' 
  | 'NextTrackIcon' 
  | 'PlayIcon' 
  | 'RepeatIcon' 
  | 'ShuffleIcon' 
  | 'PlaceholderIcon'
  | 'CloseIcon'
  | 'ExpandIcon'
  | 'CollapseIcon'
  | 'ExtractIcon'
  | 'DragHandleIcon'

export interface ComponentIconConfig {
  TextInput: IconName
  RoundButton: IconName
  // Add more component icon mappings here as needed
  // Example: ChatInput: IconName
}

// Default icon configuration
export const componentIcons: ComponentIconConfig = {
  TextInput: 'SendIcon', // Change this to update TextInput icon globally
  RoundButton: 'PlaceholderIcon', // Change this to update RoundButton icon globally
}

