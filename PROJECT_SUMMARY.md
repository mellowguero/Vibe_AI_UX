# **Agentic Modular UI Prototype — Project Summary**

## **1. Core Architecture**

- Modular canvas-based environment.
- Sidebar for module creation.
- Inspector panel for editing selected module.
- Unified module schema (ModuleType, ModuleInstance).
- Each module stores id, type, x, y, z, and data.

## **2. Implemented Modules**

### **Image Module**

- Fields: imageUrl, label, searchQuery, isLoading, imageProvider, error.
- **Dual provider support**: Can search via Unsplash API or Google Custom Search API.
- Provider toggle: Switch between Unsplash and Google Images with UI buttons.
- Unsplash integration: Requires `VITE_UNSPLASH_ACCESS_KEY`.
- Google Images integration: Requires `VITE_GOOGLE_API_KEY` (or `VITE_GOOGLE_MAPS_API_KEY`) and `VITE_GOOGLE_CSE_ID` (or `VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID`).
- Visible error messages: Shows helpful error messages in UI when APIs fail or keys are missing.
- Displays preview or placeholder.

### **Music Player Module** (formerly "Media Module")

- Fields: title, audioUrl, videoId, channelTitle, thumbnailUrl, isLoading.
- YouTube integration: Auto-searches YouTube when song title is entered.
- Supports both YouTube embeds and manual audio URLs.
- YouTube URL detection: Automatically converts pasted YouTube URLs to embeds.
- Display name: "Music Player" (internal type: `'media'`).

### **Text Module**

- Field: text.
- Fully editable text container.

### **Map Module**

- Fields: locationQuery, description, latitude, longitude, formattedAddress, isLoading, error.
- **Google Maps integration**: Real interactive maps with geocoding.
- Auto-geocodes location queries (800ms debounce).
- Displays interactive Google Maps with markers/pins.
- Shows formatted address when location is geocoded.
- Smooth location updates when query changes.
- Requires `VITE_GOOGLE_MAPS_API_KEY` (Geocoding API and Maps JavaScript API must be enabled).

### **Search Module**

- Fields: query, optional results, isLoading.
- Real-time search with DuckDuckGo Instant Answer API (no key needed).
- Auto-searches as you type (500ms debounce).
- Detects music queries and provides helpful suggestions.

### **Chat Module**

- Fields: messages (array), isLoading, error.
- **iMessage-style UI**: User messages on right (blue), AI messages on left (gray).
- **AI Friend Integration**: Uses OpenAI Chat Completions API for conversational responses.
- **Nested Module Support**: Messages can contain embedded modules (especially Music Player for song recommendations).
- **Drag-Out Functionality**: Extract nested modules from chat to desktop canvas (both button and drag handle).
- **Auto-Song Recommendations**: AI automatically creates Music Player modules when recommending songs, with YouTube search integration.
- **Character Customization**: AI character is "Alex Oskie" - a designer from New York with dry, silly sense of humor.
- Requires `VITE_OPENAI_API_KEY` for AI chat functionality.
- Full conversation history stored in module data.

## **3. Interaction Model**

- Cards are draggable via header.
- Z-index stacking places active card on top.
- Modules can be selected, highlighted, and edited.
- Inspector updates all type-specific fields.

## **4. Composition Engine**

### **Overlap Detection**

- Detects when a dragged module overlaps another.

### **Composition Rules**

- Modular rules enable context-aware actions.
- All transformations are bidirectional where it makes sense.

#### **Implemented Composition Rules:**

**Image Module:**
- Image → Text: Append image URL to note
- Image → Map: Use image label as map query
- Image → Search: Use image label as search query

**Text Module:**
- Text → Media: Use note text as song title
- Text → Map: Use note text as map query
- Text → Search: Use note text as search query

**Music Player Module:**
- Media → Text: Add track info to note
- Media → Search: Search for this track (full title)
- Media → Search: Search for artist name only (extracts artist from title)
- Media → Image: Find image of artist/band (respects selected image provider)

**Map Module:**
- Map → Search: Use map location as search query
- Map → Text: Add location to note

**Search Module:**
- Search → Map: Populate map from search query (adds description)
- Search → Text: Add search query to note
- Search → Text: Populate note with search results
- Search → Media: Use search query as track title
- Search → Image: Find image from search query (respects selected image provider)

**Chat Module:**
- Media → Chat: Send song recommendation to chat
- Text → Chat: Send text message to chat
- Chat → Media: Extract nested Music Player from chat
- Chat → Text: Extract text from chat message

### **Floating Composition Menu**

- Shows available actions when modules overlap.

## **5. API Integrations**

### **Search API (DuckDuckGo)**
- Real-time search with DuckDuckGo Instant Answer API.
- No API key required.
- Uses CORS proxy for browser compatibility.
- Returns instant answers, abstracts, and related topics.
- Detects music queries and provides helpful fallback messages.

### **Image Search APIs**

**Unsplash API:**
- Searches for images via Unsplash API.
- Requires API key (free tier available): `VITE_UNSPLASH_ACCESS_KEY`
- Returns high-quality images with metadata.
- Used in Media → Image and Search → Image composition rules.

