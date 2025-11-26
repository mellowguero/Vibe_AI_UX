# Changelog

## [Latest] - 2024

### Added
- **Close button (X)** on all modules - Click the X in the top-right corner of any module to delete it
- **Direct Unsplash search in Image module** - Image module now has a search input field that automatically searches Unsplash as you type (800ms debounce)
- **Search → Image composition rule** - Drag a Search module over an Image module and select "Find image from search query" to populate the image from Unsplash
- **Environment variable support** - Added `.env` file template for API keys (VITE_YOUTUBE_API_KEY, VITE_UNSPLASH_ACCESS_KEY, VITE_OPENAI_API_KEY)

### Changed
- **Music Player YouTube integration** - When YouTube finds a video, the title field now updates with the full video title (e.g., "Beck - Loser (Official Music Video)") instead of just the search query. This ensures "Search for this track" uses the complete track name.
- **Image module UI** - Reorganized to have search input at the top, followed by manual URL input, then label field. Search and URL inputs are mutually exclusive.

### Fixed
- **YouTube title handling** - Fixed issue where "Search for this track" was only using artist name instead of full track title

### Technical
- Added `searchQuery` field to `ImageModuleData` type
- Enhanced `ImageModule` component with debounced Unsplash search functionality
- Added `deleteModule` function to App component
- Improved error logging for Unsplash API calls
- Updated composition rules to extract artist names before searching Unsplash

