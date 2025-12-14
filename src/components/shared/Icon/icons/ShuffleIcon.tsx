import React from 'react'
import { Icon, IconProps } from '../Icon'
import { getSvgContent } from '../useSvgIcon'
import shuffleSvg from '../svgs/24px/24px_Shuffle24.svg?raw'

export function ShuffleIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  const svgContent = getSvgContent(shuffleSvg)
  
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <g dangerouslySetInnerHTML={{ __html: svgContent }} />
    </Icon>
  )
}

