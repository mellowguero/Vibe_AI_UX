# Agentic Modular UI Prototype

A modular canvas-based environment for building agentic user interfaces. This prototype demonstrates how modules can compose, transform, and chain data flows to create dynamic, context-aware interactions.

## Quick Start

```bash
npm install
npm run dev
```

The dev server runs on `localhost` (typically `http://localhost:5173`).

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
- **Music Player**: Audio player with track info
- **Text**: Editable text notes
- **Map**: Location queries and descriptions
- **Search**: Search queries (UI-ready for API integration)

## Composition Examples

- Text → Search → Map → Text (full loop)
- Music Player → Image (find artist/band image)
- Search → Music Player (use query as track title)
- And many more bidirectional flows...

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS Modules

---

**This is the active development repository.** All work is saved here and synced to GitHub.

