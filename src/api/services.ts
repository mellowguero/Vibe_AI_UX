// API service functions for module integrations

// Search API - DuckDuckGo Instant Answer (no key needed)
// Using CORS proxy for browser compatibility
export async function searchDuckDuckGo(query: string): Promise<{
  id: string
  title: string
  snippet: string
}[]> {
  if (!query.trim()) return []

  try {
    // DuckDuckGo Instant Answer API via CORS proxy
    const apiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    // Using allorigins.win as a CORS proxy (free, no key needed)
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`
    
    console.log('Searching for:', query)
    const response = await fetch(proxyUrl)

    if (!response.ok) {
      console.error('Search response not OK:', response.status, response.statusText)
      // Return fallback result instead of empty array
      return [{
        id: 'error',
        title: `Search: ${query}`,
        snippet: `Search failed (${response.status}). Try again or use a different query.`,
      }]
    }

    const data = await response.json()
    console.log('Search response data:', data)

    const results: { id: string; title: string; snippet: string }[] = []

    // Extract Abstract (if available)
    if (data.AbstractText) {
      results.push({
        id: 'abstract',
        title: data.Heading || query,
        snippet: data.AbstractText,
      })
    }

    // Extract Related Topics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.slice(0, 5).forEach((topic: any, idx: number) => {
        if (topic.Text) {
          results.push({
            id: `related-${idx}`,
            title: topic.Text.split(' - ')[0] || topic.Text,
            snippet: topic.Text,
          })
        }
      })
    }

    // Always return at least one result (fallback if no data found)
    if (results.length === 0) {
      // Check if query looks like a song/music query
      const looksLikeMusic = /^[^-]+ - [^-]+/.test(query) || 
                             query.toLowerCase().includes('song') ||
                             query.toLowerCase().includes('artist') ||
                             query.toLowerCase().includes('album')
      
      const fallbackMessage = looksLikeMusic
        ? `No instant answer for "${query}". Try using the Music Player module to search YouTube for this song, or search for the artist name instead.`
        : 'No instant answer available. Try a more specific query like "pizza recipe" or "best pizza in New York".'
      
      results.push({
        id: 'no-results',
        title: `Search: ${query}`,
        snippet: fallbackMessage,
      })
    }

    console.log('Returning results:', results)
    return results
  } catch (error) {
    console.error('Search error:', error)
    // Return fallback result instead of empty array so user sees something
    return [{
      id: 'error',
      title: `Search: ${query}`,
      snippet: 'Search service unavailable. Please try again later.',
    }]
  }
}

// Image Search API - Unsplash (requires API key)
export async function searchUnsplashImages(query: string): Promise<{
  id: string
  imageUrl: string
  label?: string
} | null> {
  if (!query.trim()) return null

  const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

  if (!apiKey) {
    console.warn('Unsplash API key not found. Set VITE_UNSPLASH_ACCESS_KEY in .env')
    return null
  }

  console.log('Unsplash API key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'missing')

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${apiKey}`
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Unsplash API error (${response.status}):`, errorText)
      throw new Error(`Image search failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const photo = data.results[0]
      return {
        id: photo.id,
        imageUrl: photo.urls.regular,
        label: query,
      }
    }

    console.warn('Unsplash search returned no results for:', query)
    return null
  } catch (error) {
    console.error('Image search error:', error)
    return null
  }
}

