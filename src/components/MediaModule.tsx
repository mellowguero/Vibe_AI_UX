import { useEffect, useRef } from 'react'
import type { MediaModuleData } from '../types/modules'
import { searchYouTubeMusic } from '../api/services'

interface MediaModuleProps {
  data: MediaModuleData
  onUpdate: (data: MediaModuleData) => void
}

export function MediaModule({ data, onUpdate }: MediaModuleProps) {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const title = data.title || ''
    const audioUrl = data.audioUrl || ''
    const currentData = { ...data }

    // Don't search YouTube if:
    // - Title is empty
    // - User has manually set an audioUrl (they want to use their own URL)
    // - audioUrl is not empty (user is pasting their own URL)
    if (!title.trim() || audioUrl.trim()) {
      // If user has a URL, clear any YouTube video
      if (audioUrl.trim() && data.videoId) {
        onUpdate({
          ...currentData,
          videoId: undefined,
          channelTitle: undefined,
          thumbnailUrl: undefined,
        })
      }
      return
    }

    // Set loading state
    onUpdate({
      ...currentData,
      isLoading: true,
    })

    // Debounce YouTube search
    debounceTimerRef.current = setTimeout(async () => {
      // Double-check audioUrl wasn't set while we were waiting
      const latestData = { ...data }
      if (latestData.audioUrl && latestData.audioUrl.trim()) {
        onUpdate({
          ...latestData,
          isLoading: false,
        })
        return
      }

      const result = await searchYouTubeMusic(title)
      if (result) {
        onUpdate({
          ...latestData,
          videoId: result.videoId,
          channelTitle: result.channelTitle,
          thumbnailUrl: result.thumbnailUrl,
          isLoading: false,
        })
      } else {
        onUpdate({
          ...latestData,
          isLoading: false,
        })
      }
    }, 800) // 800ms debounce for YouTube search

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.title, data.audioUrl])

  return (
    <div className="media-module">
      <input
        type="text"
        placeholder="Song title (auto-searches YouTube if no URL below)"
        value={data.title}
        onChange={(e) => {
          // Only trigger search if audioUrl is empty
          if (!data.audioUrl || !data.audioUrl.trim()) {
            onUpdate({ ...data, title: e.target.value, isLoading: true })
          } else {
            // If URL is set, just update title without searching
            onUpdate({ ...data, title: e.target.value })
          }
        }}
        className="module-input"
      />
      
      {data.isLoading && (
        <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
          Searching YouTube...
        </div>
      )}

      {data.videoId ? (
        <div style={{ marginTop: '0.5rem' }}>
          {data.channelTitle && (
            <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
              {data.channelTitle}
            </div>
          )}
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${data.videoId}?enablejsapi=1&origin=${window.location.origin}`}
            title={data.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ borderRadius: '4px' }}
            loading="lazy"
          />
          <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.25rem' }}>
            <a 
              href={`https://www.youtube.com/watch?v=${data.videoId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#666', textDecoration: 'none' }}
            >
              Open in YouTube ↗
            </a>
          </div>
        </div>
      ) : data.audioUrl ? (
        <div style={{ marginTop: '0.5rem' }}>
          <input
            type="text"
            placeholder="Audio URL (manual)"
            value={data.audioUrl}
            onChange={(e) => {
              const url = e.target.value
              
              // Check if it's a YouTube URL and extract video ID
              const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
              const match = url.match(youtubeRegex)
              
              if (match && match[1]) {
                // It's a YouTube URL - extract video ID and use embed
                const videoId = match[1]
                onUpdate({ 
                  ...data, 
                  audioUrl: '', // Clear audio URL
                  videoId: videoId, // Use YouTube embed instead
                })
              } else {
                // Regular audio URL
                onUpdate({ ...data, audioUrl: url })
              }
            }}
            className="module-input"
            style={{ marginBottom: '0.5rem' }}
          />
          <audio
            src={data.audioUrl}
            controls
            style={{ width: '100%' }}
            onError={(e) => {
              console.error('Audio playback error:', e)
              const audioEl = e.target as HTMLAudioElement
              console.error('Audio error details:', {
                error: audioEl.error,
                networkState: audioEl.networkState,
                readyState: audioEl.readyState,
                src: audioEl.src
              })
            }}
            onLoadStart={() => console.log('Audio loading...', data.audioUrl)}
            onCanPlay={() => console.log('Audio ready to play')}
          />
          <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.25rem' }}>
            {data.audioUrl.startsWith('http') 
              ? 'Note: Direct audio URLs may be blocked by CORS. Try a YouTube URL instead.' 
              : 'Enter a valid audio URL (or YouTube URL)'}
          </div>
        </div>
      ) : (
        <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
          Enter a song title to search YouTube, or add a manual audio URL below.
        </div>
      )}

      {!data.videoId && (
        <input
          type="text"
          placeholder="Or enter Audio URL manually (disables YouTube search)"
          value={data.audioUrl || ''}
          onChange={(e) => {
            const url = e.target.value
            
            // Check if it's a YouTube URL and extract video ID
            const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
            const match = url.match(youtubeRegex)
            
            if (match && match[1]) {
              // It's a YouTube URL - extract video ID and use embed
              const videoId = match[1]
              onUpdate({ 
                ...data, 
                audioUrl: '', // Clear audio URL
                videoId: videoId, // Use YouTube embed instead
              })
            } else {
              // Regular audio URL
              onUpdate({ 
                ...data, 
                audioUrl: url,
                videoId: undefined, // Clear YouTube video if user wants manual URL
              })
            }
          }}
          className="module-input"
          style={{ marginTop: '0.5rem' }}
        />
      )}
    </div>
  )
}
