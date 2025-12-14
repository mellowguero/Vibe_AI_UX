import React from 'react'
import { Icon, type IconProps } from '../Icon'

export function CollapseIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

