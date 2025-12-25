import React from 'react'
import { Icon, type IconProps } from '../Icon'
import { getSvgContent } from '../useSvgIcon'
import shuffleSvg from '../svgs/SVG_Icons/Shuffle.svg?raw'

export function ShuffleIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  const svgContent = getSvgContent(shuffleSvg)
  
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <g dangerouslySetInnerHTML={{ __html: svgContent }} />
    </Icon>
  )
}

