// Text parsing utilities for extracting structured data from text

/**
 * Extracts artist name from a song title using pattern matching
 * Handles formats like:
 * - "Artist - Song"
 * - "Artist: Song"
 * - "Artist | Song"
 * - "Artist feat. Other - Song"
 */
export function extractArtistName(title: string): string {
  if (!title || !title.trim()) return title

  const trimmed = title.trim()

  // Common separators: " - ", " : ", " | ", " – " (en dash), " — " (em dash)
  const separators = [
    / - /,
    / : /,
    / \| /,
    / – /,  // en dash
    / — /,  // em dash
    / -/,    // dash at end of word
    /:/,     // colon
  ]

  for (const separator of separators) {
    const parts = trimmed.split(separator)
    if (parts.length >= 2) {
      // Take the first part as artist, clean it up
      let artist = parts[0].trim()
      
      // Remove common prefixes/suffixes
      artist = artist.replace(/^(feat\.|ft\.|featuring|with|&|and)\s+/i, '')
      artist = artist.replace(/\s+(feat\.|ft\.|featuring|with|&|and).*$/i, '')
      
      // If artist part is reasonable length (not too short, not too long)
      if (artist.length > 2 && artist.length < 100) {
        return artist
      }
    }
  }

  // If no separator found, return the whole thing (might just be artist name)
  return trimmed
}

/**
 * Uses AI (OpenAI) to intelligently extract artist name from song title
 * Falls back to pattern matching if AI is unavailable
 */
export async function extractArtistNameWithAI(title: string): Promise<string> {
  // First try pattern matching (fast, free)
  const patternResult = extractArtistName(title)
  
  // If pattern matching found a clear result, use it
  if (patternResult !== title && patternResult.length < title.length * 0.8) {
    return patternResult
  }

  // Try AI if available
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    // No AI key, return pattern result
    return patternResult
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Extract only the artist name from a song title. Return just the artist name, nothing else. If unclear, return the first part before any dash or colon.',
          },
          {
            role: 'user',
            content: title,
          },
        ],
        max_tokens: 50,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error('AI extraction failed')
    }

    const data = await response.json()
    const aiResult = data.choices[0]?.message?.content?.trim()
    
    if (aiResult && aiResult.length > 0) {
      return aiResult
    }
  } catch (error) {
    console.warn('AI extraction failed, using pattern matching:', error)
  }

  // Fallback to pattern matching
  return patternResult
}

