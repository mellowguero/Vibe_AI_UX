/**
 * Layout configuration types for dynamic component layouts
 */

export type LayoutDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
export type LayoutAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
export type LayoutJustify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
export type LayoutPosition = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'

export interface LayoutSpacing {
  margin?: string
  marginTop?: string
  marginRight?: string
  marginBottom?: string
  marginLeft?: string
  padding?: string
  paddingTop?: string
  paddingRight?: string
  paddingBottom?: string
  paddingLeft?: string
  gap?: string
}

export interface LayoutSize {
  width?: string
  height?: string
  minWidth?: string
  minHeight?: string
  maxWidth?: string
  maxHeight?: string
}

export interface LayoutFlex {
  direction?: LayoutDirection
  align?: LayoutAlign
  justify?: LayoutJustify
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  grow?: number
  shrink?: number
  basis?: string
}

export interface LayoutGrid {
  columns?: string
  rows?: string
  gap?: string
  columnGap?: string
  rowGap?: string
  area?: string
  column?: string
  row?: string
}

export interface LayoutPositioning {
  position?: LayoutPosition
  top?: string
  right?: string
  bottom?: string
  left?: string
  zIndex?: number
}

export interface ResponsiveBreakpoint {
  sm?: Partial<ComponentLayout>
  md?: Partial<ComponentLayout>
  lg?: Partial<ComponentLayout>
  xl?: Partial<ComponentLayout>
  '2xl'?: Partial<ComponentLayout>
}

/**
 * Base layout configuration for components
 */
export interface ComponentLayout {
  spacing?: LayoutSpacing
  size?: LayoutSize
  flex?: LayoutFlex
  grid?: LayoutGrid
  positioning?: LayoutPositioning
  responsive?: ResponsiveBreakpoint
}

/**
 * MediaPreviewWindow specific layout configuration
 */
export interface MediaPreviewWindowLayout extends ComponentLayout {
  aspectRatio?: string
  borderRadius?: string
  overlayOpacity?: number
}

/**
 * AudioProgressBar specific layout configuration
 */
export interface AudioProgressBarLayout extends ComponentLayout {
  trackHeight?: string
  handleSize?: string
  showHandle?: boolean
}

/**
 * SongTitle specific layout configuration
 */
export interface SongTitleLayout extends ComponentLayout {
  textAlign?: 'left' | 'center' | 'right'
  timePosition?: 'inline' | 'separate' | 'hidden'
}

/**
 * MediaControls specific layout configuration
 */
export interface MediaControlsLayout extends ComponentLayout {
  buttonOrder?: string[]
  buttonSpacing?: string
  orientation?: 'horizontal' | 'vertical'
}

/**
 * MediaModule container layout configuration
 */
export interface MediaModuleLayout extends ComponentLayout {
  componentOrder?: string[]
  previewWindowLayout?: MediaPreviewWindowLayout
  progressBarLayout?: AudioProgressBarLayout
  songTitleLayout?: SongTitleLayout
  controlsLayout?: MediaControlsLayout
}
