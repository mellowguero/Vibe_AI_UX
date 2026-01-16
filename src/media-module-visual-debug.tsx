import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MediaModule } from './components/modules/MediaModule/MediaModule'
import type { MediaModuleData } from './types/modules'

// Pre-populated mock data for immediate visual rendering
const mockMediaModuleData: MediaModuleData = {
  title: 'Paul Simon - You Can Call Me Al',
  audioUrl: '',
  videoId: 'uq-gYOrU8bE', // Paul Simon - You Can Call Me Al (Official Video)
  channelTitle: 'Paul Simon',
  thumbnailUrl: 'https://i.ytimg.com/vi/uq-gYOrU8bE/maxresdefault.jpg',
  albumArtworkUrl: '/assets/media-preview/graceland_cover.jpg',
  isLoading: false,
}

function VisualDebugApp() {
  const [currentTime, setCurrentTime] = useState(0)
  const [showDimensions, setShowDimensions] = useState(true)
  const MAX_TIME = 9 * 60 // 9 minutes in seconds (540 seconds)

  // Timer that increments every second and resets at 9 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1
        // Reset to 0 when reaching 9 minutes
        return next >= MAX_TIME ? 0 : next
      })
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [MAX_TIME])

  // Listen for checkbox changes
  useEffect(() => {
    const checkbox = document.getElementById('toggle-dimensions') as HTMLInputElement
    if (checkbox) {
      const handleChange = () => {
        setShowDimensions(checkbox.checked)
      }
      checkbox.addEventListener('change', handleChange)
      return () => checkbox.removeEventListener('change', handleChange)
    }
  }, [])

  // No-op handler since we're just viewing the component
  const handleUpdate = (data: MediaModuleData) => {
    // Visual debug - updates are ignored
    console.log('MediaModule update:', data)
  }

  return (
    <MediaModule
      data={mockMediaModuleData}
      onUpdate={handleUpdate}
      variant="standalone"
      debugCurrentTime={currentTime}
      showDebugDimensions={showDimensions}
    />
  )
}

// Initialize React app
requestAnimationFrame(() => {
  const root = document.getElementById('media-module-root')
  if (root) {
    createRoot(root).render(
      <StrictMode>
        <VisualDebugApp />
      </StrictMode>
    )
  }
})
