import React from 'react'
import { Icon, IconProps } from '../Icon'
import { getSvgContent } from '../useSvgIcon'
import sendSvg from '../svgs/24px/24px_Send24.svg?raw'

export function SendIcon(props: Omit<IconProps, 'children' | 'viewBox'>) {
  const svgContent = getSvgContent(sendSvg)
  
  return (
    <Icon {...props} viewBox="0 0 24 24">
      <g dangerouslySetInnerHTML={{ __html: svgContent }} />
    </Icon>
  )
}

