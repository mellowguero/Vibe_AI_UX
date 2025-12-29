import { useEffect, useRef, useState } from 'react'
import type { MediaModuleData } from '../../../types/modules'
import { searchYouTubeMusic, searchAlbumArtwork } from '../../../api/services'
import { MediaPreviewWindow } from './MediaPreviewWindow'
import { extractDominantColor, rgbToRgba } from '../../../utils/colorExtraction'
import { AudioProgressBar } from './AudioProgressBar'
import { SongTitle } from '../../shared/SongTitle'
import { MediaControls } from './MediaControls'
import { PlayButton } from './PlayButton'

interface MediaModuleProps {
  data: MediaModuleData
  onUpdate: (data: MediaModuleData) => void
  variant?: 'chat' | 'standalone'
}

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT?: {
      Player: new (elementId: string, config: {
        videoId: string
        events?: {
          onReady?: (event: { target: any }) => void
          onStateChange?: (event: { data: number; target: any }) => void
        }
        playerVars?: {
          enablejsapi?: number
          origin?: string
        }
      }) => {
        playVideo: () => void
        pauseVideo: () => void
        seekTo: (seconds: number, allowSeekAhead?: boolean) => void
        getCurrentTime: () => number
        getDuration: () => number
        getPlayerState: () => number
        destroy: () => void
      }
      PlayerState: {
        ENDED: number
        PLAYING: number
        PAUSED: number
        BUFFERING: number
        CUED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

export function MediaModule({ data, onUpdate, variant = 'standalone' }: MediaModuleProps) {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const albumArtworkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const colorExtractionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const youtubeTimeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  
  // Store extracted color for future use (e.g., timebar)
  const [extractedColor, setExtractedColor] = useState<string | null>(null)
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  // Refs
  const moduleRef = useRef<HTMLDivElement | null>(null)
  const youtubePlayerRef = useRef<any>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const youtubePlayerContainerRef = useRef<HTMLDivElement | null>(null)

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
    // - videoId already exists (module was extracted from chat or already has a video)
    if (!title.trim() || audioUrl.trim() || data.videoId) {
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

      // Check if videoId was set while we were waiting (e.g., from chat extraction)
      if (latestData.videoId) {
        onUpdate({
          ...latestData,
          isLoading: false,
        })
        return
      }

      const result = await searchYouTubeMusic(title)
      if (result) {
        // Only update title if it's different and we don't already have a videoId
        // This preserves the original "Artist - Song" format from chat
        const newTitle = latestData.videoId ? latestData.title : result.title
        onUpdate({
          ...latestData,
          title: newTitle,
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
  }, [data.title, data.audioUrl, data.videoId])

  // Fetch album artwork when video is found or title changes
  useEffect(() => {
    // Clear previous timer
    if (albumArtworkTimerRef.current) {
      clearTimeout(albumArtworkTimerRef.current)
    }

    const title = data.title || ''
    
    // Don't search for album artwork if:
    // - Title is empty
    // - We already have album artwork URL
    // - We're loading (wait for YouTube search to complete first)
    if (!title.trim() || data.albumArtworkUrl || data.isLoading) {
      return
    }

    // Debounce album artwork search
    albumArtworkTimerRef.current = setTimeout(async () => {
      const latestData = { ...data }
      
      // Skip if we got album artwork while waiting
      if (latestData.albumArtworkUrl) {
        return
      }

      // Search for album artwork using iTunes API
      // Use YouTube thumbnail as fallback
      const artworkUrl = await searchAlbumArtwork(title, latestData.thumbnailUrl)
      
      if (artworkUrl && artworkUrl !== latestData.albumArtworkUrl) {
        onUpdate({
          ...latestData,
          albumArtworkUrl: artworkUrl,
        })
      }
    }, 1000) // 1s debounce for album artwork search

    return () => {
      if (albumArtworkTimerRef.current) {
        clearTimeout(albumArtworkTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.title, data.videoId, data.thumbnailUrl, data.albumArtworkUrl, data.isLoading])

  // Extract color from album artwork
  useEffect(() => {
    // Clear previous timer
    if (colorExtractionTimerRef.current) {
      clearTimeout(colorExtractionTimerRef.current)
    }

    const artworkUrl = data.albumArtworkUrl

    // Don't extract if no artwork URL
    if (!artworkUrl) {
      setExtractedColor(null)
      // Reset to default color
      if (moduleRef.current) {
        moduleRef.current.style.setProperty('--color-media-preview-scrim', '')
      }
      return
    }

    // Debounce color extraction
    colorExtractionTimerRef.current = setTimeout(async () => {
      try {
        const color = await extractDominantColor(artworkUrl)
        if (color) {
          const rgbaColor = rgbToRgba(color, 0.61)
          setExtractedColor(rgbaColor)
          // Apply CSS variable on the module root element
          if (moduleRef.current) {
            moduleRef.current.style.setProperty('--color-media-preview-scrim', rgbaColor)
          }
        } else {
          // Extraction failed, use default
          setExtractedColor(null)
          if (moduleRef.current) {
            moduleRef.current.style.setProperty('--color-media-preview-scrim', '')
          }
        }
      } catch (error) {
        console.error('Error extracting color:', error)
        setExtractedColor(null)
        if (moduleRef.current) {
          moduleRef.current.style.setProperty('--color-media-preview-scrim', '')
        }
      }
    }, 500) // 500ms debounce for color extraction

    return () => {
      if (colorExtractionTimerRef.current) {
        clearTimeout(colorExtractionTimerRef.current)
      }
    }
  }, [data.albumArtworkUrl])

  // Load YouTube IFrame API
  useEffect(() => {
    if (!data.videoId) return

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

    loadYouTubeAPI().catch((error) => {
      console.error('Error loading YouTube API:', error)
    })

    return () => {
      // Cleanup handled in YouTube player creation effect
    }
  }, [data.videoId, variant])

  // Create YouTube player instance
  useEffect(() => {
    if (!data.videoId) {
      // Clean up player if videoId is removed
      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy()
        } catch (error) {
          console.warn('Error destroying YouTube player:', error)
        }
        youtubePlayerRef.current = null
      }
      if (youtubeTimeIntervalRef.current) {
        clearInterval(youtubeTimeIntervalRef.current)
        youtubeTimeIntervalRef.current = null
      }
      return
    }

    if (!window.YT || !window.YT.Player) {
      // Wait for API to load
      return
    }

    if (!youtubePlayerContainerRef.current) {
      return
    }

    // Clean up existing player
    if (youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.destroy()
      } catch (error) {
        console.warn('Error destroying existing YouTube player:', error)
      }
      youtubePlayerRef.current = null
    }

    // Create unique container ID
    const containerId = `youtube-player-${Date.now()}`
    youtubePlayerContainerRef.current.id = containerId

    try {
      const player = new window.YT.Player(containerId, {
        videoId: data.videoId,
        events: {
          onReady: (event: { target: any }) => {
            youtubePlayerRef.current = event.target
            try {
              const videoDuration = event.target.getDuration()
              if (videoDuration && videoDuration > 0) {
                setDuration(videoDuration)
              }
            } catch (error) {
              console.warn('Error getting YouTube duration:', error)
            }
          },
          onStateChange: (event: { data: number; target: any }) => {
            const state = event.data
            if (state === window.YT!.PlayerState.PLAYING) {
              setIsPlaying(true)
            } else if (state === window.YT!.PlayerState.PAUSED) {
              setIsPlaying(false)
            } else if (state === window.YT!.PlayerState.ENDED) {
              setIsPlaying(false)
              setCurrentTime(0)
            }
          },
        },
        playerVars: {
          enablejsapi: 1,
          origin: window.location.origin,
        },
      })

      youtubePlayerRef.current = player
    } catch (error) {
      console.error('Error creating YouTube player:', error)
    }

    return () => {
      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy()
        } catch (error) {
          console.warn('Error destroying YouTube player on cleanup:', error)
        }
        youtubePlayerRef.current = null
      }
      if (youtubeTimeIntervalRef.current) {
        clearInterval(youtubeTimeIntervalRef.current)
        youtubeTimeIntervalRef.current = null
      }
    }
  }, [data.videoId, variant])

  // Poll YouTube player for current time
  useEffect(() => {
    if (!data.videoId || !isPlaying) {
      if (youtubeTimeIntervalRef.current) {
        clearInterval(youtubeTimeIntervalRef.current)
        youtubeTimeIntervalRef.current = null
      }
      return
    }

    youtubeTimeIntervalRef.current = setInterval(() => {
      if (youtubePlayerRef.current) {
        try {
          const time = youtubePlayerRef.current.getCurrentTime()
          if (time !== undefined && !isNaN(time)) {
            setCurrentTime(time)
          }
        } catch (error) {
          // Player might not be ready yet
        }
      }
    }, 200) // Poll every 200ms

    return () => {
      if (youtubeTimeIntervalRef.current) {
        clearInterval(youtubeTimeIntervalRef.current)
        youtubeTimeIntervalRef.current = null
      }
    }
  }, [data.videoId, isPlaying, variant])

  // YouTube control methods
  const playYouTube = () => {
    if (youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.playVideo()
      } catch (error) {
        console.error('Error playing YouTube video:', error)
      }
    }
  }

  const pauseYouTube = () => {
    if (youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.pauseVideo()
      } catch (error) {
        console.error('Error pausing YouTube video:', error)
      }
    }
  }

  const seekYouTube = (seconds: number) => {
    if (youtubePlayerRef.current) {
      try {
        youtubePlayerRef.current.seekTo(seconds, true)
        setCurrentTime(seconds)
      } catch (error) {
        console.error('Error seeking YouTube video:', error)
      }
    }
  }

  // Reset playback state when media changes
  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [data.videoId, data.audioUrl])

  // Audio element control methods
  const playAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.play().catch((error) => {
        console.error('Error playing audio:', error)
      })
    }
  }

  const pauseAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause()
    }
  }

  const seekAudio = (seconds: number) => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = seconds
      setCurrentTime(seconds)
    }
  }

  // Event handlers
  const handlePlayPause = () => {
    if (data.videoId) {
      if (isPlaying) {
        pauseYouTube()
      } else {
        playYouTube()
      }
    } else if (data.audioUrl) {
      if (isPlaying) {
        pauseAudio()
      } else {
        playAudio()
      }
    }
  }

  const handleSeek = (progress: number) => {
    const seconds = progress * duration
    if (data.videoId) {
      seekYouTube(seconds)
    } else if (data.audioUrl) {
      seekAudio(seconds)
    }
  }

  const handlePrevious = () => {
    // Stub for now - no playlist support yet
    console.log('Previous track (not implemented)')
  }

  const handleNext = () => {
    // Stub for now - no playlist support yet
    console.log('Next track (not implemented)')
  }

  const handleShuffle = () => {
    // Stub for now - no playlist support yet
    console.log('Shuffle (not implemented)')
  }

  const handleRepeat = () => {
    // Stub for now - no playlist support yet
    console.log('Repeat (not implemented)')
  }

  // Determine if media is available
  const hasMedia = !!(data.videoId || data.audioUrl)
  const showPlayerComponents = hasMedia && !data.isLoading && variant === 'standalone'
  const showChatPlayer = hasMedia && variant === 'chat'

  // Chat variant layout
  if (variant === 'chat' && showChatPlayer) {
    return (
      <div className="media-module media-module--chat" ref={moduleRef}>
        <div className="media-module-chat-container">
          <MediaPreviewWindow
            isExpanded={false}
            albumArtworkUrl={data.albumArtworkUrl}
            videoThumbnailUrl={data.thumbnailUrl}
            title={data.title}
          />
          <SongTitle
            title={data.title || ''}
            variant="chat"
            currentTime={currentTime}
            isActive={isPlaying}
          />
          <PlayButton
            isPlaying={isPlaying}
            onClick={handlePlayPause}
            disabled={!hasMedia}
          />
        </div>
        {/* Hidden YouTube player container for chat variant */}
        {data.videoId && (
          <div 
            ref={youtubePlayerContainerRef} 
            style={{ 
              position: 'absolute', 
              left: '-9999px', 
              width: '320px', 
              height: '240px' 
            }} 
          />
        )}
        {/* Hidden audio element for chat variant */}
        {data.audioUrl && (
          <audio
            ref={audioElementRef}
            src={data.audioUrl}
            onTimeUpdate={(e) => {
              const audio = e.target as HTMLAudioElement
              setCurrentTime(audio.currentTime)
            }}
            onLoadedMetadata={(e) => {
              const audio = e.target as HTMLAudioElement
              setDuration(audio.duration)
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false)
              setCurrentTime(0)
            }}
            onError={(e) => {
              console.error('Audio playback error:', e)
            }}
          />
        )}
      </div>
    )
  }

  // Standalone variant layout
  return (
    <div className="media-module media-module--standalone" ref={moduleRef}>
      {/* Input field - only show when no media is available */}
      {!hasMedia && (
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
      )}
      
      {data.isLoading && (
        <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
          Searching YouTube...
        </div>
      )}

      {/* Player components - only show when media is available */}
      {showPlayerComponents && (
        <>
          <MediaPreviewWindow
            isExpanded={true}
            albumArtworkUrl={data.albumArtworkUrl}
            videoThumbnailUrl={data.thumbnailUrl}
            title={data.title}
          />
          
          {/* Media Controller Container */}
          <div className="media-module-controller">
            {/* Progress Bar Section */}
            <div className="media-module-controller-progress">
              <AudioProgressBar
                progress={duration > 0 ? currentTime / duration : 0}
                duration={duration}
                currentTime={currentTime}
                onSeek={handleSeek}
                color={extractedColor || undefined}
                showHandle={true}
                disabled={!hasMedia}
              />
            </div>
            
            {/* Song Title and Controls Section */}
            <div className="media-module-controller-controls">
              <div className="media-module-controller-song-title">
                <SongTitle
                  title={data.title || ''}
                  variant="master"
                  currentTime={currentTime}
                  isActive={isPlaying}
                />
              </div>
              
              <MediaControls
                variant="Full"
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onShuffle={handleShuffle}
                onRepeat={handleRepeat}
                disabled={!hasMedia}
              />
            </div>
          </div>
        </>
      )}

      {/* Hidden YouTube player container */}
      {data.videoId && (
        <div 
          ref={youtubePlayerContainerRef} 
          style={{ 
            position: 'absolute', 
            left: '-9999px', 
            width: '320px', 
            height: '240px' 
          }} 
        />
      )}

      {/* Hidden audio element */}
      {data.audioUrl && (
        <audio
          ref={audioElementRef}
          src={data.audioUrl}
          onTimeUpdate={(e) => {
            const audio = e.target as HTMLAudioElement
            setCurrentTime(audio.currentTime)
          }}
          onLoadedMetadata={(e) => {
            const audio = e.target as HTMLAudioElement
            setDuration(audio.duration)
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false)
            setCurrentTime(0)
          }}
          onError={(e) => {
            console.error('Audio playback error:', e)
          }}
        />
      )}

      {/* Fallback input for audio URL when no videoId */}
      {!data.videoId && variant === 'standalone' && (
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

      {/* Helper text when no media */}
      {!hasMedia && !data.isLoading && variant === 'standalone' && (
        <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
          Enter a song title to search YouTube, or add a manual audio URL below.
        </div>
      )}
    </div>
  )
}

