import type { ModuleInstance } from '../types/modules'

type InspectorProps = {
  selectedModule: ModuleInstance | null
  onChangeModule: (module: ModuleInstance) => void
}

export function Inspector({ selectedModule, onChangeModule }: InspectorProps) {
  if (!selectedModule) {
    return (
      <div className="inspector">
        <div style={{ color: '#999' }}>No module selected</div>
      </div>
    )
  }

  const { type, data } = selectedModule

  const getModuleDisplayName = (type: ModuleInstance['type']) => {
    if (type === 'media') return 'MUSIC PLAYER'
    if (type === 'chat') return 'CHAT'
    return type.toUpperCase()
  }

  return (
    <div className="inspector">
      <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>
        {getModuleDisplayName(type)} MODULE
      </div>
      {/* Position */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ marginBottom: 4 }}>Position</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <input
            className="module-input"
            type="number"
            value={selectedModule.x}
            onChange={(e) =>
              onChangeModule({ ...selectedModule, x: Number(e.target.value) })
            }
          />
          <input
            className="module-input"
            type="number"
            value={selectedModule.y}
            onChange={(e) =>
              onChangeModule({ ...selectedModule, y: Number(e.target.value) })
            }
          />
        </div>
      </div>
      {/* Image */}
      {type === 'image' && (
        <>
          <div>Image URL</div>
          <input
            className="module-input"
            value={data.imageUrl}
            onChange={(e) =>
              onChangeModule({
                ...selectedModule,
                data: { ...data, imageUrl: e.target.value },
              })
            }
          />
          <div>Label</div>
          <input
            className="module-input"
            value={data.label ?? ''}
            onChange={(e) =>
              onChangeModule({
                ...selectedModule,
                data: { ...data, label: e.target.value },
              })
            }
          />
        </>
      )}
      {/* Media */}
      {type === 'media' && (
        <>
          <div>Title</div>
          <input
            className="module-input"
            value={data.title}
            onChange={(e) =>
              onChangeModule({
                ...selectedModule,
                data: { ...data, title: e.target.value },
              })
            }
          />
          <div>Audio URL</div>
          <input
            className="module-input"
            value={data.audioUrl}
            onChange={(e) =>
              onChangeModule({
                ...selectedModule,
                data: { ...data, audioUrl: e.target.value },
              })
            }
          />
        </>
      )}
      {/* Text */}
      {type === 'text' && (
        <>
          <div>Text</div>
          <textarea
            className="module-textarea"
            value={data.text}
            onChange={(e) =>
              onChangeModule({
                ...selectedModule,
                data: { ...data, text: e.target.value },
              })
            }
          />
        </>
      )}
      {/* Map */}
      {type === 'map' && (
        <>
          <div>Location query</div>
          <input
            className="module-input"
            value={data.locationQuery}
            onChange={(e) =>
              onChangeModule({
                ...selectedModule,
                data: { ...data, locationQuery: e.target.value },
              })
            }
          />
          <div>Description</div>
          <textarea
            className="module-textarea"
            value={data.description ?? ''}
            onChange={(e) =>
              onChangeModule({
                ...selectedModule,
                data: { ...data, description: e.target.value },
              })
            }
          />
        </>
      )}
      {/* Search */}
      {type === 'search' && (
        <>
          <div>Query</div>
          <input
            className="module-input"
            value={data.query}
            onChange={(e) =>
              onChangeModule({
                ...selectedModule,
                data: { ...data, query: e.target.value },
              })
            }
          />
          {/* Optional: read-only view of results for now */}
          {data.results && data.results.length > 0 && (
            <>
              <div style={{ marginTop: '0.5rem' }}>Results (read-only)</div>
              <div
                style={{
                  maxHeight: 120,
                  overflowY: 'auto',
                  fontSize: '0.75rem',
                  color: '#555',
                }}
              >
                {data.results.map((r: any) => (
                  <div
                    key={r.id}
                    style={{ marginBottom: 4, borderBottom: '1px solid #eee' }}
                  >
                    <div style={{ fontWeight: 500 }}>{r.title}</div>
                    <div>{r.snippet}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
      {/* Chat */}
      {type === 'chat' && (
        <>
          <div style={{ marginTop: '0.5rem' }}>Messages ({data.messages.length})</div>
          <div
            style={{
              maxHeight: 200,
              overflowY: 'auto',
              fontSize: '0.75rem',
              color: '#555',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              padding: '0.5rem',
              marginTop: '0.25rem',
            }}
          >
            {data.messages.length === 0 ? (
              <div style={{ color: '#999', fontStyle: 'italic' }}>No messages yet</div>
            ) : (
              data.messages.map((msg: any) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: '0.5rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                    {msg.sender === 'user' ? 'You' : 'AI'}
                  </div>
                  <div style={{ color: '#666' }}>{msg.text || '(no text)'}</div>
                  {msg.nestedModule && (
                    <div style={{ marginTop: '0.25rem', fontSize: '0.7rem', color: '#999' }}>
                      Contains: {msg.nestedModule.type} module
                    </div>
                  )}
                  <div style={{ fontSize: '0.65rem', color: '#999', marginTop: '0.25rem' }}>
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

