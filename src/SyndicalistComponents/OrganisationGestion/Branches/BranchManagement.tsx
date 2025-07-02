"use client";
import React, { useState, useEffect, useRef, memo, useMemo, ReactNode } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from "react-leaflet";
import L, { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, MapPin, X, Check, Compass, Phone, Mail, User, EyeOff, Eye, Upload, Layers,
  Building, Calendar, Clock, Edit, ChevronDown, ChevronUp, 
  Users, Zap, Download, Target, Filter, Search, Star, Award, FileText, Settings, BarChart2, ArrowRight,
  Globe, Navigation, Briefcase, Shield, Info, AlertTriangle
} from "lucide-react";

// --- Types ---
export interface BranchManager {
  name: string;
  phone: string;
  email: string;
  performance?: {
    efficiency: number;
    satisfaction: number;
    growth: number;
  };
}

export interface Branch {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  type: "headquarters" | "regional" | "local" | "satellite";
  manager: BranchManager;
  employees?: number;
  foundedDate?: string;
  coverageRadius?: number;
  services?: string[];
  operatingHours?: string;
  photos?: string[];
  phone?: string;
  email?: string;
}

// --- Wrapper component to handle map initialization ---
const MapWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <div className="h-full w-full bg-gray-100" />;
  }
  return <>{children}</>;
};

// --- LocationSelector ---
interface LocationSelectorProps {
  onLocationSelected?: (lat: number, lng: number) => void;
}
const LocationSelector: React.FC<LocationSelectorProps> = memo(({ onLocationSelected }) => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  useMapEvents({
    click: (e) => {
      setPosition(e.latlng);
      if (onLocationSelected) {
        onLocationSelected(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  useEffect(() => () => setPosition(null), []);
  if (!position) return null;
  return (
    <Marker 
      key={`${(position as any).lat}-${(position as any).lng}`}
      position={position} 
      icon={customMarkerIcon}
    >
      <Popup>Nouvelle position sélectionnée</Popup>
    </Marker>
  );
});

// --- Custom Marker Icon ---
const customMarkerIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// --- Branch Icons ---
const branchIcons: Record<Branch["type"], Icon> = {
  headquarters: L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", shadowSize: [41, 41],
  }),
  regional: L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", shadowSize: [41, 41],
  }),
  local: L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", shadowSize: [41, 41],
  }),
  satellite: L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
    iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png", shadowSize: [41, 41],
  })
};

// --- MapComponent ---
interface MapComponentProps {
  mapCenter: LatLngExpression;
  succursales: Branch[];
  isAddingBranch: boolean;
  handleLocationSelected: (lat: number, lng: number) => void;
  showCoverageAreas: boolean;
  setSelectedBranch: (branch: Branch) => void;
}
const MapComponent: React.FC<MapComponentProps> = memo(({ 
  mapCenter, succursales, isAddingBranch, handleLocationSelected, showCoverageAreas, setSelectedBranch 
}) => {
  const mapRef = useRef<L.Map | null>(null);
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, 6);
    }
  }, [mapCenter]);
  return (
    <div className="h-[calc(100vh-2rem)] relative bg-white rounded-lg shadow-lg overflow-hidden">
      <MapWrapper>
        <MapContainer
          center={mapCenter}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          ref={mapRef as any}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {isAddingBranch && (
            <LocationSelector onLocationSelected={handleLocationSelected} />
          )}
          {succursales.map((branch) => (
            <Marker
              key={`marker-${branch.id}`}
              position={[branch.latitude, branch.longitude]}
              icon={branchIcons[branch.type] || customMarkerIcon}
              eventHandlers={{ click: () => setSelectedBranch(branch) }}
            >
              <Popup>
                <div className="font-medium">{branch.name}</div>
                <div className="text-sm text-gray-600">{branch.description}</div>
              </Popup>
            </Marker>
          ))}
          {showCoverageAreas && succursales.map((branch) => (
            <Circle
              key={`circle-${branch.id}`}
              center={[branch.latitude, branch.longitude]}
              radius={branch.coverageRadius || 10000}
              pathOptions={{ fillColor: '#2563eb', fillOpacity: 0.1, color: '#2563eb', weight: 1 }}
            />
          ))}
        </MapContainer>
      </MapWrapper>
    </div>
  );
});

