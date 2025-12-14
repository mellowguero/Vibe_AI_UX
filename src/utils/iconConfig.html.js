/**
 * Component icon configuration for HTML files
 * Maps component names to icon names for easy icon swapping
 * 
 * To swap an icon for a component, change the icon name here:
 * Example: TextInput: 'PlayIcon' instead of 'SendIcon'
 */

import { getIconPath } from './iconPaths.js'

// Component to icon name mapping
// Change icons here to swap them globally across HTML files
const componentIcons = {
  TextInput: 'SendIcon', // Change this to update TextInput icon globally
  RoundButton: 'PlaceholderIcon', // Change this to update RoundButton icon globally
  // Add more component mappings as needed:
  // ChatInput: 'SendIcon',
}

/**
 * Gets the icon name for a component
 * @param {string} componentName - The name of the component (e.g., 'TextInput')
 * @returns {string} The icon name, or 'PlaceholderIcon' if not found
 */
export function getComponentIcon(componentName) {
  if (!componentName) {
    return 'PlaceholderIcon'
  }
  return componentIcons[componentName] || 'PlaceholderIcon'
}

/**
 * Gets the SVG file path for a component's icon
 * Combines component-to-icon mapping with icon-to-path mapping
 * @param {string} componentName - The name of the component (e.g., 'TextInput')
 * @returns {string} The path to the SVG file
 */
export function getComponentIconPath(componentName) {
  const iconName = getComponentIcon(componentName)
  return getIconPath(iconName)
}

/**
 * Gets all component icon mappings
 * @returns {Object} Object mapping component names to icon names
 */
export function getAllComponentIcons() {
  return { ...componentIcons }
}

/**
 * Initializes icon paths for elements with data attributes
 * Call this after DOM loads to set src attributes for:
 * - Elements with data-icon="IconName"
 * - Elements with data-component-icon="ComponentName"
 */
export function initializeIcons() {
  // Handle direct icon names: data-icon="SendIcon"
  document.querySelectorAll('[data-icon]').forEach(element => {
    const iconName = element.getAttribute('data-icon')
    if (iconName) {
      element.src = getIconPath(iconName)
    }
  })

  // Handle component icons: data-component-icon="TextInput"
  document.querySelectorAll('[data-component-icon]').forEach(element => {
    const componentName = element.getAttribute('data-component-icon')
    if (componentName) {
      element.src = getComponentIconPath(componentName)
    }
  })
}
