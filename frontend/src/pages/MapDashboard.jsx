import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Eye, Layers, X } from 'lucide-react';

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN ||
  'pk.eyJ1IjoibmFpdGlrZzIwMDYiLCJhIjoiY21tdzhiMnJ4MmVuMTJxcXR6aXh5b3hxOCJ9.8irBW3Qo4xLwUrPjuPm3pw';

export default function MapDashboard() {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [showMapHint, setShowMapHint] = useState(true);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/typologies/markers').then((res) => setMarkers(res.data)).catch(console.error);
  }, []);

  const initMap = useCallback(() => {
    if (!window.mapboxgl || !mapContainerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      setMapError(true);
      return;
    }

    try {
      window.mapboxgl.accessToken = MAPBOX_TOKEN;
      const map = new window.mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [78.9629, 22.5937],
        zoom: 4.5,
      });

      map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
      map.on('load', () => setMapLoaded(true));
      mapRef.current = map;
    } catch {
      setMapError(true);
    }
  }, []);

  useEffect(() => {
    if (window.mapboxgl) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js';
    script.onload = () => initMap();
    script.onerror = () => setMapError(true);
    document.head.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initMap]);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded || markers.length === 0) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    markers.forEach((marker) => {
      const el = document.createElement('div');
      el.style.cssText = `
        cursor: pointer;
      `;
      el.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          background: #1e40af;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
          transform-origin: center;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
      `;
      const markerInner = el.firstElementChild;
      el.onmouseenter = () => {
        if (markerInner) markerInner.style.transform = 'scale(1.3)';
      };
      el.onmouseleave = () => {
        if (markerInner) markerInner.style.transform = 'scale(1)';
      };
      el.onclick = () => setSelectedMarker(marker);

      const m = new window.mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .addTo(mapRef.current);

      markersRef.current.push(m);
    });
  }, [markers, mapLoaded]);

  if (mapError) {
    return (
      <div className="page">
        <div className="page-header">
          <h2>Map Dashboard</h2>
          <p>Interactive map showing housing typology locations across India</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {markers.map((m) => (
            <div key={m.id} className="typology-card" onClick={() => navigate(`/typology/${m.id}`)}>
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{m.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={14} /> {m.region}
                </p>
                <span className="tag tag-blue" style={{ marginTop: 10, display: 'inline-block' }}>
                  {m.climateType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {showMapHint && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'white',
            borderRadius: 'var(--radius)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10,
            maxWidth: 320,
          }}
        >
          <button
            onClick={() => setShowMapHint(false)}
            aria-label="Close map hint"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingRight: 20,
            }}
          >
            <Layers size={18} />
            Housing Typology Map
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>
            Click markers to view housing designs for each location. {markers.length} typologies available.
          </p>
        </div>
      )}

      {selectedMarker && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'white',
            borderRadius: 'var(--radius)',
            padding: 24,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10,
            width: 380,
            maxWidth: 'calc(100% - 32px)',
          }}
        >
          <button
            onClick={() => setSelectedMarker(null)}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, paddingRight: 24 }}>
            {selectedMarker.name}
          </h3>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-light)',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <MapPin size={14} />
            {selectedMarker.region}
          </p>
          <span className="tag tag-blue">{selectedMarker.climateType}</span>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
            onClick={() => navigate(`/typology/${selectedMarker.id}`)}
          >
            <Eye size={16} />
            View Full Details
          </button>
        </div>
      )}
    </div>
  );
}
