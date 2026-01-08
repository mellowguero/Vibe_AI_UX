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

// Album Artwork API - ChatGPT + Google Images (fallback to iTunes)
// Uses ChatGPT to generate better search terms, then searches Google Images
export async function searchArtworkWithChatGPT(title: string): Promise<string | null> {
  if (!title.trim()) return null

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    console.warn('OpenAI API key not found. Cannot use ChatGPT for artwork search.')
    return null
  }

  try {
    // Use ChatGPT to generate a better search query for album artwork
    const systemMessage = {
      role: 'system' as const,
      content: 'You are a helpful assistant that generates search queries for finding album artwork. Given a song title (which may be in "Artist - Song" format), generate a concise search query optimized for finding the album cover art. Return ONLY the search query, nothing else. Examples: "The Beatles - Hey Jude" -> "Beatles Hey Jude album cover", "Graceland Paul Simon" -> "Paul Simon Graceland album cover".',
    }

    const userMessage = {
      role: 'user' as const,
      content: `Generate a search query for finding album artwork for: ${title}`,
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, userMessage],
        temperature: 0.3, // Lower temperature for more consistent results
        max_tokens: 50, // Short response
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMsg = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
      console.warn('ChatGPT API error for artwork search:', errorMsg)
      return null
    }

    const data = await response.json()
    const searchQuery = data.choices[0]?.message?.content?.trim() || title

    console.log('ChatGPT generated search query for artwork:', searchQuery)

    // Now search Google Images with the generated query
    const imageResult = await searchGoogleImages(searchQuery)
    
    if (imageResult && imageResult.imageUrl) {
      console.log('Found artwork via ChatGPT + Google Images:', imageResult.imageUrl)
      return imageResult.imageUrl
    }

    return null
  } catch (error) {
    console.error('ChatGPT artwork search error:', error)
    return null
  }
}

