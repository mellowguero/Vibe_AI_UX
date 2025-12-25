import React from 'react'
import { Icon, type IconProps } from '../Icon'
import { getSvgContent } from '../useSvgIcon'
import playSvg from '../svgs/SVG_Icons/Play.svg?raw'

export function PlayIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  const svgContent = getSvgContent(playSvg)
  
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <g dangerouslySetInnerHTML={{ __html: svgContent }} />
    </Icon>
  )
}

