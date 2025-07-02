import React from "react";
import { Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';

interface InteractiveMapProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  selectedLocation: { lat: number; lng: number } | null;
  height?: string;
}

// Types pour le composant importé dynamiquement
interface MapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  selectedLocation: { lat: number; lng: number } | null;
  height?: string;
}

// Chargement dynamique des composants React-Leaflet pour éviter les erreurs SSR
const MapComponent = dynamic<MapComponentProps>(
  () => import('./MapComponent').then(mod => mod.default),
  { 
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-blue-600 flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <span>Chargement de la carte...</span>
        </div>
      </div>
    ),
    ssr: false // Désactiver le rendu côté serveur pour Leaflet
  }
);

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onLocationSelect, selectedLocation, height = "400px" }) => {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 relative" style={{ height, width: '100%' }}>
      <MapComponent 
        onLocationSelect={onLocationSelect}
        selectedLocation={selectedLocation}
        height={height}
      />
    </div>
  );
};

export default InteractiveMap;
