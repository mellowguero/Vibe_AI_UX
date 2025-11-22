import type { ModuleInstance, ModuleType } from './types/modules'

export type CompositionAction = {
  label: string
  apply: (from: ModuleInstance, to: ModuleInstance) => ModuleInstance[]
}

export type CompositionRule = {
  from: ModuleType
  to: ModuleType
  actions: CompositionAction[]
}

export const compositionRules: CompositionRule[] = [
  {
    from: 'image',
    to: 'text',
    actions: [
      {
        label: 'Append image URL to note',
        apply: (from, to) => {
          if (from.type !== 'image' || to.type !== 'text') return [from, to]

          const imageUrl = from.data.imageUrl || ''
          const prevText = to.data.text || ''

          const newText = prevText
            ? prevText + '\n' + imageUrl
            : imageUrl

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              text: newText,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  {
    from: 'text',
    to: 'media',
    actions: [
      {
        label: 'Use note text as song title',
        apply: (from, to) => {
          if (from.type !== 'text' || to.type !== 'media') return [from, to]

          const title = from.data.text || ''

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              title,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Image → Map: use label as location query
  {
    from: 'image',
    to: 'map',
    actions: [
      {
        label: 'Use image label as map query',
        apply: (from, to) => {
          if (from.type !== 'image' || to.type !== 'map') return [from, to]

          const query =
            from.data.label?.trim() || from.data.imageUrl || ''

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              locationQuery: query,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Text → Map: use note text as query
  {
    from: 'text',
    to: 'map',
    actions: [
      {
        label: 'Use note text as map query',
        apply: (from, to) => {
          if (from.type !== 'text' || to.type !== 'map') return [from, to]

          const query = from.data.text.trim()

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              locationQuery: query,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Text → Search: use note text as query
  {
    from: 'text',
    to: 'search',
    actions: [
      {
        label: 'Use note text as search query',
        apply: (from, to) => {
          if (from.type !== 'text' || to.type !== 'search') return [from, to]

          const query = from.data.text.trim()

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              query,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Image → Search: use label or URL as query
  {
    from: 'image',
    to: 'search',
    actions: [
      {
        label: 'Use image label as search query',
        apply: (from, to) => {
          if (from.type !== 'image' || to.type !== 'search') return [from, to]

          const query = (from.data.label || from.data.imageUrl || '').trim()

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              query,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
  // Map → Search: use map location query as search query
  {
    from: 'map',
    to: 'search',
    actions: [
      {
        label: 'Use map location as search query',
        apply: (from, to) => {
          if (from.type !== 'map' || to.type !== 'search') return [from, to]

          const query = from.data.locationQuery.trim()

          const updatedTo: ModuleInstance = {
            ...to,
            data: {
              ...to.data,
              query,
            },
          }

          return [from, updatedTo]
        },
      },
    ],
  },
]

