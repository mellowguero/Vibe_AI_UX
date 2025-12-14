import React from 'react'
import { Icon, IconProps } from '../Icon'
import { getSvgContent } from '../useSvgIcon'
import lastTrackSvg from '../svgs/24px/24px_Last_Track24.svg?raw'

export function LastTrackIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  const svgContent = getSvgContent(lastTrackSvg)
  
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <g dangerouslySetInnerHTML={{ __html: svgContent }} />
    </Icon>
  )
}