// Image Search API - Google Custom Search (requires API key and CSE ID)
export async function searchGoogleImages(query: string): Promise<{
  id: string
  imageUrl: string
  label?: string
} | null> {
  if (!query.trim()) return null

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const cseId = import.meta.env.VITE_GOOGLE_CSE_ID || import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID

  if (!apiKey) {
    console.warn('Google API key not found. Set VITE_GOOGLE_API_KEY or VITE_GOOGLE_MAPS_API_KEY in .env')
    return null
  }

  if (!cseId) {
    console.warn('Google Custom Search Engine ID not found. Set VITE_GOOGLE_CSE_ID or VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID in .env')
    return null
  }

  try {
    // Google Custom Search API for images
    const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${encodeURIComponent(query)}&searchType=image&num=1`
    
    console.log('Searching Google Images for:', query)
    console.log('API Key present:', !!apiKey)
    console.log('CSE ID present:', !!cseId)
    
    const response = await fetch(apiUrl)

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        // Not JSON, use text as is
      }
      
      const errorMsg = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`
      const errorCode = errorData?.error?.code || response.status
      
      console.error(`Google Images API HTTP error (${response.status}):`, errorText)
      
      // Throw error with helpful message for UI display
      if (errorCode === 403 && errorData?.error?.message?.includes('not been used') || errorData?.error?.message?.includes('disabled')) {
        throw new Error('Custom Search API is not enabled. Enable it in Google Cloud Console: https://console.developers.google.com/apis/api/customsearch.googleapis.com/overview')
      } else if (errorCode === 403) {
        throw new Error('API access denied. Check your API key permissions in Google Cloud Console.')
      } else if (errorCode === 400) {
        throw new Error('Invalid request. Check your CSE ID and make sure image search is enabled.')
      } else {
        throw new Error(errorMsg)
      }
    }

    const data = await response.json()

    // Check for API errors in the response (Google sometimes returns errors in JSON with 200 status)
    if (data.error) {
      const errorMsg = data.error.message || 'Unknown error'
      const errorCode = data.error.code || 'UNKNOWN'
      console.error(`Google Images API error (${errorCode}):`, errorMsg)
      
      if (errorCode === 403) {
        if (errorMsg.includes('not been used') || errorMsg.includes('disabled')) {
          throw new Error('Custom Search API is not enabled. Enable it in Google Cloud Console: https://console.developers.google.com/apis/api/customsearch.googleapis.com/overview')
        } else {
          throw new Error('API access denied. Check your API key permissions in Google Cloud Console.')
        }
      } else if (errorCode === 400) {
        throw new Error('Invalid request. Check your CSE ID and make sure image search is enabled.')
      } else {
        throw new Error(errorMsg)
      }
    }

    if (data.items && data.items.length > 0) {
      const item = data.items[0]
      // Google Custom Search API image results structure:
      // item.link = the image URL
      // item.image.link = also the image URL (sometimes)
      // item.image.thumbnailLink = thumbnail version
      const imageUrl = item.link || item.image?.link || item.image?.contextLink
      
      if (!imageUrl) {
        console.warn('Google Images result missing image URL. Item structure:', JSON.stringify(item, null, 2))
        return null
      }
      
      console.log('Found Google Image:', imageUrl)
      return {
        id: item.link || item.title || query,
        imageUrl: imageUrl,
        label: query,
      }
    }

    // Check if search returned zero results
    if (data.searchInformation?.totalResults === '0') {
      console.warn('Google Images search returned zero results for:', query)
    } else {
      console.warn('Google Images search returned no items for:', query, 'Response:', data)
    }
    
    return null
  } catch (error) {
    console.error('Google Images search error:', error)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('💡 Tip: This might be a CORS issue. Google Custom Search API should support CORS, but check your API key restrictions.')
      throw new Error('Network error. Check your connection and API key restrictions.')
    }
    // Re-throw errors that have helpful messages
    if (error instanceof Error && error.message) {
      throw error
    }
    throw new Error('Failed to search Google Images. Check console for details.')
  }
}

// Helper function to search images based on provider
export async function searchImages(
  query: string,
  provider: 'unsplash' | 'google' = 'unsplash'
): Promise<{
  id: string
  imageUrl: string
  label?: string
} | null> {
  if (provider === 'google') {
    return searchGoogleImages(query)
  }
  return searchUnsplashImages(query)
}

// YouTube Search API - YouTube Data API v3 (requires API key)
export async function searchYouTubeMusic(query: string): Promise<{
  videoId: string
  title: string
  channelTitle?: string
  thumbnailUrl?: string
} | null> {
  if (!query.trim()) return null

  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY

  if (!apiKey) {
    console.warn('YouTube API key not found. Set VITE_YOUTUBE_API_KEY in .env')
    return null
  }

  try {
    // For better results, construct search query based on format
    let searchQuery = query.trim()
    
    // If query contains "Artist - Song" format, use it directly with "official"
    if (searchQuery.includes(' - ')) {
      // For "Artist - Song" format, add "official" for better matching
      searchQuery = `${searchQuery} official`
    } else {
      // For single song title, add "official music video" for better results
      searchQuery = `${searchQuery} official music video`
    }
    
    // YouTube Data API v3 supports CORS, so we can call it directly
    // Use videoCategoryId=10 for Music category to get better music results
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&videoCategoryId=10&maxResults=1&key=${apiKey}`
    
    console.log('Searching YouTube for:', query, '(search query:', searchQuery, ')')
    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.error('YouTube search response not OK:', response.status, response.statusText)
      return null
    }

    const data = await response.json()

    if (data.items && data.items.length > 0) {
      const video = data.items[0]
      return {
        videoId: video.id.videoId,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        thumbnailUrl: video.snippet.thumbnails?.default?.url,
      }
    }

    return null
  } catch (error) {
    console.error('YouTube search error:', error)
    return null
  }
}

// Geocoding API - Google Maps Geocoding API (requires API key)
export async function geocodeLocation(query: string): Promise<{
  lat: number
  lng: number
  formattedAddress: string
} | null> {
  if (!query.trim()) return null

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.warn('Google Maps API key not found. Set VITE_GOOGLE_MAPS_API_KEY in .env')
    return null
  }

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`
    
    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.error('Geocoding response not OK:', response.status, response.statusText)
      return null
    }

    const data = await response.json()

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0]
      const location = result.geometry.location
      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: result.formatted_address,
      }
    }

    if (data.status === 'ZERO_RESULTS') {
      console.warn('No geocoding results for:', query)
      return null
    }

    // Handle specific error cases
    if (data.status === 'REQUEST_DENIED') {
      const errorMsg = data.error_message || 'API key restrictions may be blocking this request'
      console.error('Geocoding REQUEST_DENIED:', errorMsg)
      console.error('💡 Tip: Check your Google Cloud Console API key settings. Remove restrictions or add localhost to HTTP referrer restrictions.')
      return null
    }

    if (data.status === 'OVER_QUERY_LIMIT') {
      console.error('Geocoding OVER_QUERY_LIMIT: You have exceeded your daily quota')
      return null
    }

    if (data.status === 'INVALID_REQUEST') {
      console.error('Geocoding INVALID_REQUEST: The request is missing required parameters')
      return null
    }

    console.error('Geocoding error:', data.status, data.error_message || 'Unknown error')
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

