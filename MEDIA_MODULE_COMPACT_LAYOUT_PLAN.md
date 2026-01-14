# MediaModule Compact Layout Implementation Plan

## Overview
When the MediaModule is vertically constrained (sized down), it should transition from the current **expanded vertical layout** to a **compact horizontal layout** matching the Figma design at node `286:850`.

## Current State Analysis

### Existing Components & Variants
- ✅ `MediaPreviewWindow` - Already supports `isExpanded` prop (collapsed = 56px square)
- ✅ `SongTitle` - Already supports variants: `'master' | 'chat' | 'collapsed'`
- ✅ `MediaControls` - Already supports variants: `'Full' | 'Partial' | 'Chat'`
- ✅ CSS already has collapsed album artwork styles (56px) defined

### Current Layout Structure (Expanded)
```
media-module--standalone
├── MediaPreviewWindow (expanded, full width)
└── media-module-controller
    ├── media-module-controller-progress
    │   └── AudioProgressBar
    └── media-module-controller-controls
        ├── media-module-controller-song-title
        │   └── SongTitle (master variant)
        └── MediaControls (Full variant)
```

### Target Layout Structure (Compact - from Figma)
```
MediaPlayers (Master Compact)
├── Music Content (flex, horizontal, gap-8px)
│   ├── Album Artwork (56px square, rounded)
│   └── SongTitlePlayer (Collapsed/Chat variant, flex-1)
└── MediaControls (Partial variant, horizontal)
```

## Implementation Steps

### Step 0: Add Bottom-Right Corner Resize Handle
**Goal:** Add a resize handle in the bottom-right corner that allows resizing both width and height

**Current State:**
- Resize handle exists on the right edge (full height) - only handles horizontal (width) resizing
- Located at lines 1053-1059 in `MediaModule.tsx`
- CSS positions it: `position: absolute; top: 0; right: 0; width: 6px; height: 100%; cursor: ew-resize;`

**Tasks:**
- Add a new corner resize handle in the bottom-right corner
- Update resize logic to handle both horizontal (width) and vertical (height) resizing
- Add state for module height: `const [moduleHeight, setModuleHeight] = useState<number | null>(null)`
- Add refs for vertical resize tracking: `resizeStartYRef`, `resizeStartHeightRef`
- Update `handleResizeStart` to detect which handle was clicked (edge vs corner)
- Update mouse move handler to calculate both `deltaX` and `deltaY`
- Apply both width and height changes to module style
- Define min/max constraints for height (e.g., MIN_HEIGHT = 72px for compact, MAX_HEIGHT = 600px)

**Files to modify:**
- `src/components/modules/MediaModule/MediaModule.tsx`
  - Add height state and refs
  - Update resize handlers
  - Add corner resize handle element
- `src/styles/gui.css`
  - Add `.module-resize-handle-corner` styles
  - Position: `bottom: 0; right: 0; width: 12px; height: 12px;`
  - Cursor: `nwse-resize` (diagonal resize)
  - Style similar to existing handle with hover states

**Implementation details:**
```tsx
// State additions
const [moduleHeight, setModuleHeight] = useState<number | null>(null)
const resizeStartYRef = useRef<number>(0)
const resizeStartHeightRef = useRef<number>(0)
const resizeDirectionRef = useRef<'width' | 'height' | 'both' | null>(null)

// Updated handleResizeStart
const handleResizeStart = (e: React.MouseEvent, direction: 'width' | 'height' | 'both') => {
  // Track direction and initial positions
  resizeDirectionRef.current = direction
  // ... existing logic plus height tracking
}

// Updated mouse move handler
const handleMouseMove = (e: MouseEvent) => {
  if (resizeDirectionRef.current === 'both') {
    // Calculate both width and height changes
    const deltaX = e.clientX - resizeStartXRef.current
    const deltaY = e.clientY - resizeStartYRef.current
    // Apply constraints and update both dimensions
  }
  // ... handle other directions
}
```

**CSS additions:**
```css
.module-resize-handle-corner {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  cursor: nwse-resize;
  z-index: 11;
  background-color: transparent;
  transition: background-color 0.2s;
}

.media-module--standalone:hover .module-resize-handle-corner {
  background-color: rgba(76, 141, 255, 0.3);
}

.module-resize-handle-corner:hover {
  background-color: rgba(76, 141, 255, 0.5) !important;
}

.module-resize-handle-corner:active {
  background-color: rgba(76, 141, 255, 0.7) !important;
}
```

**Considerations:**
- Keep existing right-edge handle for width-only resizing (optional - could remove if corner handle is sufficient)
- Corner handle should be visually distinct or positioned to avoid conflicts
- Ensure proper z-index layering (corner handle above edge handle)
- Test resize behavior at module boundaries

---

### Step 1: Add Height Detection Logic
**Goal:** Detect when module height is constrained and trigger compact mode

**Tasks:**
- Add `ResizeObserver` or `useEffect` to monitor module height via `moduleRef`
- Define threshold (e.g., ~150px or ~200px) to trigger compact mode
- Add state: `const [isCompact, setIsCompact] = useState(false)`
- Update state when height crosses threshold

