/**
 * Icon path mapping for HTML files
 * Maps icon names to their SVG file paths
 * 
 * To add a new icon:
 * 1. Add the SVG file to src/components/shared/Icon/svgs/24px/
 * 2. Add the mapping here: IconName: 'src/components/shared/Icon/svgs/24px/filename.svg'
 */

const iconPaths = {
  SendIcon: 'src/components/shared/Icon/svgs/24px/24px_Send24.svg',
  PlayIcon: 'src/components/shared/Icon/svgs/24px/24px_Play24.svg',
  LastTrackIcon: 'src/components/shared/Icon/svgs/24px/24px_Last_Track24.svg',
  NextTrackIcon: 'src/components/shared/Icon/svgs/24px/24px_Next_Track24.svg',
  RepeatIcon: 'src/components/shared/Icon/svgs/24px/24px_Repeat24.svg',
  ShuffleIcon: 'src/components/shared/Icon/svgs/24px/24px_Shuffle24.svg',
  PlaceholderIcon: 'src/components/shared/Icon/svgs/24px/24px_Placeholder24.svg',
  // Note: CloseIcon, ExpandIcon, CollapseIcon, ExtractIcon, DragHandleIcon
  // don't have SVG files yet - they use inline SVG in React components
  // Add them here once SVG files are created
}

/**
 * Gets the SVG file path for an icon name
 * @param {string} iconName - The name of the icon (e.g., 'SendIcon')
 * @returns {string} The path to the SVG file, or PlaceholderIcon path if not found
 */
export function getIconPath(iconName) {
  if (!iconName) {
    return iconPaths.PlaceholderIcon
  }
  return iconPaths[iconName] || iconPaths.PlaceholderIcon
}

/**
 * Gets all available icon paths
 * @returns {Object} Object mapping icon names to paths
 */
export function getAllIconPaths() {
  return { ...iconPaths }
}

