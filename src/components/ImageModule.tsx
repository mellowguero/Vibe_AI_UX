import { useEffect, useRef } from 'react'
import type { ImageModuleData } from '../types/modules'
import { searchImages } from '../api/services'

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

    // Debounce image search
    const provider = data.imageProvider || 'unsplash'
    
    // Check for required API keys before searching
    if (provider === 'google') {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      const cseId = import.meta.env.VITE_GOOGLE_CSE_ID || import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID
      
      if (!apiKey || !cseId) {
        onUpdate({
          ...currentData,
          isLoading: false,
          error: !apiKey && !cseId 
            ? 'Missing VITE_GOOGLE_API_KEY and VITE_GOOGLE_CSE_ID (or VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID) in .env'
            : !apiKey 
            ? 'Missing VITE_GOOGLE_API_KEY in .env'
            : 'Missing VITE_GOOGLE_CSE_ID (or VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID) in .env',
        })
        return
      }
    } else if (provider === 'unsplash') {
      const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
      if (!apiKey) {
        onUpdate({
          ...currentData,
          isLoading: false,
          error: 'Missing VITE_UNSPLASH_ACCESS_KEY in .env',
        })
        return
      }
    }
    
    // Set loading state and clear any previous errors
    onUpdate({
      ...currentData,
      isLoading: true,
      error: undefined,
    })
    
    debounceTimerRef.current = setTimeout(async () => {
      // Double-check imageUrl wasn't set while we were waiting
      const latestData = { ...data }
      if (latestData.imageUrl && latestData.imageUrl.trim()) {
        onUpdate({
          ...latestData,
          isLoading: false,
          error: undefined,
        })
        return
      }

      try {
        const result = await searchImages(searchQuery, provider)
        if (result) {
          onUpdate({
            ...latestData,
            imageUrl: result.imageUrl,
            label: result.label || searchQuery,
            isLoading: false,
            error: undefined,
          })
        } else {
          // Check again for API keys to provide helpful error message
          let errorMsg: string | undefined
          if (provider === 'google') {
            const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY
            const cseId = import.meta.env.VITE_GOOGLE_CSE_ID || import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID
            if (!apiKey || !cseId) {
              errorMsg = !apiKey && !cseId 
                ? 'Missing VITE_GOOGLE_API_KEY and VITE_GOOGLE_CSE_ID (or VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID) in .env'
                : !apiKey 
                ? 'Missing VITE_GOOGLE_API_KEY in .env'
                : 'Missing VITE_GOOGLE_CSE_ID (or VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID) in .env'
            } else {
              errorMsg = 'No images found. Check console for details.'
            }
          } else {
            const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
            if (!apiKey) {
              errorMsg = 'Missing VITE_UNSPLASH_ACCESS_KEY in .env'
            } else {
              errorMsg = 'No images found. Check console for details.'
            }
          }
          
          onUpdate({
            ...latestData,
            isLoading: false,
            error: errorMsg,
          })
        }
      } catch (error) {
        // Catch and display API errors (like API not enabled)
        const errorMsg = error instanceof Error ? error.message : 'Failed to search images. Check console for details.'
        onUpdate({
          ...latestData,
          isLoading: false,
          error: errorMsg,
        })
      }
    }, 800) // 800ms debounce for image search

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.searchQuery, data.imageUrl, data.imageProvider])

  const provider = data.imageProvider || 'unsplash'

  return (
    <div className="image-module">
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label style={{ fontSize: '0.75rem', color: '#666' }}>Provider:</label>
        <button
          type="button"
          onClick={() => onUpdate({ ...data, imageProvider: 'unsplash', error: undefined })}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: provider === 'unsplash' ? '#007bff' : '#fff',
            color: provider === 'unsplash' ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          Unsplash
        </button>
        <button
          type="button"
          onClick={() => onUpdate({ ...data, imageProvider: 'google', error: undefined })}
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: provider === 'google' ? '#007bff' : '#fff',
            color: provider === 'google' ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          Google
        </button>
      </div>
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
            error: undefined, // Clear error when user types
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
          Searching {provider === 'google' ? 'Google Images' : 'Unsplash'}...
        </div>
      )}
      {data.error && !data.isLoading && (
        <div style={{ 
          padding: '0.5rem', 
          fontSize: '0.75rem', 
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginTop: '0.5rem',
        }}>
          ⚠️ {data.error}
        </div>
      )}
      {data.imageUrl && !data.isLoading && (
        <img src={data.imageUrl} alt={data.label || 'Image'} className="image-preview" />
      )}
    </div>
  )
}