**Files to modify:**
- `src/components/modules/MediaModule/MediaModule.tsx`

**Considerations:**
- Use `ResizeObserver` for better performance
- Add debounce/throttle if needed
- Consider minimum height for expanded layout

---

### Step 2: Create Compact Layout Structure
**Goal:** Render horizontal compact layout when `isCompact === true`

**Tasks:**
- Create conditional rendering for compact vs expanded layout
- When `isCompact === true`:
  - Render horizontal flex container with gap-8px
  - Show `MediaPreviewWindow` with `isExpanded={false}` (56px square)
  - Show `SongTitle` with variant `'collapsed'`
  - Show `MediaControls` with variant `'Partial'`
  - Hide `AudioProgressBar` completely
- When `isCompact === false`:
  - Keep existing expanded layout structure

**Files to modify:**
- `src/components/modules/MediaModule/MediaModule.tsx`

**Structure:**
```tsx
{isCompact ? (
  // Compact horizontal layout
  <div className="media-module-content media-module-content--compact">
    <MediaPreviewWindow isExpanded={false} ... />
    <SongTitle variant="collapsed" ... />
    <MediaControls variant="Partial" ... />
  </div>
) : (
  // Existing expanded layout
  <>
    <MediaPreviewWindow isExpanded={true} ... />
    <div className="media-module-controller">
      ...
    </div>
  </>
)}
```

---

### Step 3: Update CSS for Compact Layout
**Goal:** Style the compact layout to match Figma design

**Tasks:**
- Add `.media-module-content--compact` styles
- Horizontal flex layout: `display: flex; flex-direction: row; align-items: center; gap: 8px;`
- Ensure 56px album art sizing (already exists in CSS)
- Match Figma spacing and alignment
- Ensure proper text truncation for song title
- Add padding/spacing to match design

**Files to modify:**
- `src/styles/modules.css`

**Key CSS classes to add:**
```css
.media-module-content--compact {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px; /* or as per design */
}

.media-module-content--compact .media-preview-window {
  flex-shrink: 0;
}

.media-module-content--compact .song-title {
  flex: 1;
  min-width: 0; /* Allow text truncation */
}
```

---

### Step 4: Add Smooth Transitions
**Goal:** Ensure smooth layout transitions without jumps

**Tasks:**
- Add CSS transitions for layout changes
- Consider `transition` properties for height/width changes
- Ensure no content flash during state changes
- Test transition smoothness

**Files to modify:**
- `src/styles/modules.css`

**Considerations:**
- Use `transition: all 0.2s ease` or similar
- May need to handle overflow during transition
- Consider `will-change` for performance

---

### Step 5: Test and Refine
**Goal:** Verify implementation matches design and works at all sizes

**Tasks:**
- Test at different module heights (resize manually)
- Verify spacing matches Figma design
- Test with different song title lengths (truncation)
- Ensure all variants work correctly
- Test in both standalone and chat contexts (if applicable)
- Verify no layout jumps or content overflow

**Testing checklist:**
- [ ] Compact mode triggers at correct height threshold
- [ ] Expanded mode shows when height is sufficient
- [ ] Album artwork is 56px in compact mode
- [ ] Song title truncates properly
- [ ] Controls show Partial variant in compact mode
- [ ] Progress bar is hidden in compact mode
- [ ] Spacing matches Figma (8px gaps)
- [ ] Layout transitions smoothly
- [ ] Works with different content lengths

---

## Technical Details

### Height Threshold
**Proposed:** ~150px - 200px
- Below threshold: Compact mode
- Above threshold: Expanded mode
- May need to adjust based on actual content heights

### Component Variants Mapping
| Mode | MediaPreviewWindow | SongTitle | MediaControls | ProgressBar |
|------|-------------------|-----------|---------------|-------------|
| Expanded | `isExpanded={true}` | `variant="master"` | `variant="Full"` | Visible |
| Compact | `isExpanded={false}` | `variant="collapsed"` | `variant="Partial"` | Hidden |

### Figma Reference
- **Node ID:** `286:850`
- **Variant:** "Master Compact"
- **Layout:** Horizontal flex with 8px gap
- **Album Art:** 56px × 56px, rounded 8px
- **Song Title:** Collapsed variant (stacked song/artist)
- **Controls:** Partial variant (Previous, Play, Next only)

---

## Notes
- Keep existing expanded layout unchanged when not in compact mode
- Ensure backward compatibility
- Consider adding this as a prop option if needed: `compactMode?: 'auto' | 'always' | 'never'`
- May need to adjust threshold based on actual testing
- **Resize Handle**: The bottom-right corner handle allows manual resizing of both width and height. When height is manually reduced below the threshold, compact mode will automatically trigger via Step 1's height detection logic.

---

## Next Steps
1. Start with **Step 0**: Add bottom-right corner resize handle for width + height resizing
2. Then **Step 1**: Add height detection and `isCompact` state
3. Then **Step 2**: Create compact layout JSX structure  
4. Then **Step 3**: Add CSS styles
5. Finally: Test and refine