**Google Custom Search API:**
- Searches Google Images via Custom Search API.
- Requires API key: `VITE_GOOGLE_API_KEY` (or `VITE_GOOGLE_MAPS_API_KEY`)
- Requires Custom Search Engine ID: `VITE_GOOGLE_CSE_ID` (or `VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID`)
- Must enable "Custom Search API" in Google Cloud Console.
- Returns web images with broader coverage than Unsplash.
- Used in Media → Image and Search → Image composition rules.

### **YouTube Music API**
- Searches YouTube for music videos.
- Requires YouTube Data API v3 key (free tier available).
- Auto-searches when song title is entered in Music Player.
- Embeds YouTube player for playback.
- Supports manual audio URLs as fallback.

### **Google Maps API**
- **Geocoding API**: Converts location queries to coordinates and formatted addresses.
- **Maps JavaScript API**: Displays interactive Google Maps with markers.
- Requires `VITE_GOOGLE_MAPS_API_KEY` (free tier available).
- Free tier: 40,000 geocoding requests/month, 28,000 map loads/month.
- Auto-geocodes when location query is entered in Map module.
- Interactive maps with zoom, pan, and marker pins.
- Used in all Map module composition rules (Image → Map, Text → Map, Search → Map).

### **OpenAI Chat API**
- **Chat Completions API**: Powers conversational AI friend in Chat module.
- Requires `VITE_OPENAI_API_KEY` (paid API, pay-per-use).
- Customizable AI character via system message.
- Automatically detects song recommendations and creates nested Music Player modules.
- Enhanced YouTube search integration for finding correct bands/artists.
- Used exclusively in Chat module for AI conversations.

## **6. Composition Chains Enabled**

The system now supports rich composition chains:

- **Text → Search → Text** (loop)
- **Text → Search → Media** (Music Player)
- **Text → Search → Map → Text**
- **Media → Text → Search → Media**
- **Map → Text → Search → Map**
- **Media → Image** (find artist/band image)
- **Search → Image** (find image from search query)
- And many more combinations...

**Chain = agentic.** The system feels alive as modules can flow data between each other.

## **7. Recent Updates**

### **Chat Module with AI Friend (Latest Session)**

1. **Chat Module Implementation**:
   - Created new Chat module with iMessage-style UI
   - User messages appear on right (blue bubbles), AI messages on left (gray bubbles)
   - Scrollable message list with auto-scroll to bottom
   - Input field with send button and Enter key support
   - Loading states and error handling for API failures

2. **OpenAI Integration**:
   - Added `chatWithAI()` function in `src/api/services.ts`
   - Uses OpenAI Chat Completions API (gpt-3.5-turbo)
   - Customizable AI character via system message
   - Currently configured as "Alex Oskie" - designer from New York with dry, silly humor

3. **Nested Module Support**:
   - Messages can contain embedded modules (preview and expanded views)
   - AI automatically creates Music Player modules when recommending songs
   - Enhanced song detection with better regex patterns for "Artist - Song" format
   - Improved YouTube search to find correct bands/artists
   - Preserves original "Artist - Song" title when extracting from chat

4. **Drag-Out Functionality**:
   - Extract nested modules from chat to desktop canvas
   - Two methods: "Extract to Desktop" button and drag handle
   - Creates new ModuleInstance at drag position
   - Fixed title preservation - extracted Music Player modules keep original title

5. **Composition Rules**:
   - Media → Chat: Send song recommendation to chat
   - Text → Chat: Send text message to chat
   - Chat → Media: Extract nested Music Player from chat
   - Chat → Text: Extract text from chat message

6. **UI Enhancements**:
   - Chat modules are wider (320px) to accommodate messages
   - Nested module previews with icons and compact display
   - Expandable nested modules for full view
   - Inspector shows chat message history

7. **Technical Improvements**:
   - Added ChatMessage and ChatModuleData types
   - Enhanced YouTube search with Music category filter
   - Better song title extraction from AI responses
   - Fixed MediaModule to preserve titles when videoId exists
   - Added chat-specific CSS styling

### **Google Maps API Integration (Previous Session)**

1. **Real Map Integration**: 
   - Replaced placeholder map with full Google Maps JavaScript API integration
   - Interactive maps with zoom, pan, and marker pins
   - Real-time geocoding via Google Geocoding API
   - Auto-geocodes location queries with 800ms debounce

2. **Map Module Enhancements**: 
   - Added geocoding fields: `latitude`, `longitude`, `formattedAddress`
   - Added `isLoading` and `error` states for better UX
   - Map container stays mounted to prevent rendering issues
   - Smooth location updates when query changes

3. **API Integration**: 
   - Implemented `geocodeLocation()` function in `src/api/services.ts`
   - Dynamic Google Maps script loading
   - Proper error handling for API key restrictions and geocoding failures
   - Map instance management with proper cleanup

4. **Environment Variables**: 
   - Added `VITE_GOOGLE_MAPS_API_KEY` to `.env` template
   - Requires Geocoding API and Maps JavaScript API to be enabled in Google Cloud Console

### **Image Search Provider Toggle (Previous Session)**

