import { useEffect, useState, useRef } from 'react'

export interface SongTitleProps {
  title: string
  currentTime?: number
  variant?: 'master' | 'chat' | 'collapsed'
  isActive?: boolean
  playerRef?: React.RefObject<HTMLIFrameElement | HTMLAudioElement>
  className?: string
}

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string, config: any) => {
        getCurrentTime: () => number
        getPlayerState: () => number
      }
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

export function SongTitle({
  title,
  currentTime: propCurrentTime,
  variant = 'master',
  isActive = false,
  playerRef,
  className = '',
}: SongTitleProps) {
  const [currentTime, setCurrentTime] = useState<number>(propCurrentTime ?? 0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const youtubePlayerRef = useRef<any>(null)

  // Parse artist and song from title
  const parseTitle = (titleStr: string): { artist: string; song: string } => {
    const match = titleStr.match(/(.+?)\s*-\s*(.+)/)
    if (match && match[1] && match[2]) {
      return {
        artist: match[1].trim(),
        song: match[2].trim(),
      }
    }
    return {
      artist: '',
      song: titleStr,
    }
  }

  const { artist, song } = parseTitle(title)

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Time tracking logic
  useEffect(() => {
    // Priority 1: Use prop if provided
    if (propCurrentTime !== undefined) {
      setCurrentTime(propCurrentTime)
      return
    }

    // Priority 2: Built-in tracking
    if (!playerRef?.current) {
      setCurrentTime(0)
      return
    }

    const player = playerRef.current

    // Check if it's an audio element
    if (player instanceof HTMLAudioElement) {
      const updateTime = () => {
        setCurrentTime(player.currentTime)
      }

      player.addEventListener('timeupdate', updateTime)
      updateTime() // Initial update

      return () => {
        player.removeEventListener('timeupdate', updateTime)
      }
    }

    // Check if it's a YouTube iframe
    if (player instanceof HTMLIFrameElement) {
      const iframeId = player.id || `youtube-player-${Date.now()}`
      if (!player.id) {
        player.id = iframeId
      }

      // Load YouTube IFrame API if not already loaded
      const loadYouTubeAPI = (): Promise<void> => {
        return new Promise((resolve) => {
          if (window.YT && window.YT.Player) {
            resolve()
            return
          }

          if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            // Script is loading, wait for it
            const checkReady = setInterval(() => {
              if (window.YT && window.YT.Player) {
                clearInterval(checkReady)
                resolve()
              }
            }, 100)
            return
          }

          // Create script tag
          const script = document.createElement('script')
          script.src = 'https://www.youtube.com/iframe_api'
          script.async = true
          document.head.appendChild(script)

          // Wait for API to be ready
          const originalCallback = window.onYouTubeIframeAPIReady
          window.onYouTubeIframeAPIReady = () => {
            if (originalCallback) originalCallback()
            resolve()
          }
        })
      }

      // Initialize YouTube player and track time
      loadYouTubeAPI().then(() => {
        try {
          // Try to get player instance from iframe
          // Note: YouTube API requires the iframe to have a specific structure
          // We'll poll the iframe's contentWindow for the player
          const pollTime = () => {
            try {
              // Access YouTube player through iframe's contentWindow
              // This is a workaround since we can't directly access the player instance
              // without the iframe having the proper YouTube embed URL structure
              const iframeSrc = player.src || player.getAttribute('src') || ''
              
              if (iframeSrc.includes('youtube.com/embed') || iframeSrc.includes('youtube.com/v')) {
                // If we have a YouTube embed, we can try to use postMessage API
                // For now, we'll use a simpler approach: poll via postMessage
                // This requires the iframe to have enablejsapi=1 in the URL
                
                // Alternative: Use YouTube IFrame API properly
                // We need to create a player instance, but we can't do that without
                // knowing the video ID. For now, we'll set up a polling mechanism
                // that the parent component can use to pass time updates
                
                // Since direct access is limited, we'll rely on the parent to pass
                // currentTime via props when using YouTube
                setCurrentTime(0)
              } else {
                setCurrentTime(0)
              }
            } catch (error) {
              console.warn('Error accessing YouTube player:', error)
              setCurrentTime(0)
            }
          }

          // Poll every 100ms
          intervalRef.current = setInterval(pollTime, 100)

          return () => {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
          }
        } catch (error) {
          console.warn('Error initializing YouTube player tracking:', error)
          setCurrentTime(0)
        }
      })

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }

    // Fallback: no time tracking
    setCurrentTime(0)
  }, [propCurrentTime, playerRef])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  // Build class names
  const baseClass = 'song-title'
  const variantClass = `song-title--${variant}`
  const activeClass = isActive ? 'song-title--active' : ''
  const classes = [baseClass, variantClass, activeClass, className]
    .filter(Boolean)
    .join(' ')

  // Render based on variant
  if (variant === 'master') {
    return (
      <div className={classes}>
        <div className="song-title-title-container">
          <span className="song-title-title">{song}</span>
          {artist && (
            <>
              <span className="song-title-separator"> - </span>
              <span className="song-title-artist">{artist}</span>
            </>
          )}
        </div>
        <div className="song-title-time-container">
          <span className="song-title-separator">|</span>
          <span className="song-title-time">{formatTime(currentTime)}</span>
        </div>
      </div>
    )
  }

  // Chat and Collapsed variants (stacked layout)
  return (
    <div className={classes}>
      <div className="song-title-titles">
        <div className="song-title-title">{song}</div>
        {artist && <div className="song-title-artist">{artist}</div>}
      </div>
      {variant === 'chat' && (
        <div className="song-title-time">
          {formatTime(currentTime)}
        </div>
      )}
    </div>
  )
}

