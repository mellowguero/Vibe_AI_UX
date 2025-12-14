import React from 'react'
import type { IconName } from '../types/modules'
import * as Icons from '../components/shared/Icon'

/**
 * Maps icon names to their React components
 * This allows us to dynamically select icons based on configuration
 */
const iconMap: Record<IconName, React.ComponentType<any>> = {
  SendIcon: Icons.SendIcon,
  LastTrackIcon: Icons.LastTrackIcon,
  NextTrackIcon: Icons.NextTrackIcon,
  PlayIcon: Icons.PlayIcon,
  RepeatIcon: Icons.RepeatIcon,
  ShuffleIcon: Icons.ShuffleIcon,
  PlaceholderIcon: Icons.PlaceholderIcon,
  CloseIcon: Icons.CloseIcon,
  ExpandIcon: Icons.ExpandIcon,
  CollapseIcon: Icons.CollapseIcon,
  ExtractIcon: Icons.ExtractIcon,
  DragHandleIcon: Icons.DragHandleIcon,
}

/**
 * Gets an icon component by name
 * @param iconName - The name of the icon from the IconName type
 * @returns The icon component, or PlaceholderIcon as fallback
 */
export function getIconComponent(iconName: IconName): React.ComponentType<any> {
  return iconMap[iconName] || Icons.PlaceholderIcon
}

/**
 * Renders an icon component by name with props
 * @param iconName - The name of the icon
 * @param props - Props to pass to the icon component
 * @returns A React element of the icon
 */
export function renderIcon(iconName: IconName, props?: any): React.ReactElement {
  const IconComponent = getIconComponent(iconName)
  return <IconComponent {...props} />
}
