# **Agentic Modular UI Prototype — Project Summary**

## **1. Core Architecture**

- Modular canvas-based environment.
- Sidebar for module creation.
- Inspector panel for editing selected module.
- Unified module schema (ModuleType, ModuleInstance).
- Each module stores id, type, x, y, z, and data.

## **2. Implemented Modules**

### **Image Module**

- Fields: imageUrl, label.
- Displays preview or placeholder.

### **Music Player Module** (formerly "Media Module")

- Fields: title, audioUrl.
- Built-in audio player.
- Display name: "Music Player" (internal type: `'media'`).

### **Text Module**

- Field: text.
- Fully editable text container.

### **Map Module**

- Fields: locationQuery, description.
- Styled placeholder resembling a map view.

### **Search Module**

- Fields: query, optional results.
- UI for search queries (no backend yet).

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
- Media → Search: Search for this track
- Media → Image: Find image of artist/band

**Map Module:**
- Map → Search: Use map location as search query
- Map → Text: Add location to note

**Search Module:**
- Search → Map: Populate map from search query (adds description)
- Search → Text: Add search query to note
- Search → Text: Populate note with search results
- Search → Media: Use search query as track title

### **Floating Composition Menu**

- Shows available actions when modules overlap.

## **5. Current Search Behavior**

- Search module is UI-only.
- No real search logic yet.
- Query updates but does not fetch or process results.

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

### **Added Composition Rules (Latest Session)**

1. **Search → Map**: Populate map from search query (with description)
2. **Search → Text** (2 actions): Add query to note, or populate with search results
3. **Search → Media**: Use search query as track title
4. **Media → Text**: Add track info to note
5. **Media → Search**: Search for this track
6. **Map → Text**: Add location to note
7. **Media → Image**: Find image of artist/band (uses track title as label)

### **UI Updates**

- Renamed "Media" module to "Music Player" throughout the UI:
  - Module card header
  - Sidebar button
  - Inspector panel
- Internal type remains `'media'` for type safety

## **8. Not Implemented Yet (Future Work)**

- Real API search.
- Real map results / pins.
- Real image search API (for Music Player → Image).
- Spawn collision avoidance.
- Module merging.
- Module linking or graph system.
- Multi-select and grouping.
- Workspace persistence.
- OS-level chrome (dock, toolbar, spaces).
- Agent-driven actions and automation.

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
- `src/CompositionMenu.tsx` - Floating menu for composition actions

### **Running the Project**

```bash
npm run dev
```

The dev server runs on `localhost` (typically `http://localhost:5173`). VPN is not required for local development.

---

**Last Updated:** Latest session added comprehensive composition rules and Music Player rebranding.

