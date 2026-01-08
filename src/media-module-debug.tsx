import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MediaModule } from './components/modules/MediaModule/MediaModule'
import type { MediaModuleData } from './types/modules'
import { useState, useEffect } from 'react'
import { getYouTubeVideoMetadata } from './api/services'

// Parse input to determine type and extract data
function parseInput(input: string): Partial<MediaModuleData> {
  const trimmed = input.trim()
  if (!trimmed) {
    return { title: '', audioUrl: '', videoId: undefined }
  }

  // Check if it's a YouTube URL
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  const youtubeMatch = trimmed.match(youtubeRegex)
  if (youtubeMatch && youtubeMatch[1]) {
    return {
      title: '',
      audioUrl: '',
      videoId: youtubeMatch[1],
    }
  }

  // Check if it's a URL (http/https)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    // It's an audio URL
    return {
      title: '',
      audioUrl: trimmed,
      videoId: undefined,
    }
  }

  // Otherwise, treat as song title
  return {
    title: trimmed,
    audioUrl: '',
    videoId: undefined,
  }
}

function DebugApp() {
  const [moduleData, setModuleData] = useState<MediaModuleData>({
    title: '',
    audioUrl: '',
    videoId: undefined,
    channelTitle: undefined,
    thumbnailUrl: undefined,
    albumArtworkUrl: undefined,
    isLoading: false,
  })

  // Handle test input changes
  useEffect(() => {
    const input = document.getElementById('url-input') as HTMLInputElement
    if (!input) return

    const handleInput = async () => {
      const value = input.value
      const parsed = parseInput(value)
      
      // If it's a YouTube URL, set videoId immediately but allow React to render first
      if (parsed.videoId) {
        // Set videoId after a small delay to ensure React has rendered the container
        requestAnimationFrame(() => {
          setModuleData((prev) => ({
            ...prev,
            ...parsed,
            isLoading: false,
          }))
        })
        
        // Fetch metadata in background (non-blocking)
        getYouTubeVideoMetadata(parsed.videoId).then((metadata) => {
          if (metadata) {
            setModuleData((prev) => ({
              ...prev,
              title: metadata.title,
              videoId: metadata.videoId,
              channelTitle: metadata.channelTitle,
              thumbnailUrl: metadata.thumbnailUrl,
              // Clear albumArtworkUrl to trigger a new search with the new title
              albumArtworkUrl: undefined,
            }))
          }
        }).catch((error) => {
          console.error('Error fetching YouTube metadata:', error)
        })
      } else if (parsed.title) {
        // If it's a song title, let MediaModule handle the search
        setModuleData((prev) => ({
          ...prev,
          ...parsed,
          isLoading: false,
        }))
      } else {
        // Audio URL or empty
        setModuleData((prev) => ({
          ...prev,
          ...parsed,
          // Clear related fields when input changes
          channelTitle: undefined,
          thumbnailUrl: undefined,
          albumArtworkUrl: parsed.audioUrl ? prev.albumArtworkUrl : undefined,
          isLoading: false,
        }))
      }
    }

    // Debounce input
    let timeoutId: ReturnType<typeof setTimeout>
    const debouncedHandleInput = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleInput, 300)
    }

    input.addEventListener('input', debouncedHandleInput)
    input.addEventListener('paste', () => {
      // Handle paste immediately
      setTimeout(handleInput, 100)
    })

    return () => {
      input.removeEventListener('input', debouncedHandleInput)
      clearTimeout(timeoutId)
    }
  }, [])

  const handleUpdate = (data: MediaModuleData) => {
    setModuleData(data)
  }

  return (
    <MediaModule
      data={moduleData}
      onUpdate={handleUpdate}
      variant="standalone"
    />
  )
}

// Initialize React app
requestAnimationFrame(() => {
  const root = document.getElementById('media-module-root')
  if (root) {
    createRoot(root).render(
      <StrictMode>
        <DebugApp />
      </StrictMode>
    )
  }
})