// --- Données fictives pour les branches ---
const fakeBranches: Branch[] = [
  {
    id: "1",
    name: "Siège Douala",
    description: "Terminal de transport maritime",
    address: "123 Boulevard de la Liberté, Douala",
    latitude: 4.0511,
    longitude: 9.7679,
    type: "headquarters",
    manager: {
      name: "Jean Dupont",
      phone: "+237 123 456 789",
      email: "jean.dupont@example.com",
      performance: { efficiency: 92, satisfaction: 88, growth: 15 }
    },
    photos: [
      "https://images.unsplash.com/photo-1577032229840-33197764440d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=600&fit=crop"
    ]
  },
  {
    id: "2",
    name: "Centre Yaoundé",
    description: "Centre de logistique routière",
    address: "45 Avenue Kennedy, Yaoundé",
    latitude: 3.8480,
    longitude: 11.5021,
    type: "regional",
    manager: {
      name: "Marie Fouda",
      phone: "+237 234 567 890",
      email: "marie.fouda@example.com",
      performance: { efficiency: 87, satisfaction: 92, growth: 8 }
    },
    photos: [
      "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586191582151-f73872dfd183?w=800&h=600&fit=crop"
    ]
  }
];

// --- Composant principal ---
const BranchManagement: React.FC = () => {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([4.5, 11.5]);
  const [succursales, setSuccursales] = useState<Branch[]>([]);
  const [newSuccursale, setNewSuccursale] = useState<Partial<Branch>>({});
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<Branch["type"] | "all">("all");
  const [showCoverageAreas, setShowCoverageAreas] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [isImporting, setIsImporting] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSuccursales(fakeBranches);
  }, []);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [mapRef]);

  const handleAddBranch = () => {
    if (newSuccursale.name && selectedLocation) {
      const newBranchData: Branch = {
        id: Date.now().toString(),
        name: newSuccursale.name!,
        description: newSuccursale.description || "",
        latitude: selectedLocation[0],
        longitude: selectedLocation[1],
        type: newSuccursale.type || "local",
        manager: typeof newSuccursale.manager === "string"
          ? { name: newSuccursale.manager, phone: "", email: "" }
          : newSuccursale.manager || { name: "", phone: "", email: "" },
        employees: newSuccursale.employees || 0,
        foundedDate: new Date().toISOString().split('T')[0],
        coverageRadius: newSuccursale.coverageRadius || 10000,
        services: newSuccursale.services || [],
        operatingHours: newSuccursale.operatingHours || "Lun-Ven: 9h-17h",
        address: newSuccursale.address || "",
        photos: newSuccursale.photos || [],
        phone: newSuccursale.phone || "",
        email: newSuccursale.email || "",
      };
      setSuccursales([...succursales, newBranchData]);
      setNewSuccursale({});
      setIsAddingBranch(false);
      setSelectedLocation(null);
    }
  };

  const handleDeleteBranch = (id: string) => {
    setSuccursales(succursales.filter(branch => branch.id !== id));
    if (selectedBranch && selectedBranch.id === id) {
      setSelectedBranch(null);
    }
  };

  const handleLocationSelected = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    setNewSuccursale(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const focusOnBranch = (latitude: number, longitude: number) => {
    mapRef.current?.setView([latitude, longitude], 13);
  };

  const handleImportBranches = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedBranches = JSON.parse(event.target?.result as string);
          if (Array.isArray(importedBranches)) {
            setSuccursales([...succursales, ...importedBranches]);
          }
        } catch (error) {
          console.error("Erreur lors de l'importation:", error);
        }
      };
      reader.readAsText(file);
    }
    setIsImporting(false);
  };

  const exportBranches = () => {
    const dataStr = JSON.stringify(succursales, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'branches.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Filtrer les branches selon la recherche et le type
  const filteredBranches = succursales.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || branch.type === filterType;
    return matchesSearch && matchesType;
  });

  // Statistiques des branches
  const branchStats = {
    total: succursales.length,
    byType: {
      headquarters: succursales.filter(b => b.type === "headquarters").length,
      regional: succursales.filter(b => b.type === "regional").length,
      local: succursales.filter(b => b.type === "local").length,
      satellite: succursales.filter(b => b.type === "satellite").length,
    },
    totalEmployees: succursales.reduce((sum, branch) => sum + (branch.employees || 0), 0),
    averageCoverage: succursales.length > 0
      ? Math.round(succursales.reduce((sum, branch) => sum + (branch.coverageRadius || 0), 0) / succursales.length / 1000)
      : 0,
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 p-4">
        {viewMode === "map" && (
          <div className="h-[calc(100vh-2rem)] relative bg-white rounded-lg shadow-lg overflow-hidden">
            <MapComponent
              mapCenter={mapCenter}
              succursales={succursales}
              isAddingBranch={isAddingBranch}
              handleLocationSelected={handleLocationSelected}
              showCoverageAreas={showCoverageAreas}
              setSelectedBranch={setSelectedBranch}
            />
          </div>
        )}
        {/* Vue liste */}
        {viewMode === "list" && (
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg p-6 h-[calc(100vh-240px)] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Liste des succursales</h2>
              <div className="space-y-4">
                {filteredBranches.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Aucune succursale trouvée</p>
                  </div>
                ) : (
                  filteredBranches.map(branch => (
                    <motion.div
                      key={branch.id}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 rounded-xl border-l-4 ${
                        branch.type === 'headquarters' ? 'border-red-500 bg-red-50' :
                        branch.type === 'regional' ? 'border-green-500 bg-green-50' :
                        branch.type === 'satellite' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      } hover:shadow-md transition-all cursor-pointer`}
                      onClick={() => setSelectedBranch(branch)}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{branch.name}</h3>
                          <p className="text-sm text-gray-600">{branch.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center text-xs bg-white px-2 py-1 rounded-full">
                              <User size={12} className="mr-1" />
                              {branch.manager.name}
                            </span>
                            <span className="inline-flex items-center text-xs bg-white px-2 py-1 rounded-full">
                              <Users size={12} className="mr-1" />
                              {branch.employees} employés
                            </span>
                            <span className="inline-flex items-center text-xs bg-white px-2 py-1 rounded-full">
                              <Target size={12} className="mr-1" />
                              {(branch.coverageRadius! / 1000).toFixed(0)} km
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            branch.type === 'headquarters' ? 'bg-red-200 text-red-700' :
                            branch.type === 'regional' ? 'bg-green-200 text-green-700' :
                            branch.type === 'satellite' ? 'bg-yellow-200 text-yellow-700' :
                            'bg-blue-200 text-blue-700'
                          }`}>
                            {branch.type === 'headquarters' ? 'Siège' :
                              branch.type === 'regional' ? 'Régional' :
                              branch.type === 'satellite' ? 'Satellite' :
                              'Local'}
                          </span>
                          <div className="flex mt-2 space-x-1">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                focusOnBranch(branch.latitude, branch.longitude);
                                setViewMode("map");
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                            >
                              <MapPin size={16} />
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleDeleteBranch(branch.id);
                              }}
                              className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        {/* Panneau de détails */}
        <div className="lg:w-1/3 h-[calc(100vh-240px)] overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 h-full">
            {selectedBranch ? (
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">{selectedBranch.name}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        focusOnBranch(selectedBranch.latitude, selectedBranch.longitude);
                        if (viewMode !== "map") setViewMode("map");
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Compass size={18} />
                    </button>
                    <button
                      onClick={() => setSelectedBranch(null)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div className={`mb-6 p-3 rounded-lg ${
                  selectedBranch.type === 'headquarters' ? 'bg-red-50' :
                  selectedBranch.type === 'regional' ? 'bg-green-50' :
                  selectedBranch.type === 'satellite' ? 'bg-yellow-50' :
                  'bg-blue-50'
                }`}>
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      selectedBranch.type === 'headquarters' ? 'bg-red-200 text-red-700' :
                      selectedBranch.type === 'regional' ? 'bg-green-200 text-green-700' :
                      selectedBranch.type === 'satellite' ? 'bg-yellow-200 text-yellow-700' :
                      'bg-blue-200 text-blue-700'
                    }`}>
                      {selectedBranch.type === 'headquarters' ? <Building size={20} /> :
                        selectedBranch.type === 'regional' ? <Target size={20} /> :
                        selectedBranch.type === 'satellite' ? <Zap size={20} /> :
                        <MapPin size={20} />}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium">
                        {selectedBranch.type === 'headquarters' ? 'Siège principal' :
                          selectedBranch.type === 'regional' ? 'Bureau régional' :
                          selectedBranch.type === 'satellite' ? 'Point satellite' :
                          'Antenne locale'}
                      </div>
                      <div className="text-xs">
                        {selectedBranch.address}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Informations générales</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-800">Responsable</div>
                          <div className="text-sm text-gray-600">{selectedBranch.manager.name}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-800">Téléphone</div>
                          <div className="text-sm text-gray-600">{selectedBranch.manager.phone}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-800">Email</div>
                          <div className="text-sm text-gray-600">{selectedBranch.manager.email}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Users className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-800">Employés</div>
                          <div className="text-sm text-gray-600">{selectedBranch.employees} personnes</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-800">Date de création</div>
                          <div className="text-sm text-gray-600">
                            {selectedBranch.foundedDate && new Date(selectedBranch.foundedDate).toLocaleDateString('fr-FR', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-800">Heures d'ouverture</div>
                          <div className="text-sm text-gray-600">{selectedBranch.operatingHours}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Services proposés</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedBranch.services && selectedBranch.services.map((service, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Zone de couverture</h3>
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="text-sm text-gray-600">
                        Rayon de {(selectedBranch.coverageRadius! / 1000).toFixed(0)} km autour de la succursale
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Modifier
                      </button>
                      <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Layers className="w-16 h-16 text-gray-200 mb-4" />
                <p className="text-gray-500 text-center mb-4">
                  Sélectionnez une succursale sur la carte ou dans la liste pour voir les détails.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsAddingBranch(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Ajouter une succursale
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchManagement;