// Album Artwork API - iTunes Search API (free, no API key required)
// Primary search method, falls back to ChatGPT + Google Images if iTunes fails
export async function searchAlbumArtwork(query: string, fallbackThumbnailUrl?: string): Promise<string | null> {
  if (!query.trim()) {
    return fallbackThumbnailUrl || null
  }

  try {
    // Extract artist and song from query if in "Artist - Song" format
    let searchQuery = query.trim()
    
    // iTunes Search API - search for songs
    const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=1`
    
    console.log('Searching iTunes for album artwork:', searchQuery)
    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.warn('iTunes search response not OK:', response.status, response.statusText)
      // Fallback to ChatGPT + Google Images
      const chatGPTResult = await searchArtworkWithChatGPT(searchQuery)
      return chatGPTResult || fallbackThumbnailUrl || null
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const song = data.results[0]
      // iTunes returns artworkUrl100, artworkUrl60, etc. Use the larger one
      const artworkUrl = song.artworkUrl100 || song.artworkUrl60 || song.artworkUrl30
      
      if (artworkUrl) {
        console.log('Found album artwork:', artworkUrl)
        return artworkUrl
      }
    }

    console.warn('No album artwork found in iTunes results for:', searchQuery)
    // Fallback to ChatGPT + Google Images
    const chatGPTResult = await searchArtworkWithChatGPT(searchQuery)
    return chatGPTResult || fallbackThumbnailUrl || null
  } catch (error) {
    console.error('iTunes search error:', error)
    // Fallback to ChatGPT + Google Images
    const chatGPTResult = await searchArtworkWithChatGPT(query.trim())
    return chatGPTResult || fallbackThumbnailUrl || null
  }
}

// YouTube Search API - YouTube Data API v3 (requires API key)
export async function searchYouTubeMusic(query: string, excludeVideoId?: string, maxResults: number = 1): Promise<{
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
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&videoCategoryId=10&maxResults=${maxResults}&key=${apiKey}`
    
    console.log('Searching YouTube for:', query, '(search query:', searchQuery, ')')
    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.error('YouTube search response not OK:', response.status, response.statusText)
      return null
    }

    const data = await response.json()

    if (data.items && data.items.length > 0) {
      // Filter out the excluded video ID if provided
      const videos = excludeVideoId 
        ? data.items.filter((item: any) => item.id.videoId !== excludeVideoId)
        : data.items
      
      if (videos.length === 0) {
        return null
      }
      
      // If we need multiple results, return the first one (caller can handle multiple)
      const video = videos[0]
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

// Search iTunes for songs by artist (free, no API key needed)
async function searchSongsByArtistOniTunes(artistName: string, excludeTitle?: string): Promise<{
  title: string
  artistName: string
  artworkUrl?: string
} | null> {
  if (!artistName) return null

  try {
    // Clean up artist name
    const cleanArtist = artistName.replace(/\s*(VEVO|Official|Music|Channel)$/i, '').trim()
    
    // iTunes Search API - search for songs by artist
    const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(cleanArtist)}&entity=song&limit=20`
    
    console.log('Searching iTunes for songs by:', cleanArtist)
    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.warn('iTunes search response not OK:', response.status, response.statusText)
      return null
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      // Filter out the current song if title provided
      const songs = excludeTitle
        ? data.results.filter((song: any) => 
            !song.trackName?.toLowerCase().includes(excludeTitle.toLowerCase()) &&
            !excludeTitle.toLowerCase().includes(song.trackName?.toLowerCase() || '')
          )
        : data.results
      
      if (songs.length === 0) {
        return null
      }
      
      // Pick a random song from the results
      const randomIndex = Math.floor(Math.random() * songs.length)
      const song = songs[randomIndex]
      
      return {
        title: `${song.artistName} - ${song.trackName}`,
        artistName: song.artistName,
        artworkUrl: song.artworkUrl100 || song.artworkUrl60,
      }
    }

    return null
  } catch (error) {
    console.error('iTunes search error:', error)
    return null
  }
}

// Search for other songs by the same artist/channel
export async function searchOtherSongsByArtist(
  artistName: string,
  channelTitle: string | undefined,
  excludeVideoId: string
): Promise<{
  videoId: string
  title: string
  channelTitle?: string
  thumbnailUrl?: string
} | null> {
  if (!artistName && !channelTitle) {
    return null
  }

  // Extract just the artist name (remove "VEVO" or channel suffixes)
  let searchQuery = artistName || channelTitle || ''
  
  if (!searchQuery) {
    console.warn('No artist name or channel title provided for search')
    return null
  }
  
  // Clean up the search query - remove common channel suffixes
  searchQuery = searchQuery.replace(/\s*(VEVO|Official|Music|Channel)$/i, '').trim()
  
  console.log('searchOtherSongsByArtist called with:', { artistName, channelTitle, searchQuery, excludeVideoId })
  
  // First, try iTunes API (free, no quota issues)
  // Extract current song title if we have it in the artistName (format: "Artist - Song")
  let currentTitle: string | undefined = undefined
  if (artistName && artistName.includes(' - ')) {
    const parts = artistName.split(' - ')
    if (parts.length >= 2) {
      currentTitle = parts[1].trim()
    }
  }
  
  console.log('Trying iTunes search first for artist:', searchQuery)
  const iTunesResult = await searchSongsByArtistOniTunes(searchQuery, currentTitle)
  
  if (iTunesResult) {
    console.log('iTunes found song:', iTunesResult.title)
    // Now search YouTube for the song we found on iTunes
    try {
      const youtubeResult = await searchYouTubeMusic(iTunesResult.title, excludeVideoId, 1)
      
      if (youtubeResult) {
        console.log('Found song via iTunes + YouTube:', youtubeResult.title)
        return {
          ...youtubeResult,
          thumbnailUrl: youtubeResult.thumbnailUrl || iTunesResult.artworkUrl,
        }
      } else {
        console.warn('iTunes found song but YouTube search failed (may be quota issue). Song:', iTunesResult.title)
        // Even if YouTube search fails, we can return the iTunes result
        // The MediaModule will try to search YouTube when it receives the title
        return {
          videoId: undefined, // Will be filled by MediaModule's YouTube search
          title: iTunesResult.title,
          channelTitle: iTunesResult.artistName,
          thumbnailUrl: iTunesResult.artworkUrl,
        }
      }
    } catch (error) {
      console.warn('YouTube search error after iTunes success:', error)
      // Return iTunes result anyway - MediaModule will handle YouTube search
      return {
        videoId: undefined, // Will be filled by MediaModule's YouTube search
        title: iTunesResult.title,
        channelTitle: iTunesResult.artistName,
        thumbnailUrl: iTunesResult.artworkUrl,
      }
    }
  } else {
    console.log('iTunes search returned no results, trying YouTube fallback')
  }
  
  // Fallback: Try YouTube API directly (may hit quota)
  const searchQueries = [
    `${searchQuery} music`, // Artist + music
    `${searchQuery} songs`, // Artist + songs
    searchQuery, // Just artist name
  ]
  
  // Try each search query until we find results
  for (const query of searchQueries) {
    try {
      const result = await searchYouTubeMusicByArtist(query, excludeVideoId)
      
      if (result) {
        return result
      }
    } catch (error) {
      console.warn(`Search query "${query}" failed:`, error)
      // Continue to next query
    }
  }
  
  return null
}

// Helper function to search YouTube with multiple results
async function searchYouTubeMusicByArtist(
  query: string,
  excludeVideoId: string
): Promise<{
  videoId: string
  title: string
  channelTitle?: string
  thumbnailUrl?: string
} | null> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY

  if (!apiKey) {
    return null
  }

  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=10&key=${apiKey}`
    
    const response = await fetch(apiUrl)

    if (!response.ok) {
      // If 403, log but don't throw - let caller try other queries
      if (response.status === 403) {
        console.warn('YouTube API 403 for query:', query, '- may be quota/restriction issue')
      }
      return null
    }

    const data = await response.json()

    if (data.items && data.items.length > 0) {
      // Filter out the excluded video ID
      const videos = data.items.filter((item: any) => item.id.videoId !== excludeVideoId)
      
      if (videos.length === 0) {
        return null
      }
      
      // Pick a random video from the results
      const randomIndex = Math.floor(Math.random() * videos.length)
      const video = videos[randomIndex]
      
      return {
        videoId: video.id.videoId,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        thumbnailUrl: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url,
      }
    }

    return null
  } catch (error) {
    console.error('Error in searchYouTubeMusicByArtist:', error)
    return null
  }
}

// YouTube Video Metadata API - Fetch video details by video ID
export async function getYouTubeVideoMetadata(videoId: string): Promise<{
  videoId: string
  title: string
  channelTitle?: string
  thumbnailUrl?: string
} | null> {
  if (!videoId.trim()) return null

  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY

  if (!apiKey) {
    console.warn('YouTube API key not found. Set VITE_YOUTUBE_API_KEY in .env')
    return null
  }

  try {
    // YouTube Data API v3 - videos endpoint to get metadata by ID
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(videoId)}&key=${apiKey}`
    
    console.log('Fetching YouTube video metadata for:', videoId)
    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.error('YouTube video metadata response not OK:', response.status, response.statusText)
      return null
    }

    const data = await response.json()

    if (data.items && data.items.length > 0) {
      const video = data.items[0]
      return {
        videoId: video.id,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        thumbnailUrl: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url,
      }
    }

    return null
  } catch (error) {
    console.error('YouTube video metadata error:', error)
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
