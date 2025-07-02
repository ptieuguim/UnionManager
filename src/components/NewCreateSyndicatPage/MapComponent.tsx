import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Initialiser les icônes Leaflet globalement - contourne les problèmes de SSR
const initializeLeafletIcons = () => {
  // Sécurise TypeScript
  if (!L || !L.Icon || !L.Icon.Default) return;
  
  // Double-vérification sécurisée
  try {
    // @ts-expect-error - L'interface de L.Icon.Default.prototype n'expose pas _getIconUrl
    delete L.Icon.Default.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  } catch (e) {
    console.error('Erreur lors de l\'initialisation des icônes Leaflet:', e);
  }
};

interface MapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  selectedLocation: { lat: number; lng: number } | null;
  height?: string;
}

// Composant pour mettre à jour la position de la carte lorsque selectedLocation change
const SetViewOnClick = ({ coords }: { coords: { lat: number; lng: number } | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], map.getZoom());
    }
  }, [coords, map]);
  
  return null;
};

// Composant pour gérer les clics sur la carte
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (location: { lat: number; lng: number }) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    map.on('click', (e) => {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
    
    return () => {
      map.off('click');
    };
  }, [map, onLocationSelect]);
  
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect, selectedLocation, height = "400px" }) => {
  // Coordonnées par défaut (Cameroun)
  const defaultPosition: [number, number] = [7.3697, 12.3547];
  const position: [number, number] = selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : defaultPosition;

  // Initialiser les icônes Leaflet au montage du composant
  useEffect(() => {
    initializeLeafletIcons();
  }, []);

  return (
    <div style={{ height, width: '100%' }}>
      {/* Instruction pour la sélection d'emplacement */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          zIndex: 1000, 
          backgroundColor: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          fontSize: '14px',
          color: '#444',
          fontWeight: 500
        }}
      >
        <strong>Cliquez sur la carte</strong> pour sélectionner un emplacement
      </div>

      {/* Conteneur de la carte */}
      <MapContainer 
        center={position} 
        zoom={8} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Affiche un marqueur à la position sélectionnée */}
        {selectedLocation && (
          <Marker 
            position={[selectedLocation.lat, selectedLocation.lng]} 
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                onLocationSelect({ lat: position.lat, lng: position.lng });
              }
            }}
          >
            <Popup>
              Position sélectionnée <br />
              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}
        
        {/* Gestionnaires pour la carte */}
        <SetViewOnClick coords={selectedLocation} />
        <MapClickHandler onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