// OpenAI Chat API - Chat Completions API (requires API key)
import type { ChatMessage } from '../types/modules'

export async function chatWithAI(messages: ChatMessage[]): Promise<ChatMessage> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    console.warn('OpenAI API key not found. Set VITE_OPENAI_API_KEY in .env')
    throw new Error('OpenAI API key not configured')
  }

  try {
    // Convert ChatMessage[] to OpenAI format
    const openAIMessages = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    }))

    // Add system message to guide AI behavior
    const systemMessage = {
      role: 'system' as const,
      content: 'You are Alex Oskie, a designer and good dude from New York. You have a dry, silly sense of humor and love exchanging music recommendations with friends. Keep your responses casual, witty, and a bit deadpan. When recommending songs, always include both the artist/band name and song title in the format "Artist - Song Title" or "Band Name - Song Title". For example: "The Beatles - Hey Jude" or "Queen - Bohemian Rhapsody". Be yourself - a bit sarcastic, funny, but genuinely helpful with music suggestions.',
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...openAIMessages],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMsg = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      console.error('OpenAI API error:', errorMsg)
      throw new Error(`OpenAI API error: ${errorMsg}`)
    }

    const data = await response.json()
    const aiText = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    // Detect song recommendations in AI response
    // Look for patterns like "Artist - Song", "Band - Song", etc.
    // Priority: Look for "Artist - Song" format first, then other patterns
    const songPatterns = [
      // "Artist - Song" format (most common)
      /["']?([^"'\n]+?)\s*-\s*([^"'\n]+?)["']?/,
      // "I recommend Artist - Song"
      /(?:recommend|suggest|check out|listen to|try|you should|you'll love)\s+["']?([^"'\n]+?)\s*-\s*([^"'\n]+?)["']?/i,
      // "Song by Artist"
      /["']?([^"'\n]+?)["']?\s+(?:by|from)\s+([^"'\n]+)/i,
      // Just a song title (fallback)
      /(?:recommend|suggest|check out|listen to|try)\s+["']?([^"'\n]+?)["']?/i,
    ]

    let nestedModule: { type: 'media', data: any } | undefined
    let searchQuery = ''

    for (const pattern of songPatterns) {
      const match = aiText.match(pattern)
      if (match) {
        let artist = ''
        let song = ''
        
        if (match[1] && match[2]) {
          // Has both artist and song
          artist = match[1].trim()
          song = match[2].trim()
          // Use "Artist - Song" format for better YouTube search results
          searchQuery = `${artist} - ${song}`
        } else if (match[1]) {
          // Just song title
          song = match[1].trim()
          searchQuery = song
        }
        
        if (searchQuery && searchQuery.length > 0) {
          console.log('Detected song recommendation:', searchQuery)
          
          // Search YouTube for the song with the full query
          const youtubeResult = await searchYouTubeMusic(searchQuery)
          
          if (youtubeResult) {
            console.log('Found YouTube video:', youtubeResult.title, 'by', youtubeResult.channelTitle)
            nestedModule = {
              type: 'media',
              data: {
                title: artist && song ? `${artist} - ${song}` : searchQuery,
                audioUrl: '',
                videoId: youtubeResult.videoId,
                channelTitle: youtubeResult.channelTitle,
                thumbnailUrl: youtubeResult.thumbnailUrl,
                isLoading: false,
              },
            }
          } else {
            console.warn('YouTube search failed for:', searchQuery)
            // Still create module even if YouTube search fails
            nestedModule = {
              type: 'media',
              data: {
                title: artist && song ? `${artist} - ${song}` : searchQuery,
                audioUrl: '',
                isLoading: false,
              },
            }
          }
          break
        }
      }
    }

    // Create AI message
    const aiMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'ai',
      text: aiText,
      timestamp: Date.now(),
      nestedModule,
    }

    return aiMessage
  } catch (error) {
    console.error('OpenAI chat error:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to chat with AI. Check console for details.')
  }
}

