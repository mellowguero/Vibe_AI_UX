import React from 'react'
import { Icon, IconProps } from '../Icon'

export function PlaceholderIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </Icon>
  )
}

