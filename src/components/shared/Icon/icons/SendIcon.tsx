import React from 'react'
import { Icon, type IconProps } from '../Icon'
import { getSvgContent } from '../useSvgIcon'
import sendSvg from '../svgs/SVG_Icons/Send.svg?raw'

export function SendIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  const svgContent = getSvgContent(sendSvg)
  
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <g dangerouslySetInnerHTML={{ __html: svgContent }} />
    </Icon>
  )
}