1. **Google Images Integration**: 
   - Added Google Custom Search API as an alternative image search provider
   - Implemented `searchGoogleImages()` function in `src/api/services.ts`
   - Created unified `searchImages()` helper function that routes to the selected provider

2. **Provider Toggle UI**: 
   - Added toggle buttons in Image Module to switch between Unsplash and Google Images
   - Provider preference is saved per module instance (`imageProvider` field)
   - Visual feedback shows which provider is currently selected

3. **Enhanced Error Handling**: 
   - Added visible error messages in Image Module UI (red error boxes)
   - Error messages guide users when API keys are missing or APIs aren't enabled
   - Specific error messages for common issues (API not enabled, missing keys, etc.)
   - Errors clear automatically when switching providers or starting new searches

4. **Environment Variable Support**: 
   - Supports both `VITE_GOOGLE_CSE_ID` and `VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID` for flexibility
   - Can use `VITE_GOOGLE_API_KEY` or fallback to `VITE_GOOGLE_MAPS_API_KEY`
   - Clear error messages indicate which environment variables are needed

5. **Composition Rules Updated**: 
   - Media → Image and Search → Image rules now respect the selected image provider
   - Automatically uses the provider preference from the target Image module

### **API Integrations (Previous Sessions)**

1. **Search API (DuckDuckGo)**: Real-time search with instant answers
2. **Image Search API (Unsplash)**: Find artist/band images via Media → Image
3. **YouTube Music API**: Auto-search and play music videos in Music Player
4. **Google Maps API**: Real maps with geocoding and interactive markers

### **New Features**

1. **Artist Name Extraction**: 
   - Pattern-based extraction from song titles (handles "Artist - Song" format)
   - Optional AI-powered extraction using OpenAI API
   - New composition action: "Search for artist name only" (Media → Search)

2. **YouTube URL Detection**: 
   - Automatically detects and converts pasted YouTube URLs to embeds
   - Works in both title field and audio URL field

3. **Smart Search Detection**: 
   - Search module detects music queries and suggests using Music Player
   - Better fallback messages for different query types

### **Composition Rules Added/Updated**

1. **Search → Map**: Populate map from search query (with description)
2. **Search → Text** (2 actions): Add query to note, or populate with search results
3. **Search → Media**: Use search query as track title
4. **Search → Image**: Find image from search query (respects selected provider)
5. **Media → Text**: Add track info to note
6. **Media → Search** (2 actions): Search for full track, or extract artist name only
7. **Map → Text**: Add location to note
8. **Media → Image**: Find image of artist/band (respects selected provider)

### **UI Updates**

- Renamed "Media" module to "Music Player" throughout the UI
- Added loading states to all API-integrated modules
- Better error handling and user feedback with visible error messages
- Improved placeholder text and help messages
- Provider toggle UI in Image Module

### **Technical Improvements**

- Created `src/api/services.ts` for all API integrations
- Created `src/utils/textParsing.ts` for text extraction utilities
- Added `.env` file support for API keys
- Fixed CORS issues with API calls
- Improved state management for async operations
- Added `imageProvider` and `error` fields to `ImageModuleData` type
- Enhanced error handling with try-catch blocks and helpful error messages
- Better API response parsing for Google Custom Search API
- Enhanced logging for debugging API issues

## **8. Not Implemented Yet (Future Work)**

- Spawn collision avoidance.
- Module merging.
- Module linking or graph system.
- Multi-select and grouping.
- Workspace persistence.
- OS-level chrome (dock, toolbar, spaces).
- Agent-driven actions and automation.
- Enhanced AI integration (currently optional for artist extraction).

## **9. Current System Overview**

- Fully functional modular UI.
- Robust inspector.
- Comprehensive composition-based interactions.
- Expandable module schema.
- Rich bidirectional data flow between modules.
- A real foundational layer for an agentic OS.

## **10. Technical Details**

### **File Structure**

- `src/App.tsx` - Main application component with drag/drop and composition logic
- `src/components/` - Individual module components
- `src/compositionRules.ts` - All composition rules and transformations
- `src/types/modules.ts` - Type definitions for all modules
- `src/components/Inspector.tsx` - Module property editor
- `src/components/ModuleCard.tsx` - Wrapper for draggable modules
- `src/components/CompositionMenu.tsx` - Floating menu for composition actions
- `src/api/services.ts` - API service functions (Search, Images, YouTube, Google Images, Geocoding, OpenAI Chat)
- `src/utils/textParsing.ts` - Text extraction utilities (artist name, etc.)
- `src/components/ChatModule.tsx` - Chat module component with AI integration
- `.env` - Environment variables for API keys (not committed to git)

### **Running the Project**

```bash
npm run dev
```

The dev server runs on `localhost` (typically `http://localhost:5173`). VPN is not required for local development.

---

**Last Updated:** Latest session added Chat Module with AI friend integration (OpenAI), iMessage-style UI, nested module support, and drag-out functionality. AI character customized as "Alex Oskie" with dry, silly humor. Enhanced YouTube search for better band/artist detection. Fixed Music Player title preservation when extracting from chat. Previous session added Google Maps API integration with real interactive maps, geocoding, and markers.
