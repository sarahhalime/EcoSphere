import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icon paths in webpack/vite bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface ProjectLocation {
  id: number;
  name: string;
  location: string;
  coordinates: [number, number];
  trees: number;
  status: string;
  area: number;
}

interface LeafletMapProps {
  projectLocations: ProjectLocation[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  projectLocations,
  center = [20, 0],
  zoom = 2,
  height = '100%'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Initialize map only once when component mounts
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView(center, zoom);
      
      // Use a terrain tileset instead of the default OpenStreetMap style
      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        maxZoom: 17
      }).addTo(map);
      
      mapInstanceRef.current = map;
      
      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    }
  }, []);

  // Add and update markers when project locations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    
    // Clear previous markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });
    
    // Add new markers
    projectLocations.forEach(project => {
      // Add marker with popup
      const marker = L.marker(project.coordinates)
        .addTo(map)
        .bindPopup(`
          <div>
            <strong>${project.name}</strong><br>
            ${project.location}<br>
            Trees planted: ${project.trees.toLocaleString()}<br>
            Status: ${project.status}
          </div>
        `);
      
      // Add circle
      L.circle(project.coordinates, {
        radius: project.area,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.3
      }).addTo(map);
    });
  }, [projectLocations]);

  return <div ref={mapRef} style={{ height, width: '100%' }} />;
};

export default LeafletMap;
