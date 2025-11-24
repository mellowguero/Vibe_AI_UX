# Agentic Modular UI Prototype

A modular canvas-based environment for building agentic user interfaces. This prototype demonstrates how modules can compose, transform, and chain data flows to create dynamic, context-aware interactions.

## Quick Start

```bash
npm install
npm run dev
```

The dev server runs on `localhost` (typically `http://localhost:5173`).

### API Setup (Optional)

**Search API**: Uses DuckDuckGo Instant Answer API (no key needed) - works out of the box!

**Image Search API**: Uses Unsplash API (free tier, key required):
1. Get a free API key from [Unsplash Developers](https://unsplash.com/developers)
2. Create a `.env` file in the project root
3. Add: `VITE_UNSPLASH_ACCESS_KEY=your_key_here`
4. Restart the dev server

**YouTube Music API**: Uses YouTube Data API v3 (free tier, key required):
1. Get a free API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "YouTube Data API v3" for your project
2. Add to your `.env` file: `VITE_YOUTUBE_API_KEY=your_key_here`
3. Restart the dev server

Without API keys, those features will be disabled but other features work fine.

## Project Overview

See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for complete documentation of:
- Architecture and module system
- All implemented composition rules
- Interaction patterns
- Future roadmap

## Key Features

- **Modular Canvas**: Drag-and-drop modules on an infinite canvas
- **Composition Engine**: Modules can transform and chain data when overlapped
- **Rich Module Types**: Image, Music Player, Text, Map, Search
- **Inspector Panel**: Edit module properties in real-time
- **Agentic Chains**: Modules flow data between each other creating dynamic workflows

## Module Types

- **Image**: Display images with labels
- **Music Player**: YouTube music player - search and play music automatically
- **Text**: Editable text notes
- **Map**: Location queries and descriptions
- **Search**: Real-time search with DuckDuckGo API (auto-searches as you type)

## Composition Examples

- Text → Search → Map → Text (full loop with real search results)
- Text → Music Player (auto-searches YouTube for the song)
- Search → Music Player (use query as track title, auto-finds on YouTube)
- Music Player → Image (find artist/band image via Unsplash)
- And many more bidirectional flows with real API integrations...

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS Modules

---

**This is the active development repository.** All work is saved here and synced to GitHub.

