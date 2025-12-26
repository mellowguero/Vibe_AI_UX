import React from 'react'
import { Icon, type IconProps } from '../Icon'
import { getSvgContent } from '../useSvgIcon'
import pauseSvg from '../svgs/SVG_Icons/Pause.svg?raw'

export function PauseIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  const svgContent = getSvgContent(pauseSvg)
  
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <g dangerouslySetInnerHTML={{ __html: svgContent }} />
    </Icon>
  )
}

