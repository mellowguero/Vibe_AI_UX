import React from 'react'

/**
 * Extracts SVG inner content and processes it for React
 * Converts fill/stroke to currentColor and kebab-case to camelCase
 */
export function getSvgContent(svgString: string): string {
  // Extract content between <svg> tags
  const svgMatch = svgString.match(/<svg[^>]*>([\s\S]*)<\/svg>/i)
  if (!svgMatch) return ''

  let content = svgMatch[1].trim()

  // Replace fill and stroke colors with currentColor (but keep "none")
  content = content.replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"')
  content = content.replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"')

  // Convert kebab-case attributes to camelCase for React (handles multiple hyphens)
  content = content.replace(/(\w+(?:-\w+)+)="([^"]*)"/g, (match, attrName, attrValue) => {
    const camelCase = attrName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    return `${camelCase}="${attrValue}"`
  })

  return content
}
