export type ModuleType = 'image' | 'media' | 'text' | 'map' | 'search'

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

