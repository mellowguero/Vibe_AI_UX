import React from 'react'
import type { MediaPreviewWindowLayout } from '../../../types/layout'

interface MediaPreviewWindowProps {
  isExpanded: boolean
  albumArtworkUrl?: string
  videoThumbnailUrl?: string
  videoUrl?: string // Video file URL (e.g., .mp4)
  videoId?: string // YouTube video ID for embedded video
  title?: string
  className?: string
  layout?: MediaPreviewWindowLayout
}

export function MediaPreviewWindow({
  isExpanded,
  albumArtworkUrl,
  videoThumbnailUrl,
  videoUrl,
  videoId,
  title,
  className = '',
  layout,
}: MediaPreviewWindowProps) {
  // Build dynamic styles from layout config
  const buildStyle = (): React.CSSProperties => {
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
    
    if (layout?.aspectRatio) {
      style.aspectRatio = layout.aspectRatio
    }
    
    if (layout?.borderRadius) {
      style.borderRadius = layout.borderRadius
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
  
  const dynamicStyle = buildStyle()
  
  if (!isExpanded) {
    // Collapsed state: just the album artwork
    return (
      <div 
        className={`media-preview-window media-preview-window--collapsed ${className}`.trim()}
        style={dynamicStyle}
      >
        {albumArtworkUrl ? (
          <img
            src={albumArtworkUrl}
            alt={title || 'Album artwork'}
            className="media-preview-album-artwork"
          />
        ) : (
          <div className="media-preview-album-artwork media-preview-album-artwork--placeholder" />
        )}
      </div>
    )
  }

  // Expanded state: full layered design
  return (
    <div 
      className={`media-preview-window media-preview-window--expanded ${className}`.trim()}
      style={dynamicStyle}
    >
      {/* Layer 1: Video Back - Video file, YouTube embed, or thumbnail image, extends beyond bounds */}
      {(videoUrl || videoThumbnailUrl || videoId) && (
        <div className="media-preview-video-back">
          {videoUrl ? (
            <video
              src={videoUrl}
              className="media-preview-video-back-video"
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
            />
          ) : videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
              className="media-preview-video-back-iframe"
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
              aria-hidden="true"
            />
          ) : videoThumbnailUrl ? (
            <img
              src={videoThumbnailUrl}
              alt=""
              className="media-preview-video-back-image"
              aria-hidden="true"
            />
          ) : null}
        </div>
      )}

      {/* Layer 2-6: Overlays and artwork container */}
      <div className="media-preview-overlays" aria-hidden="true">
        {/* Layer 2: Dark overlay */}
        <div className="media-preview-dark-overlay" />

        {/* Layer 3: Background image - album artwork at 20% opacity */}
        {/* Only show blurred album artwork if no video (YouTube or thumbnail) is available */}
        {albumArtworkUrl && !videoThumbnailUrl && !videoId && (
          <div className="media-preview-bg-image">
            <img
              src={albumArtworkUrl}
              alt=""
              className="media-preview-bg-image-content"
            />
          </div>
        )}

        {/* Layer 4: Scrim overlay */}
        <div className="media-preview-scrim" />
      </div>

      {/* Layer 6: Album artwork - main visible element */}
      {albumArtworkUrl ? (
        <img
          src={albumArtworkUrl}
          alt={title || 'Album artwork'}
          className="media-preview-album-artwork"
        />
      ) : (
        <div className="media-preview-album-artwork media-preview-album-artwork--placeholder" />
      )}
    </div>
  )
}

