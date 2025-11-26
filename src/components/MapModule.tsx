/// <reference types="google.maps" />
import { useEffect, useRef, useState } from 'react'
import type { MapModuleData } from '../types/modules'
import { geocodeLocation } from '../api/services'

type MapModuleProps = {
  data: MapModuleData
  onChange: (data: MapModuleData) => void
  moduleId: string
}

export function MapModule({ data, onChange, moduleId }: MapModuleProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [mapsLoaded, setMapsLoaded] = useState(false)
  const [mapsLoading, setMapsLoading] = useState(false)

  // Load Google Maps JavaScript API
  useEffect(() => {
    if ((window as any).google?.maps) {
      setMapsLoaded(true)
      return
    }

    if (mapsLoading) return

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.warn('Google Maps API key not found')
      return
    }

    setMapsLoading(true)

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        setMapsLoaded(true)
        setMapsLoading(false)
      })
      return
    }

    // Load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => {
      setMapsLoaded(true)
      setMapsLoading(false)
    }
    script.onerror = (error) => {
      console.error('Failed to load Google Maps script:', error)
      setMapsLoading(false)
    }
    document.head.appendChild(script)
  }, [mapsLoading])

  // Geocode location when locationQuery changes
  useEffect(() => {
    const locationQuery = data.locationQuery.trim()
    
    if (!locationQuery) {
      // Clear map data if query is empty
      if (data.latitude || data.longitude) {
        onChange({
          ...data,
          latitude: undefined,
          longitude: undefined,
          formattedAddress: undefined,
          error: undefined,
        })
      }
      return
    }

    // Skip if already geocoded for this exact query
    // Check if formattedAddress matches the query (rough check)
    if (data.latitude && data.longitude && data.formattedAddress && 
        data.formattedAddress.toLowerCase().includes(locationQuery.toLowerCase())) {
      return
    }

    // Debounce geocoding
    const timeoutId = setTimeout(async () => {
      // Set loading state but keep old coordinates visible
      onChange({
        ...data,
        isLoading: true,
        error: undefined,
      })

      const result = await geocodeLocation(locationQuery)

      if (result) {
        // Only now update coordinates - this will trigger map update
        onChange({
          ...data,
          latitude: result.lat,
          longitude: result.lng,
          formattedAddress: result.formattedAddress,
          isLoading: false,
          error: undefined,
        })
      } else {
        // Geocoding failed - show error but keep old map visible
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        let errorMessage = 'Location not found. Try a more specific address or location.'
        
        if (!apiKey) {
          errorMessage = 'Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.'
        } else {
          errorMessage = 'Location not found or API error. Check console for details. Cities like "San Francisco" should work.'
        }
        
        onChange({
          ...data,
          isLoading: false,
          error: errorMessage,
          // Don't clear coordinates - keep old map visible
        })
      }
    }, 800) // 800ms debounce

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.locationQuery])

  // Initialize map when coordinates are available
  useEffect(() => {
    if (!mapsLoaded) return
    
    // If no map ref, we can't do anything - wait for ref to be set
    if (!mapRef.current) return
    
    // If no coordinates, clear map instance if it exists (to allow fresh init on next location)
    if (!data.latitude || !data.longitude) {
      if (mapInstanceRef.current) {
        // Clear the map instance so it can be reinitialized fresh
        if (markerRef.current) {
          try {
            markerRef.current.setMap(null)
          } catch (e) {
            // Ignore
          }
          markerRef.current = null
        }
        mapInstanceRef.current = null
      }
      return
    }

    const google = (window as any).google
    if (!google?.maps) {
      console.warn('Google Maps API not available')
      return
    }

    // Initialize map if not already done
    if (!mapInstanceRef.current && mapRef.current) {
      try {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: data.latitude, lng: data.longitude },
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        })
        mapInstanceRef.current = map

        // Use classic Marker
        const marker = new google.maps.Marker({
          position: { lat: data.latitude, lng: data.longitude },
          map: map,
          title: data.formattedAddress || data.locationQuery,
        })
        markerRef.current = marker
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    } else if (mapInstanceRef.current && mapRef.current) {
      // Update existing map center and marker position when coordinates change
      const newCenter = { lat: data.latitude, lng: data.longitude }
      
      try {
        // Check if map is still connected to DOM and matches our ref
        let mapDiv
        try {
          mapDiv = mapInstanceRef.current.getDiv()
        } catch (e) {
          // Map instance is invalid, reinitialize
          mapInstanceRef.current = null
          markerRef.current = null
          return
        }
        
        // Critical check: ensure the map div is the same as our ref
        if (mapDiv !== mapRef.current) {
          mapInstanceRef.current = null
          markerRef.current = null
          return
        }
        
        if (!mapDiv || !mapDiv.parentNode) {
          // Map div disconnected, reinitialize
          mapInstanceRef.current = null
          markerRef.current = null
          return
        }
        
        // Check if map div is actually visible/has dimensions
        const rect = mapDiv.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) {
          mapInstanceRef.current = null
          markerRef.current = null
          return
        }
        
        // Update map center
        mapInstanceRef.current.setCenter(newCenter)
        
        // Update or create marker
        if (markerRef.current && markerRef.current.setPosition) {
          // Update existing marker
          markerRef.current.setPosition(newCenter)
          markerRef.current.setTitle(data.formattedAddress || data.locationQuery)
        } else {
          // Remove old marker if it exists but doesn't have setPosition
          if (markerRef.current) {
            try {
              markerRef.current.setMap(null)
            } catch (e) {
              // Ignore errors
            }
          }
          // Create new marker
          markerRef.current = new google.maps.Marker({
            position: newCenter,
            map: mapInstanceRef.current,
            title: data.formattedAddress || data.locationQuery,
          })
        }
        
        // Force map to resize/refresh - this fixes rendering issues when location changes
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          if (mapInstanceRef.current) {
            try {
              google.maps.event.trigger(mapInstanceRef.current, 'resize')
              // Also try panTo to force a refresh
              mapInstanceRef.current.panTo(newCenter)
            } catch (e) {
              // Ignore resize errors
            }
          }
        })
      } catch (error) {
        console.error('Error updating map:', error)
        // If update fails, clear instance to force reinitialization on next render
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [mapsLoaded, data.latitude, data.longitude, data.formattedAddress, data.locationQuery])

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        try {
          markerRef.current.setMap(null)
        } catch (e) {
          // Ignore cleanup errors
        }
        markerRef.current = null
      }
    }
  }, [])

  return (
    <div className="map-module">
      <input
        className="module-input"
        type="text"
        placeholder="Location or query (e.g. Pizza in SF)"
        value={data.locationQuery}
        onChange={(e) => {
          const newQuery = e.target.value
          // Don't clear coordinates immediately - keep old map visible until new geocoding completes
          // Only clear error state
          onChange({
            ...data,
            locationQuery: newQuery,
            error: undefined,
            isLoading: newQuery.trim() !== data.locationQuery.trim(), // Set loading if query actually changed
          })
        }}
      />
      <textarea
        className="module-textarea"
        placeholder="Optional description"
        value={data.description ?? ''}
        onChange={(e) =>
          onChange({
            ...data,
            description: e.target.value,
          })
        }
      />
      <div className="map-view">
        {data.locationQuery ? (
          <>
            {data.isLoading ? (
              <div className="map-view-loading">
                Geocoding location...
              </div>
            ) : data.error ? (
              <div className="map-view-error">
                {data.error}
              </div>
            ) : null}
            {/* Always render map container to keep ref stable - hide when no coordinates */}
            {data.formattedAddress && (
              <div className="map-view-title">
                <strong>{data.formattedAddress || 'Loading new location...'}</strong>
              </div>
            )}
            {data.isLoading && !data.error && (
              <div style={{ padding: '0.25rem', fontSize: '0.7rem', color: '#666', fontStyle: 'italic' }}>
                Geocoding new location...
              </div>
            )}
            <div
              ref={mapRef}
              id={`map-${moduleId}`}
              style={{
                width: '100%',
                height: '200px',
                minHeight: '200px',
                borderRadius: '4px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                position: 'relative',
                display: (data.latitude && data.longitude) || mapInstanceRef.current ? 'block' : 'none',
              }}
            />
          </>
        ) : (
          <div className="map-view-empty">
            Enter a location or query to see a map preview.
          </div>
        )}
      </div>
    </div>
  )
}
