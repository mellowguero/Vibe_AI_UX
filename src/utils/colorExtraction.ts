import ColorThief from 'colorthief'

// Cache for extracted colors to avoid re-extracting same images
const colorCache = new Map<string, { dominant: { r: number; g: number; b: number } | null; palette: Array<{ r: number; g: number; b: number }> | null }>()

/**
 * Loads an image from URL and returns the Image element
 * Handles CORS by setting crossOrigin attribute
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    // Set CORS attribute to allow cross-origin images
    img.crossOrigin = 'anonymous'
    
    img.onload = () => resolve(img)
    img.onerror = (error) => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
}

/**
 * Converts RGB array [r, g, b] to object format
 */
function rgbArrayToObject(rgb: [number, number, number]): { r: number; g: number; b: number } {
  return { r: rgb[0], g: rgb[1], b: rgb[2] }
}

/**
 * Extracts the dominant color from an image URL
 * @param imageUrl - URL of the image to extract color from
 * @returns RGB color object or null if extraction fails
 */
export async function extractDominantColor(
  imageUrl: string
): Promise<{ r: number; g: number; b: number } | null> {
  if (!imageUrl) return null

  // Check cache first
  const cached = colorCache.get(imageUrl)
  if (cached?.dominant) {
    return cached.dominant
  }

  try {
    const img = await loadImage(imageUrl)
    const colorThief = new ColorThief()
    
    // Wait for image to be fully loaded
    if (!img.complete) {
      await new Promise((resolve) => {
        img.onload = resolve
      })
    }

    const rgb = colorThief.getColor(img)
    const color = rgbArrayToObject(rgb)

    // Cache the result
    const existingCache = colorCache.get(imageUrl) || { dominant: null, palette: null }
    colorCache.set(imageUrl, { ...existingCache, dominant: color })

    return color
  } catch (error) {
    console.error('Error extracting dominant color:', error)
    return null
  }
}

/**
 * Extracts a color palette from an image URL
 * @param imageUrl - URL of the image to extract colors from
 * @param colorCount - Number of colors to extract (default: 5)
 * @returns Array of RGB color objects or empty array if extraction fails
 */
export async function extractColorPalette(
  imageUrl: string,
  colorCount: number = 5
): Promise<Array<{ r: number; g: number; b: number }>> {
  if (!imageUrl) return []

  // Check cache first (only if colorCount matches default of 5 for simplicity)
  // For different colorCounts, we'll re-extract
  if (colorCount === 5) {
    const cached = colorCache.get(imageUrl)
    if (cached?.palette) {
      return cached.palette
    }
  }

  try {
    const img = await loadImage(imageUrl)
    const colorThief = new ColorThief()
    
    // Wait for image to be fully loaded
    if (!img.complete) {
      await new Promise((resolve) => {
        img.onload = resolve
      })
    }

    const palette = colorThief.getPalette(img, colorCount)
    const colors = palette.map(rgbArrayToObject)

    // Cache the result (only for default colorCount)
    if (colorCount === 5) {
      const existingCache = colorCache.get(imageUrl) || { dominant: null, palette: null }
      colorCache.set(imageUrl, { ...existingCache, palette: colors })
    }

    return colors
  } catch (error) {
    console.error('Error extracting color palette:', error)
    return []
  }
}

/**
 * Converts RGB color object to rgba() string
 */
export function rgbToRgba(rgb: { r: number; g: number; b: number }, opacity: number = 1): string {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
}

/**
 * Converts RGB color object to hex string
 */
export function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => {
    const hex = n.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

/**
 * Converts RGB color object to rgb() string
 */
export function rgbToRgb(rgb: { r: number; g: number; b: number }): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

