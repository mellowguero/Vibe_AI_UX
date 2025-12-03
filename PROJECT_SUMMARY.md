# Agentic Modular UI Prototype

## Core Architecture

- Modular canvas-based environment with draggable modules
- Sidebar for module creation, Inspector panel for editing
- Unified module schema: `ModuleType`, `ModuleInstance` (id, type, x, y, z, data)
- Composition engine with overlap detection and bidirectional data flow

## Modules

| Module | Key Features | APIs Required |
|--------|--------------|---------------|
| **Image** | Dual provider (Unsplash/Google Images), search, labels | `VITE_UNSPLASH_ACCESS_KEY`, `VITE_GOOGLE_API_KEY`, `VITE_GOOGLE_CSE_ID` |
| **Music Player** | YouTube integration, auto-search, URL detection | `VITE_YOUTUBE_API_KEY` |
| **Text** | Fully editable text container | None |
| **Map** | Google Maps with geocoding, interactive markers | `VITE_GOOGLE_MAPS_API_KEY` |
| **Search** | DuckDuckGo real-time search, music detection | None |
| **Chat** | AI conversations (OpenAI), nested modules, glassmorphism UI | `VITE_OPENAI_API_KEY` |

### Chat Module Details

- **UI**: iMessage-style with glassmorphism effect (frosted glass)
- **Message Bubbles**: 
  - User: Purple-to-blue gradient (#7d27ff → #278eff), right-aligned, max-width 400px
  - AI: Dark gradient (#26252A → #352965), left-aligned, max-width 400px
  - Tail variants (top/bottom) for message grouping
  - Satoshi Medium font, 14px, #f6f3ff text color
- **Glass Effect**: Backdrop blur, customizable via interactive controls panel
- **Features**: Nested modules, drag-out to canvas, auto-scroll, conversation history

## Composition Rules

**Image**: → Text (append URL), → Map (use label), → Search (use label)  
**Text**: → Media (song title), → Map (location query), → Search (query)  
**Music Player**: → Text (track info), → Search (full/artist only), → Image (artist/band)  
**Map**: → Search (location query), → Text (add location)  
**Search**: → Map (with description), → Text (query/results), → Media (track title), → Image (from query)  
**Chat**: ← Media (song recommendation), ← Text (message), → Media (extract), → Text (extract)

## API Integrations

- **DuckDuckGo**: Search (no key)
- **Unsplash**: Image search
- **Google Custom Search**: Image search (alternative)
- **YouTube Data API v3**: Music video search
- **Google Maps**: Geocoding + Interactive maps
- **OpenAI Chat Completions**: AI conversations

## Recent Updates

### Glassmorphism Chat Container (Latest)

- **Glass Styling Applied**: Both React app (`src/index.css`) and playground (`playground.css`) now feature glassmorphism effects
  - **React App**: Chat module uses frosted glass with `backdrop-filter: blur(10px)`, semi-transparent backgrounds
  - **Playground**: Full modal chat container with glass effect (280px-506px width, 24px border-radius, 16px padding)
  - Container: 24px border-radius, 16px padding, glass border and shadow
  - Messages area: Transparent background, scrollable
  - Input area: Glass effect with 32px border-radius, transparent input field
  - Send button: Glass effect with blur and hover states

- **Background Images**: 
  - React app: Background image added to `.canvas-container` for glass effect visibility
  - Playground: Background image on `.state-group.full-width` and `.chat-container-bg`

- **Module Card Wrapper**: Chat module card (`.module-card.chat-module-card`) made transparent with no border/box-shadow to allow glass effect

- **Interactive Glass Controls Panel** (Playground): Real-time customization
  - Light: Intensity (0-100%)
  - Glass properties: Refraction, Depth, Dispersion, Frost (0-100 each)
  - Background: RGB sliders (0-255 each)
  - Border: Width (0-5px)
  - Shadow: Blur (0-50px), Spread (0-20px)
  - Effects: Saturation (0-200%), Brightness (0-200%)
  - All controls scoped to `chat-container-bg` container only

### Shared Module Styles

- **Unified Styling**: Both `src/index.css` and `playground.css` now share identical module styles
  - Image Module: `.image-module`, `.image-preview`, `.image-placeholder`, `.image-label`
  - Media Module: `.media-module`, `.media-placeholder`, `.media-title`
  - Text Module: `.text-module`
  - Map Module: `.map-module`, `.map-view`, `.map-view-title`, `.map-view-placeholder`, `.map-view-empty`, `.map-view-loading`, `.map-view-error`
  - Search Module: `.search-module`, `.search-results`, `.search-results-title`, `.search-results-empty`, `.search-results-list`, `.search-result-item`, `.search-result-title`, `.search-result-snippet`
  - Chat Module: `.chat-module` (React app), `.chat-module-example` and `.chat-module-full` (playground)

### Message Bubble Styling

- AI bubbles: Dark gradient (#26252A → #352965), tail variants, 400px max-width
- User bubbles: Purple-blue gradient (#7d27ff → #278eff), tail variants, 400px max-width
- Comprehensive playground examples in `playground.html` and `playground.css`
- Matches Figma design specifications

### Chat Module with AI Friend

- OpenAI integration with "Alex Oskie" character
- Nested module support (preview/expanded views)
- Drag-out functionality (button + drag handle)
- Auto-song recommendations with YouTube integration

## File Structure

```
src/
├── App.tsx                 # Main app, drag/drop, composition logic
├── components/
│   ├── ChatModule.tsx      # Chat with AI integration
│   ├── ModuleCard.tsx      # Draggable module wrapper
│   ├── Inspector.tsx       # Property editor
│   └── [Other modules].tsx
├── compositionRules.ts     # All composition transformations
├── types/modules.ts        # Type definitions
├── api/services.ts         # API integrations
└── utils/textParsing.ts    # Text extraction utilities

playground.html/css         # Design system playground with glass controls
```

## Running

```bash
npm run dev
```

Server: `http://localhost:5173`

## Future Work

- Spawn collision avoidance
- Module merging/linking
- Multi-select and grouping
- Workspace persistence
- OS-level chrome
- Agent-driven automation

---

**Last Updated**: Applied glassmorphism styling to chat module in both React app (`src/index.css`) and playground (`playground.css`). Added background image to canvas container in React app. Unified module styles across both files - all 6 module types (Image, Media, Text, Map, Search, Chat) now share identical styling. Chat module card wrapper made transparent to allow glass effect. Previous: Glassmorphism chat container with interactive controls panel in playground.
