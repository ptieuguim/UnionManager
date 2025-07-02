"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";
import { Button, Alert } from "antd";
import { MapPin, Loader2 } from "lucide-react";
import type { LocationEvent } from "leaflet";

interface LatLng {
    lat: number;
    lng: number;
}

interface GeolocationControlProps {
    onLocationUpdate: (latlng: LatLng) => void;
}

export const GeolocationControl: React.FC<GeolocationControlProps> = ({ onLocationUpdate }) => {
    const map = useMap();
    const [isLocating, setIsLocating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLocationFound = useCallback((e: LocationEvent) => {
        setIsLocating(false);
        onLocationUpdate(e.latlng);
        map.setView(e.latlng, 13);
    }, [map, onLocationUpdate, setIsLocating]);

    const handleLocationError = useCallback(() => {
        setIsLocating(false);
        setError("Impossible d'obtenir votre position. Veuillez vérifier vos paramètres de localisation.");
    }, [setIsLocating, setError]);

    const locateUser = () => {
        setIsLocating(true);
        setError(null);
        map.locate({ setView: true, maxZoom: 13 });
    };

    useEffect(() => {
        map.on("locationfound", handleLocationFound);
        map.on("locationerror", handleLocationError);
        return () => {
            map.off("locationfound", handleLocationFound);
            map.off("locationerror", handleLocationError);
        };
    }, [map, handleLocationFound, handleLocationError]);

    return (
        <div className="absolute top-4 right-4 z-[1000]">
            <Button onClick={locateUser} disabled={isLocating} className="shadow-lg">
                {isLocating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
                Ma position
            </Button>
            {error && <Alert message={error} type="error" showIcon className="mt-2" />}
        </div>
    );
};
