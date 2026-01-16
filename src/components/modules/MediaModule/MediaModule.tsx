import { useEffect, useRef, useState } from 'react'
import type { MediaModuleData } from '../../../types/modules'
import type { MediaModuleLayout } from '../../../types/layout'
import { searchYouTubeMusic, searchAlbumArtwork, searchOtherSongsByArtist } from '../../../api/services'
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
  layout?: MediaModuleLayout
  debugCurrentTime?: number // For visual debugging - overrides internal currentTime
  showDebugDimensions?: boolean // For visual debugging - controls dimensions display
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
// Right here is where you change the trigger! 👇👇👇👇
// Compact mode trigger height - change this to adjust when the module switches to compact layout
const COMPACT_MODE_HEIGHT = 140




export function MediaModule({ data, onUpdate, variant = 'standalone', layout, debugCurrentTime, showDebugDimensions = true }: MediaModuleProps) {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const albumArtworkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const colorExtractionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const youtubeTimeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  
  // Store extracted color for future use (e.g., timebar)
  const [extractedColor, setExtractedColor] = useState<string | null>(null)
  
  // Build dynamic styles from layout config
  const buildModuleStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {}
    
    if (layout?.spacing) {
      if (layout.spacing.margin) style.margin = layout.spacing.margin
      if (layout.spacing.marginTop) style.marginTop = layout.spacing.marginTop
      if (layout.spacing.marginRight) style.marginRight = layout.spacing.marginRight
      if (layout.spacing.marginBottom) style.marginBottom = layout.spacing.marginBottom
      if (layout.spacing.marginLeft) style.marginLeft = layout.spacing.marginLeft
      if (layout.spacing.padding) style.padding = layout.spacing.padding
      if (layout.spacing.paddingTop) style.paddingTop = layout.spacing.paddingTop
      if (layout.spacing.paddingRight) style.paddingRight = layout.spacing.paddingRight
      if (layout.spacing.paddingBottom) style.paddingBottom = layout.spacing.paddingBottom
      if (layout.spacing.paddingLeft) style.paddingLeft = layout.spacing.paddingLeft
      if (layout.spacing.gap) style.gap = layout.spacing.gap
    }
    
    if (layout?.size) {
      if (layout.size.width) style.width = layout.size.width
      if (layout.size.height) style.height = layout.size.height
      if (layout.size.minWidth) style.minWidth = layout.size.minWidth
      if (layout.size.minHeight) style.minHeight = layout.size.minHeight
      if (layout.size.maxWidth) style.maxWidth = layout.size.maxWidth
      if (layout.size.maxHeight) style.maxHeight = layout.size.maxHeight
    }
    
    if (layout?.flex) {
      if (layout.flex.direction) style.flexDirection = layout.flex.direction
      if (layout.flex.align) style.alignItems = layout.flex.align
      if (layout.flex.justify) style.justifyContent = layout.flex.justify
      if (layout.flex.wrap) style.flexWrap = layout.flex.wrap
      if (layout.flex.grow !== undefined) style.flexGrow = layout.flex.grow
      if (layout.flex.shrink !== undefined) style.flexShrink = layout.flex.shrink
      if (layout.flex.basis) style.flexBasis = layout.flex.basis
    }
    
    if (layout?.grid) {
      if (layout.grid.columns) style.gridTemplateColumns = layout.grid.columns
      if (layout.grid.rows) style.gridTemplateRows = layout.grid.rows
      if (layout.grid.gap) style.gap = layout.grid.gap
      if (layout.grid.columnGap) style.columnGap = layout.grid.columnGap
      if (layout.grid.rowGap) style.rowGap = layout.grid.rowGap
    }
    
    if (layout?.positioning) {
      if (layout.positioning.position) style.position = layout.positioning.position
      if (layout.positioning.top !== undefined) style.top = layout.positioning.top
      if (layout.positioning.right !== undefined) style.right = layout.positioning.right
      if (layout.positioning.bottom !== undefined) style.bottom = layout.positioning.bottom
      if (layout.positioning.left !== undefined) style.left = layout.positioning.left
      if (layout.positioning.zIndex !== undefined) style.zIndex = layout.positioning.zIndex
    }
    
    return style
  }
  
  const moduleStyle = buildModuleStyle()
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  
  // Use debugCurrentTime if provided, otherwise use internal currentTime
  const displayCurrentTime = debugCurrentTime !== undefined ? debugCurrentTime : currentTime
  
  // Resize state
  const [moduleWidth, setModuleWidth] = useState<number | null>(null)
  const [moduleHeight, setModuleHeight] = useState<number | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const resizeStartXRef = useRef<number>(0)
  const resizeStartWidthRef = useRef<number>(0)
  const resizeStartYRef = useRef<number>(0)
  const resizeStartHeightRef = useRef<number>(0)
  const resizeDirectionRef = useRef<'width' | 'height' | 'both' | null>(null)
  const [maxNaturalHeight, setMaxNaturalHeight] = useState<number | null>(null)
  const [moduleDimensions, setModuleDimensions] = useState<{ width: number; height: number } | null>(null)
  
  // Determine if module is in compact mode
  const isCompact = moduleDimensions ? moduleDimensions.height <= COMPACT_MODE_HEIGHT : false
  
  // Refs
  const moduleRef = useRef<HTMLDivElement | null>(null)
  const youtubePlayerRef = useRef<any>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const youtubePlayerContainerRef = useRef<HTMLDivElement | null>(null)
  const previewWindowRef = useRef<HTMLDivElement | null>(null)
  const controllerRef = useRef<HTMLDivElement | null>(null)

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
      setIsPlayerReady(false)
      return
    }

    // Capture videoId to ensure type safety in async callbacks
    const videoId = data.videoId

    // Wait for both YouTube API and container to be ready
    let retryCount = 0
    const initializePlayer = () => {
      retryCount++
      
      if (!window.YT || !window.YT.Player) {
        // API not ready yet, retry (max 100 attempts = 10 seconds)
        if (retryCount < 100) {
          setTimeout(initializePlayer, 100)
        } else {
          console.error('YouTube API never loaded after 100 attempts')
        }
        return
      }

      if (!youtubePlayerContainerRef.current) {
        // Container not ready yet, retry (max 100 attempts = 10 seconds)
        // Use requestAnimationFrame for first few attempts to wait for React render
        if (retryCount < 10) {
          requestAnimationFrame(() => {
            setTimeout(initializePlayer, 50)
          })
        } else if (retryCount < 100) {
          setTimeout(initializePlayer, 100)
        } else {
          console.error('Container never became available after 100 attempts')
        }
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

      // Use a stable container ID based on videoId to avoid React conflicts
      const containerId = `youtube-player-${videoId}`
      const container = youtubePlayerContainerRef.current
      
      // Only set ID if it's not already set (to avoid React conflicts)
      if (!container.id || container.id !== containerId) {
        container.id = containerId
      }

      try {
        new window.YT.Player(containerId, {
          videoId: videoId,
          events: {
            onReady: (event: { target: any }) => {
              youtubePlayerRef.current = event.target
              setIsPlayerReady(true)
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

        // Don't set the ref here - wait for onReady callback
        // The player will be set in the onReady callback when it's actually ready
      } catch (error) {
        console.error('Error creating YouTube player:', error)
        setIsPlayerReady(false)
      }
    }

    // Start initialization
    initializePlayer()

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
      setIsPlayerReady(false)
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
    if (!youtubePlayerRef.current) {
      console.warn('YouTube player not initialized')
      return
    }

    const attemptPlay = () => {
      if (!youtubePlayerRef.current) return
      
      try {
        // Check player state before playing
        const playerState = youtubePlayerRef.current.getPlayerState()
        // PlayerState values: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
        if (playerState === -1) {
          // Player is unstarted, wait a bit more and try again
          setTimeout(() => {
            if (youtubePlayerRef.current) {
              try {
                const newState = youtubePlayerRef.current.getPlayerState()
                if (newState !== -1) {
                  youtubePlayerRef.current.playVideo()
                } else {
                  // Still not ready, try one more time
                  setTimeout(() => {
                    if (youtubePlayerRef.current) {
                      try {
                        youtubePlayerRef.current.playVideo()
                      } catch (error) {
                        console.error('Error playing YouTube video after retry:', error)
                      }
                    }
                  }, 500)
                }
              } catch (error) {
                console.error('Error checking player state:', error)
              }
            }
          }, 300)
          return
        }
        youtubePlayerRef.current.playVideo()
      } catch (error) {
        console.error('Error playing YouTube video:', error)
        // If error occurs, try again after a short delay
        setTimeout(() => {
          if (youtubePlayerRef.current) {
            try {
              youtubePlayerRef.current.playVideo()
            } catch (retryError) {
              console.error('Error playing YouTube video on retry:', retryError)
            }
          }
        }, 500)
      }
    }

    if (!isPlayerReady) {
      console.warn('YouTube player not ready yet, waiting...')
      // Wait a bit and try again
      setTimeout(attemptPlay, 500)
      return
    }

    attemptPlay()
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
    setIsPlayerReady(false)
  }, [data.videoId, data.audioUrl])

  // Determine if media is available (must be declared before useEffect that uses showPlayerComponents)
  const hasMedia = !!(data.videoId || data.audioUrl)
  const showPlayerComponents = hasMedia && !data.isLoading && variant === 'standalone'
  const showChatPlayer = hasMedia && variant === 'chat'

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

  const handlePrevious = async () => {
    if (!data.videoId) return
    
    // Extract artist name from title (format: "Artist - Song")
    const artistMatch = data.title?.match(/^([^-]+) - (.+)$/)
    const artistName = artistMatch ? artistMatch[1].trim() : data.channelTitle || ''
    
    if (!artistName) {
      console.warn('Cannot find artist name for previous track')
      return
    }
    
    // Search for another song by the same artist
    const result = await searchOtherSongsByArtist(
      artistName,
      data.channelTitle,
      data.videoId
    )
    
    if (result) {
      onUpdate({
        ...data,
        title: result.title,
        videoId: result.videoId,
        channelTitle: result.channelTitle,
        thumbnailUrl: result.thumbnailUrl,
        albumArtworkUrl: undefined, // Clear to trigger new artwork search
        isLoading: false,
      })
    } else {
      console.warn('No other songs found for this artist')
    }
  }

  const handleNext = async () => {
    if (!data.videoId) return
    
    // Extract artist name from title (format: "Artist - Song")
    const artistMatch = data.title?.match(/^([^-]+) - (.+)$/)
    const artistName = artistMatch ? artistMatch[1].trim() : data.channelTitle || ''
    
    if (!artistName) {
      console.warn('Cannot find artist name for next track')
      return
    }
    
    // Search for another song by the same artist
    const result = await searchOtherSongsByArtist(
      artistName,
      data.channelTitle,
      data.videoId
    )
    
    if (result) {
      onUpdate({
        ...data,
        title: result.title,
        videoId: result.videoId,
        channelTitle: result.channelTitle,
        thumbnailUrl: result.thumbnailUrl,
        albumArtworkUrl: undefined, // Clear to trigger new artwork search
        isLoading: false,
      })
    } else {
      console.warn('No other songs found for this artist')
    }
  }

  const handleShuffle = () => {
    // Stub for now - no playlist support yet
    console.log('Shuffle (not implemented)')
  }

  const handleRepeat = () => {
    // Stub for now - no playlist support yet
    console.log('Repeat (not implemented)')
  }

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent, direction: 'width' | 'height' | 'both') => {
    e.preventDefault()
    e.stopPropagation()
    
    if (moduleRef.current) {
      const rect = moduleRef.current.getBoundingClientRect()
      resizeDirectionRef.current = direction
      
      if (direction === 'width' || direction === 'both') {
        resizeStartXRef.current = e.clientX
        resizeStartWidthRef.current = rect.width
      }
      
      if (direction === 'height' || direction === 'both') {
        resizeStartYRef.current = e.clientY
        resizeStartHeightRef.current = rect.height
      }
      
      setIsResizing(true)
    }
  }

  // Handle resize during mouse move
  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (moduleRef.current) {
        const direction = resizeDirectionRef.current
        
        if (direction === 'width' || direction === 'both') {
          const deltaX = e.clientX - resizeStartXRef.current
          const MIN_WIDTH = 280
          const MAX_WIDTH = 800
          const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, resizeStartWidthRef.current + deltaX))
          setModuleWidth(newWidth)
        }
        
        if (direction === 'height' || direction === 'both') {
          const deltaY = e.clientY - resizeStartYRef.current
          const MIN_HEIGHT = 72
          const MAX_HEIGHT = Infinity
          const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStartHeightRef.current + deltaY))
          setModuleHeight(newHeight)
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      
      // Auto-collapse to 72px if height is at or below breakpoint
      if (moduleHeight !== null && moduleHeight <= COMPACT_MODE_HEIGHT) {
        setModuleHeight(72)
      }
      
      resizeDirectionRef.current = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, maxNaturalHeight])

  // Update moduleStyle to include width and height if resized
  const finalModuleStyle = {
    ...moduleStyle,
    ...(moduleWidth !== null ? { width: `${moduleWidth}px`, minWidth: '280px', maxWidth: '800px' } : {}),
    ...(moduleHeight !== null ? { height: `${moduleHeight}px`, minHeight: '72px' } : {}),
    position: 'relative' as const,
    // Disable transition during resize for smooth dragging
    transition: isResizing ? 'none' : 'height 0.3s ease',
  }

  // Calculate natural content height (MediaPreviewWindow + media-module-controller)
  useEffect(() => {
    if (!showPlayerComponents) {
      setMaxNaturalHeight(null)
      return
    }

    const measureNaturalHeight = () => {
      if (previewWindowRef.current && controllerRef.current) {
        const previewHeight = previewWindowRef.current.offsetHeight
        const controllerHeight = controllerRef.current.offsetHeight
        const totalHeight = previewHeight + controllerHeight
        // Add small buffer for rounding/margins
        setMaxNaturalHeight(totalHeight + 4)
      }
    }

    // Measure immediately
    measureNaturalHeight()

    // Use ResizeObserver to update when content size changes
    const resizeObserver = new ResizeObserver(() => {
      measureNaturalHeight()
    })

    if (previewWindowRef.current) {
      resizeObserver.observe(previewWindowRef.current)
    }
    if (controllerRef.current) {
      resizeObserver.observe(controllerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [showPlayerComponents, data.albumArtworkUrl, data.thumbnailUrl, data.title])

  // Track module dimensions for debug
  useEffect(() => {
    if (!moduleRef.current) return

    const updateDimensions = () => {
      if (moduleRef.current) {
        setModuleDimensions({
          width: moduleRef.current.offsetWidth,
          height: moduleRef.current.offsetHeight,
        })
      }
    }

    // Measure immediately
    updateDimensions()

    // Use ResizeObserver to update when module size changes
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions()
    })

    resizeObserver.observe(moduleRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [moduleWidth, moduleHeight])

  // Chat variant layout
  if (variant === 'chat' && showChatPlayer) {
    return (
      <div className="media-module media-module--chat" ref={moduleRef} style={moduleStyle}>
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
            currentTime={displayCurrentTime}
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
            className="youtube-player-hidden"
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              width: '320px',
              height: '240px',
              opacity: 0,
              pointerEvents: 'none',
              zIndex: -1,
              overflow: 'hidden',
              clipPath: 'inset(50%)',
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
    <div className={`media-module media-module--standalone ${isCompact ? 'media-module--standalone-compact' : ''}`} ref={moduleRef} style={finalModuleStyle}>
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
          {/* Media Preview - Hidden when compact */}
          {!isCompact && (
            <div ref={previewWindowRef} className="media-module-preview-wrapper">
              <MediaPreviewWindow
                isExpanded={true}
                albumArtworkUrl={data.albumArtworkUrl}
                videoThumbnailUrl={data.thumbnailUrl}
                videoId={data.videoId}
                title={data.title}
                layout={layout?.previewWindowLayout}
              />
            </div>
          )}
          {/* Keep ref when hidden for measurements */}
          {isCompact && <div ref={previewWindowRef} className="media-module-preview-wrapper" style={{ display: 'none' }} />}
          
          {/* Media Controller Container */}
          <div ref={controllerRef} className={`media-module-controller ${isCompact ? 'media-module-controller--compact' : ''}`}>
            {/* Progress Bar Section - Hidden when compact */}
            {!isCompact && (
              <div className="media-module-controller-progress">
                <AudioProgressBar
                  progress={duration > 0 ? displayCurrentTime / duration : 0}
                  duration={duration}
                  currentTime={displayCurrentTime}
                  onSeek={handleSeek}
                  color={extractedColor || undefined}
                  showHandle={true}
                  disabled={!hasMedia}
                  layout={layout?.progressBarLayout}
                />
              </div>
            )}
            
            {/* Song Title and Controls Section */}
            <div className={`media-module-controller-controls ${isCompact ? 'media-module-controller-controls--compact' : ''}`}>
              <div className="media-module-controller-song-title">
                <SongTitle
                  title={data.title || ''}
                  variant={isCompact ? "collapsed" : "master"}
                  currentTime={displayCurrentTime}
                  isActive={isPlaying}
                  layout={layout?.songTitleLayout}
                />
              </div>
              
              <MediaControls
                variant={isCompact ? "Partial" : "Full"}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onShuffle={handleShuffle}
                onRepeat={handleRepeat}
                disabled={!hasMedia}
                layout={layout?.controlsLayout}
              />
            </div>
          </div>
        </>
      )}

      {/* Hidden YouTube player container */}
      {data.videoId && (
        <div 
          ref={youtubePlayerContainerRef} 
          className="youtube-player-hidden"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '320px',
            height: '240px',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: -1,
            overflow: 'hidden',
            clipPath: 'inset(50%)',
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

      {/* Resize handle for standalone variant */}
      {variant === 'standalone' && (
        <>
          <div
            className="module-resize-handle"
            onMouseDown={(e) => handleResizeStart(e, 'width')}
          />
          {/* Corner resize handle for width + height */}
          <div
            className="module-resize-handle-corner"
            onMouseDown={(e) => handleResizeStart(e, 'both')}
          />
        </>
      )}

      {/* Debug dimensions display */}
      {variant === 'standalone' && moduleDimensions && showDebugDimensions && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: 'monospace',
            zIndex: 1000,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {moduleDimensions.width} × {moduleDimensions.height}px
        </div>
      )}
    </div>
  )
}

