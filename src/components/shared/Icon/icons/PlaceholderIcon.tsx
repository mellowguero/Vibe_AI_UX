import React from 'react'
import { Icon, IconProps } from '../Icon'
import { getSvgContent } from '../useSvgIcon'
import placeholderSvg from '../svgs/24px/24px_Placeholder24.svg?raw'

export function PlaceholderIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  const svgContent = getSvgContent(placeholderSvg)
  
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <g dangerouslySetInnerHTML={{ __html: svgContent }} />
    </Icon>
  )
}

