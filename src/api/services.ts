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

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('Image search failed')
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

    return null
  } catch (error) {
    console.error('Image search error:', error)
    return null
  }
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
    // Search for music videos - add "music" to query for better results
    const searchQuery = `${query} music`
    // YouTube Data API v3 supports CORS, so we can call it directly
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=1&key=${apiKey}`
    
    console.log('Searching YouTube for:', query)
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

