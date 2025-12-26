interface MediaPreviewWindowProps {
  isExpanded: boolean
  albumArtworkUrl?: string
  videoThumbnailUrl?: string
  videoUrl?: string // Video file URL (e.g., .mp4)
  title?: string
  className?: string
}

export function MediaPreviewWindow({
  isExpanded,
  albumArtworkUrl,
  videoThumbnailUrl,
  videoUrl,
  title,
  className = '',
}: MediaPreviewWindowProps) {
  if (!isExpanded) {
    // Collapsed state: just the album artwork
    return (
      <div className={`media-preview-window media-preview-window--collapsed ${className}`.trim()}>
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
    <div className={`media-preview-window media-preview-window--expanded ${className}`.trim()}>
      {/* Layer 1: Video Back - Video file or thumbnail image, extends beyond bounds */}
      {(videoUrl || videoThumbnailUrl) && (
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
          ) : (
            <img
              src={videoThumbnailUrl}
              alt=""
              className="media-preview-video-back-image"
              aria-hidden="true"
            />
          )}
        </div>
      )}

      {/* Layer 2-6: Overlays and artwork container */}
      <div className="media-preview-overlays" aria-hidden="true">
        {/* Layer 2: Dark overlay */}
        <div className="media-preview-dark-overlay" />

        {/* Layer 3: Background image - album artwork at 20% opacity */}
        {albumArtworkUrl && (
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

