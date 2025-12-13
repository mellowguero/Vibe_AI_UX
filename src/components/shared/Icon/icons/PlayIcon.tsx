import React from 'react'
import { Icon, IconProps } from '../Icon'

export function PlayIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <path
        d="M19.5467 10.62C20.6228 11.2253 20.6228 12.7747 19.5467 13.38L8.35958 19.6727C7.30413 20.2664 6 19.5037 6 18.2927L6 5.70726C6 4.49628 7.30412 3.73357 8.35958 4.32726L19.5467 10.62Z"
        fill="currentColor"
      />
    </Icon>
  )
}

