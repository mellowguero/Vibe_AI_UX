import React from 'react'
import { Icon, IconProps } from '../Icon'
import { getSvgContent } from '../useSvgIcon'
import repeatSvg from '../svgs/24px/24px_Repeat24.svg?raw'

export function RepeatIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  const svgContent = getSvgContent(repeatSvg)
  
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <g dangerouslySetInnerHTML={{ __html: svgContent }} />
    </Icon>
  )
}

