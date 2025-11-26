# **Agentic Modular UI Prototype — Project Summary**

## **1. Core Architecture**

- Modular canvas-based environment.
- Sidebar for module creation.
- Inspector panel for editing selected module.
- Unified module schema (ModuleType, ModuleInstance).
- Each module stores id, type, x, y, z, and data.

## **2. Implemented Modules**

### **Image Module**

- Fields: imageUrl, label, searchQuery, isLoading.
- Unsplash integration: Auto-searches Unsplash when you type in the search field (800ms debounce).
- Can search for images directly from the module (e.g., "mountain", "sunset", "cat").
- Also supports manual image URLs.
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

- Fields: locationQuery, description.
- Styled placeholder resembling a map view.

### **Search Module**

- Fields: query, optional results, isLoading.
- Real-time search with DuckDuckGo Instant Answer API (no key needed).
- Auto-searches as you type (500ms debounce).
- Detects music queries and provides helpful suggestions.

## **3. Interaction Model**

- Cards are draggable via header.
- Z-index stacking places active card on top.
- Modules can be selected, highlighted, and edited.
- Inspector updates all type-specific fields.
- Close button (X) in top-right corner of each module to delete it.

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
- Media → Image: Find image of artist/band (via Unsplash API)

**Search Module:**
- Search → Image: Find image from search query (via Unsplash API)

**Map Module:**
- Map → Search: Use map location as search query
- Map → Text: Add location to note

**Search Module:**
- Search → Map: Populate map from search query (adds description)
- Search → Text: Add search query to note
- Search → Text: Populate note with search results
- Search → Media: Use search query as track title
- Search → Image: Find image from search query (via Unsplash API)

### **Floating Composition Menu**

- Shows available actions when modules overlap.

## **5. API Integrations**

### **Search API (DuckDuckGo)**
- Real-time search with DuckDuckGo Instant Answer API.
- No API key required.
- Uses CORS proxy for browser compatibility.
- Returns instant answers, abstracts, and related topics.
- Detects music queries and provides helpful fallback messages.

### **Image Search API (Unsplash)**
- Searches for images via Unsplash API.
- Requires API key (free tier available).
- Used in Media → Image composition rule.
- Returns high-quality images with metadata.

### **YouTube Music API**
- Searches YouTube for music videos.
- Requires YouTube Data API v3 key (free tier available).
- Auto-searches when song title is entered in Music Player.
- Embeds YouTube player for playback.
- Supports manual audio URLs as fallback.

## **6. Composition Chains Enabled**

The system now supports rich composition chains:

- **Text → Search → Text** (loop)
- **Text → Search → Media** (Music Player)
- **Text → Search → Map → Text**
- **Media → Text → Search → Media**
- **Map → Text → Search → Map**
- **Media → Image** (find artist/band image)
- And many more combinations...

**Chain = agentic.** The system feels alive as modules can flow data between each other.

## **7. Recent Updates**

### **API Integrations (Latest Session)**

1. **Search API (DuckDuckGo)**: Real-time search with instant answers
2. **Image Search API (Unsplash)**: Find artist/band images via Media → Image
3. **YouTube Music API**: Auto-search and play music videos in Music Player

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
4. **Media → Text**: Add track info to note
5. **Media → Search** (2 actions): Search for full track, or extract artist name only
6. **Map → Text**: Add location to note
7. **Media → Image**: Find image of artist/band (via Unsplash API)

### **UI Updates**

- Renamed "Media" module to "Music Player" throughout the UI
- Added loading states to all API-integrated modules
- Better error handling and user feedback
- Improved placeholder text and help messages
- Added close button (X) to all modules for easy deletion
- Image module now has direct search input for Unsplash

### **Technical Improvements**

- Created `src/api/services.ts` for all API integrations
- Created `src/utils/textParsing.ts` for text extraction utilities
- Added `.env` file support for API keys (VITE_YOUTUBE_API_KEY, VITE_UNSPLASH_ACCESS_KEY, VITE_OPENAI_API_KEY)
- Fixed CORS issues with API calls
- Improved state management for async operations
- Enhanced YouTube integration: Music Player now stores full video title when YouTube finds a match
- Image module now supports direct Unsplash search with auto-complete

## **8. Project Plan & Roadmap**

### **Vision**
Build a foundational layer for an **agentic operating system** where modules are intelligent, composable building blocks that can autonomously transform and flow data between each other. The system should feel "alive" - modules understand context, suggest actions, and create dynamic workflows without explicit user commands.

### **Phase 1: Core Foundation** ✅ **COMPLETE**
- [x] Modular canvas-based UI
- [x] Drag-and-drop interaction model
- [x] Basic module types (Image, Text, Map, Search, Music Player)
- [x] Composition engine with overlap detection
- [x] Inspector panel for module editing
- [x] Basic composition rules

### **Phase 2: Real API Integrations** ✅ **COMPLETE**
- [x] Search API (DuckDuckGo)
- [x] Image Search API (Unsplash)
- [x] YouTube Music API
- [x] Loading states and error handling
- [x] Smart text parsing (artist extraction)

### **Phase 3: Enhanced Interactions** 🚧 **IN PROGRESS**
- [ ] Map API integration (real maps, geocoding, pins)
- [ ] Spawn collision avoidance (smart module placement)
- [ ] Module merging (combine modules into one)
- [ ] Multi-select and grouping
- [ ] Keyboard shortcuts
- [ ] Better animations/transitions

### **Phase 4: Intelligence & Automation** 📋 **PLANNED**
- [ ] Agent-driven actions (modules act autonomously)
- [ ] Context-aware suggestions (modules suggest relevant compositions)
- [ ] Smart composition chains (auto-detect and suggest workflows)
- [ ] Enhanced AI integration (beyond artist extraction)
- [ ] Module linking/graph visualization
- [ ] Workspace persistence (save/load states)

### **Phase 5: OS-Level Features** 📋 **FUTURE**
- [ ] OS-level chrome (dock, toolbar, spaces)
- [ ] Window management
- [ ] System integrations
- [ ] Multi-workspace support
- [ ] Collaboration features

## **9. Not Implemented Yet (Future Work)**

- Real map results / pins (Map API integration).
- Spawn collision avoidance.
- Module merging.
- Module linking or graph system.
- Multi-select and grouping.
- Workspace persistence.
- OS-level chrome (dock, toolbar, spaces).
- Agent-driven actions and automation.
- Enhanced AI integration (currently optional for artist extraction).

## **10. Current System Overview**

- Fully functional modular UI.
- Robust inspector.
- Comprehensive composition-based interactions.
- Expandable module schema.
- Rich bidirectional data flow between modules.
- A real foundational layer for an agentic OS.

## **11. Technical Details**

### **File Structure**

- `src/App.tsx` - Main application component with drag/drop and composition logic
- `src/components/` - Individual module components
- `src/compositionRules.ts` - All composition rules and transformations
- `src/types/modules.ts` - Type definitions for all modules
- `src/components/Inspector.tsx` - Module property editor
- `src/components/ModuleCard.tsx` - Wrapper for draggable modules
- `src/components/CompositionMenu.tsx` - Floating menu for composition actions
- `src/api/services.ts` - API service functions (Search, Images, YouTube)
- `src/utils/textParsing.ts` - Text extraction utilities (artist name, etc.)
- `.env` - Environment variables for API keys (not committed to git)

### **Running the Project**

```bash
npm run dev
```

The dev server runs on `localhost` (typically `http://localhost:5173`). VPN is not required for local development.

---

**Last Updated:** Latest session added close buttons to modules, direct Unsplash search in Image module, Search → Image composition rule, and improved YouTube title handling.

