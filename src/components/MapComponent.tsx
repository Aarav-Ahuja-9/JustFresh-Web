"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-hot-toast";

// Fix leaflet default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapComponentProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  defaultLocation?: { lat: number; lng: number } | null;
  readOnly?: boolean;
}

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090 // New Delhi
};

function MapEvents({ onLocationSelect, readOnly }: { onLocationSelect?: (lat: number, lng: number) => void, readOnly: boolean }) {
  useMapEvents({
    click(e) {
      if (!readOnly && onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

function RecenterMap({ position }: { position: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);
  return null;
}

export default function MapComponent({ onLocationSelect, defaultLocation, readOnly = false }: MapComponentProps) {
  const [markerPosition, setMarkerPosition] = useState(defaultLocation || defaultCenter);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const handleLocationUpdate = (lat: number, lng: number) => {
    if (readOnly) return;
    setMarkerPosition({ lat, lng });
    if (onLocationSelect) onLocationSelect(lat, lng);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMarkerPosition(pos);
          if (onLocationSelect) onLocationSelect(pos.lat, pos.lng);
        },
        (error) => {
          toast.error("Location access denied or unavailable. Please pick manually on the map.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  if (!mapReady) return <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center">Loading Map...</div>;

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ height: "300px", width: "100%" }}>
      <MapContainer 
        center={markerPosition} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={markerPosition} />
        <RecenterMap position={markerPosition} />
        <MapEvents onLocationSelect={handleLocationUpdate} readOnly={readOnly} />
      </MapContainer>
      
      {!readOnly && (
        <button 
          type="button"
          onClick={getUserLocation}
          className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow font-semibold text-slate-800 text-sm hover:bg-gray-50 z-[1000]"
        >
          📍 Use My Current Location
        </button>
      )}
      
      {readOnly && (
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-lg shadow font-medium text-emerald-700 text-xs z-[1000] opacity-90">
          Saved Location View
        </div>
      )}
    </div>
  );
}
