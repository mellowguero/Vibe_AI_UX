import type { ModuleInstance, ModuleType } from './types/modules'
import { searchImages } from './api/services'
import { extractArtistNameWithAI, extractArtistName } from './utils/textParsing'

export type CompositionAction = {
  label: string
  apply: (from: ModuleInstance, to: ModuleInstance) => ModuleInstance[] | Promise<ModuleInstance[]>
}

export type CompositionRule = {
  from: ModuleType
  to: ModuleType
  actions: CompositionAction[]
}

export const compositionRules: CompositionRule[] = [
  {
    from: 'image',
    to: 'text',
    actions: [
      {
        label: 'Append image URL to note',
        apply: (from, to) => {
          if (from.type !== 'image' || to.type !== 'text') return [from, to]

          const imageUrl = from.data.imageUrl || ''
          const prevText = to.data.text || ''

          const newText = prevText
            ? prevText + '\n' + imageUrl
            : imageUrl

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              text: newText,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  {
    from: 'text',
    to: 'media',
    actions: [
      {
        label: 'Use note text as song title',
        apply: (from, to) => {
          if (from.type !== 'text' || to.type !== 'media') return [from, to]

          const title = from.data.text || ''

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              title,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Image → Map: use label as location query
  {
    from: 'image',
    to: 'map',
    actions: [
      {
        label: 'Use image label as map query',
        apply: (from, to) => {
          if (from.type !== 'image' || to.type !== 'map') return [from, to]

          const query =
            from.data.label?.trim() || from.data.imageUrl || ''

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              locationQuery: query,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Text → Map: use note text as query
  {
    from: 'text',
    to: 'map',
    actions: [
      {
        label: 'Use note text as map query',
        apply: (from, to) => {
          if (from.type !== 'text' || to.type !== 'map') return [from, to]

          const query = from.data.text.trim()

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              locationQuery: query,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Text → Search: use note text as query
  {
    from: 'text',
    to: 'search',
    actions: [
      {
        label: 'Use note text as search query',
        apply: (from, to) => {
          if (from.type !== 'text' || to.type !== 'search') return [from, to]

          const query = from.data.text.trim()

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              query,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Image → Search: use label or URL as query
  {
    from: 'image',
    to: 'search',
    actions: [
      {
        label: 'Use image label as search query',
        apply: (from, to) => {
          if (from.type !== 'image' || to.type !== 'search') return [from, to]

          const query = (from.data.label || from.data.imageUrl || '').trim()

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              query,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Map → Search: use map location query as search query
  {
    from: 'map',
    to: 'search',
    actions: [
      {
        label: 'Use map location as search query',
        apply: (from, to) => {
          if (from.type !== 'map' || to.type !== 'search') return [from, to]

          const query = from.data.locationQuery.trim()

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              query,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Search → Map: populate map from search query
  {
    from: 'search',
    to: 'map',
    actions: [
      {
        label: 'Populate map from search query',
        apply: (from, to) => {
          if (from.type !== 'search' || to.type !== 'map') return [from, to]

          const query = from.data.query.trim()
          const description = query ? `Searching for ${query}…` : undefined

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              locationQuery: query,
              description,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Search → Text: add search query to note
  {
    from: 'search',
    to: 'text',
    actions: [
      {
        label: 'Add search query to note',
        apply: (from, to) => {
          if (from.type !== 'search' || to.type !== 'text') return [from, to]

          const query = from.data.query.trim()
          const prevText = to.data.text || ''
          const newText = prevText ? prevText + '\n' + query : query

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              text: newText,
            },
          }

          return [from, updatedTo]
        },
      },
      {
        label: 'Populate note with search results',
        apply: (from, to) => {
          if (from.type !== 'search' || to.type !== 'text') return [from, to]

          const query = from.data.query.trim()
          const results = from.data.results || []
          const prevText = to.data.text || ''

          let resultsText = ''
          if (results.length > 0) {
            resultsText = results
              .map((r) => `• ${r.title}\n  ${r.snippet}`)
              .join('\n\n')
          } else {
            resultsText = `Search query: ${query}\n(No results yet)`
          }

          const newText = prevText
            ? prevText + '\n\n' + resultsText
            : resultsText

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              text: newText,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Search → Media: use search query as track title
  {
    from: 'search',
    to: 'media',
    actions: [
      {
        label: 'Use search query as track title',
        apply: (from, to) => {
          if (from.type !== 'search' || to.type !== 'media') return [from, to]

          const title = from.data.query.trim()

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              title,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Search → Image: find image from search query
  {
    from: 'search',
    to: 'image',
    actions: [
      {
        label: 'Find image from search query',
        apply: async (from, to) => {
          if (from.type !== 'search' || to.type !== 'image') return [from, to]

          const query = from.data.query.trim()
          
          // Update label immediately and set loading state
          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              label: query,
              isLoading: true,
            },
          }

          // Search for image asynchronously
          if (query) {
            try {
              const provider = to.data.imageProvider || 'unsplash'
              console.log(`Searching ${provider === 'google' ? 'Google Images' : 'Unsplash'} for:`, query)
              const imageResult = await searchImages(query, provider)
              if (imageResult) {
                console.log('Found image:', imageResult.imageUrl)
                return [
                  from,
                  {
                    ...updatedTo,
                    data: {
                      ...updatedTo.data,
                      imageUrl: imageResult.imageUrl,
                      label: imageResult.label || query,
                      isLoading: false,
                    },
                  },
                ]
              } else {
                console.warn('No image found for:', query)
              }
            } catch (error) {
              console.error('Image search failed:', error)
            }
          }

          return [
            from,
            {
              ...updatedTo,
              data: {
                ...updatedTo.data,
                isLoading: false,
              },
            },
          ]
        },
      },
    ],
  },
  // Media → Text: add track info to note
  {
    from: 'media',
    to: 'text',
    actions: [
      {
        label: 'Add track info to note',
        apply: (from, to) => {
          if (from.type !== 'media' || to.type !== 'text') return [from, to]

          const trackInfo = `Track: ${from.data.title}\nURL: ${from.data.audioUrl || '(no URL)'}`
          const prevText = to.data.text || ''
          const newText = prevText ? prevText + '\n\n' + trackInfo : trackInfo

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              text: newText,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Media → Search: search for this track
  {
    from: 'media',
    to: 'search',
    actions: [
      {
        label: 'Search for this track',
        apply: (from, to) => {
          if (from.type !== 'media' || to.type !== 'search') return [from, to]

          const query = from.data.title.trim()

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              query,
            },
          }

          return [from, updatedTo]
        },
      },
      {
        label: 'Search for artist name only',
        apply: async (from, to) => {
          if (from.type !== 'media' || to.type !== 'search') return [from, to]

          const title = from.data.title.trim()
          // Use AI if available, otherwise use pattern matching
          const artistName = await extractArtistNameWithAI(title)

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              query: artistName,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Media → Image: find image of artist/band
  {
    from: 'media',
    to: 'image',
    actions: [
      {
        label: 'Find image of artist/band',
        apply: async (from, to) => {
          if (from.type !== 'media' || to.type !== 'image') return [from, to]

          const title = from.data.title.trim()
          
          // Extract artist name from song title (e.g., "Queen - Bohemian Rhapsody" -> "Queen")
          const artistName = extractArtistName(title)
          const searchQuery = artistName || title
          
          // Update label immediately and set loading state
          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              label: searchQuery,
              isLoading: true,
            },
          }

          // Search for image asynchronously
          if (searchQuery) {
            try {
              const provider = to.data.imageProvider || 'unsplash'
              console.log(`Searching ${provider === 'google' ? 'Google Images' : 'Unsplash'} for:`, searchQuery)
              const imageResult = await searchImages(searchQuery, provider)
              if (imageResult) {
                console.log('Found image:', imageResult.imageUrl)
                return [
                  from,
                  {
                    ...updatedTo,
                    data: {
                      ...updatedTo.data,
                      imageUrl: imageResult.imageUrl,
                      label: imageResult.label || searchQuery,
                      isLoading: false,
                    },
                  },
                ]
              } else {
                console.warn('No image found for:', searchQuery)
              }
            } catch (error) {
              console.error('Image search failed:', error)
            }
          }

          return [
            from,
            {
              ...updatedTo,
              data: {
                ...updatedTo.data,
                isLoading: false,
              },
            },
          ]
        },
      },
    ],
  },
  // Map → Text: add location to note
  {
    from: 'map',
    to: 'text',
    actions: [
      {
        label: 'Add location to note',
        apply: (from, to) => {
          if (from.type !== 'map' || to.type !== 'text') return [from, to]

          const location = from.data.locationQuery.trim()
          const description = from.data.description || ''
          const locationInfo = description
            ? `Location: ${location}\n${description}`
            : `Location: ${location}`

          const prevText = to.data.text || ''
          const newText = prevText ? prevText + '\n\n' + locationInfo : locationInfo

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              text: newText,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Media → Chat: send song recommendation to chat
  {
    from: 'media',
    to: 'chat',
    actions: [
      {
        label: 'Send song recommendation to chat',
        apply: (from, to) => {
          if (from.type !== 'media' || to.type !== 'chat') return [from, to]

          const title = from.data.title.trim()
          const messageText = title ? `Check out this song: ${title}` : 'Check out this song!'
          
          const userMessage = {
            id: crypto.randomUUID(),
            sender: 'user' as const,
            text: messageText,
            timestamp: Date.now(),
            nestedModule: {
              type: 'media' as const,
              data: from.data,
            },
          }

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              messages: [...to.data.messages, userMessage],
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Text → Chat: send text to chat
  {
    from: 'text',
    to: 'chat',
    actions: [
      {
        label: 'Send text to chat',
        apply: (from, to) => {
          if (from.type !== 'text' || to.type !== 'chat') return [from, to]

          const text = from.data.text.trim()
          if (!text) return [from, to]

          const userMessage = {
            id: crypto.randomUUID(),
            sender: 'user' as const,
            text: text,
            timestamp: Date.now(),
          }

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              messages: [...to.data.messages, userMessage],
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Chat → Media: extract nested Music Player from chat
  {
    from: 'chat',
    to: 'media',
    actions: [
      {
        label: 'Extract Music Player from chat',
        apply: (from, to) => {
          if (from.type !== 'chat' || to.type !== 'media') return [from, to]

          // Find the most recent message with a nested media module
          const mediaMessage = [...from.data.messages]
            .reverse()
            .find(msg => msg.nestedModule?.type === 'media')

          if (!mediaMessage?.nestedModule) {
            return [from, to]
          }

          const updatedTo: ModuleInstance = {
            ...to,
            data: mediaMessage.nestedModule.data,
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Chat → Text: extract text from chat message
  {
    from: 'chat',
    to: 'text',
    actions: [
      {
        label: 'Extract text from last chat message',
        apply: (from, to) => {
          if (from.type !== 'chat' || to.type !== 'text') return [from, to]

          const lastMessage = from.data.messages[from.data.messages.length - 1]
          if (!lastMessage?.text) return [from, to]

          const prevText = to.data.text || ''
          const newText = prevText ? prevText + '\n\n' + lastMessage.text : lastMessage.text

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              text: newText,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
]

