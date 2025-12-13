import React from 'react'
import { Icon, IconProps } from '../Icon'

export function CloseIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

