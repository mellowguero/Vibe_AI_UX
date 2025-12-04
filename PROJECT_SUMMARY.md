# Agentic Modular UI Prototype

## Overview

A modular canvas-based UI system where draggable modules can be composed together. Modules transform and chain data when overlapped, creating dynamic workflows. Built with React/TypeScript and Vite.

## Core Architecture

- **Modular Canvas**: Draggable modules on a canvas with absolute positioning
- **Sidebar**: Module creation buttons
- **Inspector Panel**: Property editor for selected modules
- **Composition Engine**: Overlap detection with bidirectional data flow
- **Unified Schema**: `ModuleType` and `ModuleInstance` (id, type, x, y, z, data)

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

**UI Design:**
- Glassmorphism effect (frosted glass) with backdrop blur
- iMessage-style message bubbles
- Auto-scroll, conversation history

**Message Bubbles:**
- **User**: Purple-to-blue gradient (`#7d27ff → #278eff`), right-aligned, max-width 400px
- **AI**: Dark gradient (`#26252A → #352965`), left-aligned, max-width 400px
- **Tail Variants**: `.tail-top` and `.tail-bottom` for message grouping
- **Typography**: Satoshi Medium font, 14px, `#f6f3ff` text color

**Features:**
- Nested modules (preview/expanded views)
- Drag-out to canvas (button + drag handle)
- Auto-song recommendations with YouTube integration
- OpenAI integration with "Alex Oskie" character

## Composition Rules

Modules transform data when overlapped:

- **Image** → Text (append URL), → Map (use label), → Search (use label)
- **Text** → Media (song title), → Map (location query), → Search (query)
- **Music Player** → Text (track info), → Search (full/artist only), → Image (artist/band)
- **Map** → Search (location query), → Text (add location)
- **Search** → Map (with description), → Text (query/results), → Media (track title), → Image (from query)
- **Chat** ← Media (song recommendation), ← Text (message), → Media (extract), → Text (extract)

## API Integrations

- **DuckDuckGo**: Search (no API key required)
- **Unsplash**: Image search
- **Google Custom Search**: Image search (alternative)
- **YouTube Data API v3**: Music video search
- **Google Maps**: Geocoding + Interactive maps
- **OpenAI Chat Completions**: AI conversations

## File Structure

```
src/
├── App.tsx                 # Main app, drag/drop, composition logic
├── main.tsx                # React entry point
├── index.css               # App layout, imports modules.css
├── components/
│   ├── ChatModule.tsx      # Chat with AI integration
│   ├── ModuleCard.tsx       # Draggable module wrapper
│   ├── Inspector.tsx        # Property editor
│   ├── ImageModule.tsx
│   ├── MediaModule.tsx
│   ├── TextModule.tsx
│   ├── MapModule.tsx
│   ├── SearchModule.tsx
│   └── CompositionMenu.tsx
├── compositionRules.ts     # All composition transformations
├── types/
│   └── modules.ts          # Type definitions
├── api/
│   └── services.ts         # API integrations
├── utils/
│   └── textParsing.ts      # Text extraction utilities
└── styles/
    └── modules.css         # Shared module content styles

playground.html/css         # Design system playground
```

## CSS Architecture

**Shared Styles System:**
- `src/styles/modules.css` - All module content styles (chat bubbles, messages, module internals) - **SHARED** between playground and React app
- `src/index.css` - App layout only, imports `modules.css`
- `playground.css` - Playground layout only, imports `modules.css`

**Import Chain:**
- React app: `index.html` → `main.tsx` → `index.css` → `@import './styles/modules.css'`
- Playground: `playground.html` → `playground.css` → `@import '../src/styles/modules.css'`

**Styling Workflow:**
1. Style module content in `playground.html` using production class names
2. Add/edit styles in `src/styles/modules.css`
3. Styles automatically apply to both playground and React app (no copying needed)
4. `playground.html` should only contain production components (no experimental/controls panels)

**Style Organization:**
- **Module Content** (modules.css): 
  - `.chat-module*`, `.chat-message*`, `.chat-input*`
  - `.image-module*`, `.media-module*`, `.text-module*`, `.map-module*`, `.search-module*`
  - `.nested-module*` content
  - All bubble gradients, tail variants, animations

**Key Module Styles:**
- Chat: Glassmorphism with backdrop blur, gradient bubbles, tail variants
- All modules: Consistent spacing, typography, and interaction states

## Running

```bash
npm run dev
```

Server: `http://localhost:5173`

## Development Notes

### Glassmorphism Implementation
- Chat module uses frosted glass effect: `backdrop-filter: blur(10px)`, semi-transparent backgrounds
- Background images on canvas for effect visibility
- Module card wrapper made transparent for chat module to allow glass effect

### Message Bubble Styling
- User bubbles: Purple-to-blue gradient (`linear-gradient(to right, #7d27ff 0%, #278eff 100%)`)
- AI bubbles: Dark gradient (`linear-gradient(to right, #26252A 0%, #352965 100%)`)
- Tail variants for visual grouping (`.tail-top`, `.tail-bottom`)
- Matches Figma design specifications

### Shared CSS System
- Single source of truth: `src/styles/modules.css`
- Both React app and playground import the same file
- No duplicate styles - automatic sync

## Future Work

- Spawn collision avoidance
- Module merging/linking
- Multi-select and grouping
- Workspace persistence
- OS-level chrome
- Agent-driven automation
- GUI/chrome styles extraction to `src/styles/gui.css` (future enhancement)

---

**Last Updated**: Created shared `src/styles/modules.css` with all module content styles. Both `src/index.css` and `playground.css` now import this shared file, eliminating duplicate code and ensuring consistent styling across both environments.
