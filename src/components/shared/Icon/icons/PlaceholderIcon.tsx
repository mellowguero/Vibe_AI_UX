import React from 'react'
import { Icon, type IconProps } from '../Icon'
import { getSvgContent } from '../useSvgIcon'
import placeholderSvg from '../svgs/SVG_Icons/Placeholder.svg?raw'

export function PlaceholderIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  const svgContent = getSvgContent(placeholderSvg)
  
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <g dangerouslySetInnerHTML={{ __html: svgContent }} />
    </Icon>
  )
}

