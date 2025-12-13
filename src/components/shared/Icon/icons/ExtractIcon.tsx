import React from 'react'
import { Icon, IconProps } from '../Icon'

export function ExtractIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <path
        d="M7 17L17 7M7 7h10v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

