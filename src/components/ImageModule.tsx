import { useEffect, useRef } from 'react'
import type { ImageModuleData } from '../types/modules'
import { searchUnsplashImages } from '../api/services'

interface ImageModuleProps {
  data: ImageModuleData
  onUpdate: (data: ImageModuleData) => void
}

export function ImageModule({ data, onUpdate }: ImageModuleProps) {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const searchQuery = data.searchQuery || ''
    const imageUrl = data.imageUrl || ''
    const currentData = { ...data }

    // Don't search if:
    // - Search query is empty
    // - User has manually set an imageUrl (they want to use their own URL)
    if (!searchQuery.trim() || imageUrl.trim()) {
      return
    }

    // Set loading state
    onUpdate({
      ...currentData,
      isLoading: true,
    })

    // Debounce Unsplash search
    debounceTimerRef.current = setTimeout(async () => {
      // Double-check imageUrl wasn't set while we were waiting
      const latestData = { ...data }
      if (latestData.imageUrl && latestData.imageUrl.trim()) {
        onUpdate({
          ...latestData,
          isLoading: false,
        })
        return
      }

      const result = await searchUnsplashImages(searchQuery)
      if (result) {
        onUpdate({
          ...latestData,
          imageUrl: result.imageUrl,
          label: result.label || searchQuery,
          isLoading: false,
        })
      } else {
        onUpdate({
          ...latestData,
          isLoading: false,
        })
      }
    }, 800) // 800ms debounce for Unsplash search

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.searchQuery, data.imageUrl])

  return (
    <div className="image-module">
      <input
        type="text"
        placeholder="Search for image (e.g. mountain, sunset, cat)"
        value={data.searchQuery || ''}
        onChange={(e) => {
          const newSearchQuery = e.target.value
          // Clear imageUrl when user starts typing a new search
          onUpdate({ 
            ...data, 
            searchQuery: newSearchQuery,
            imageUrl: newSearchQuery.trim() ? '' : data.imageUrl, // Clear URL if searching
            isLoading: newSearchQuery.trim() ? true : false,
          })
        }}
        className="module-input"
      />
      <input
        type="text"
        placeholder="Or enter Image URL manually"
        value={data.imageUrl}
        onChange={(e) => {
          const newImageUrl = e.target.value
          // Clear search query when user manually enters URL
          onUpdate({ 
            ...data, 
            imageUrl: newImageUrl,
            searchQuery: newImageUrl.trim() ? '' : data.searchQuery, // Clear search if URL entered
          })
        }}
        className="module-input"
      />
      <input
        type="text"
        placeholder="Label (optional)"
        value={data.label || ''}
        onChange={(e) => onUpdate({ ...data, label: e.target.value })}
        className="module-input"
      />
      {data.isLoading && (
        <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
          Searching for image...
        </div>
      )}
      {data.imageUrl && !data.isLoading && (
        <img src={data.imageUrl} alt={data.label || 'Image'} className="image-preview" />
      )}
    </div>
  )
}
