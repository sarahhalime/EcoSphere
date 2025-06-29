import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin } from 'lucide-react';

// Fix for default icon paths in webpack/vite bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center = [20, 0],
  zoom = 2,
  height = '100%'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    // Initialize map only once when component mounts
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, { zoomControl: false }).setView(center, zoom);
      // Use a terrain tileset instead of the default OpenStreetMap style
      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        maxZoom: 17
      }).addTo(map);

      // Add zoom control to bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;

      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    }
  }, [center, zoom]);

  const searchLocation = async (query: string) => {
    if (!query.trim() || !mapInstanceRef.current) return;

    setIsSearching(true);
    setSearchError('');

    try {
      // Using Nominatim API for geocoding (free OpenStreetMap service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const coordinates: [number, number] = [parseFloat(lat), parseFloat(lon)];

        // Clear any existing search markers
        mapInstanceRef.current.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            mapInstanceRef.current!.removeLayer(layer);
          }
        });

        // Add marker for searched location
        const marker = L.marker(coordinates)
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div>
              <strong>Search Result</strong><br>
              ${display_name}
            </div>
          `)
          .openPopup();

        // Zoom to the location
        mapInstanceRef.current.setView(coordinates, 10);

      } else {
        setSearchError('Location not found. Please try a different search term.');
      }
    } catch (error) {
      setSearchError('Unable to search location. Please check your internet connection.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocation(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchLocation(searchQuery);
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for a location..."
              className="w-full px-4 py-3 pl-12 pr-16 bg-slate-900/90 backdrop-blur-sm text-white placeholder-slate-400 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              disabled={isSearching}
            />
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Search className={`h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {searchError && (
            <div className="mt-2 p-2 bg-red-900/50 border border-red-700/50 rounded-lg text-red-400 text-sm">
              {searchError}
            </div>
          )}
        </form>
      </div>

      {/* Map Container */}
      <div ref={mapRef} style={{ height, width: '100%' }} />
    </div>
  );
};

export default LeafletMap;
