"use client";

import dynamic from "next/dynamic";

interface LocationPickerProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  defaultLocation?: { lat: number; lng: number } | null;
  readOnly?: boolean;
}

const MapComponent = dynamic(() => import("./MapComponent"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center">Loading Map...</div>
});

export default function LocationPicker(props: LocationPickerProps) {
  return <MapComponent {...props} />;
}
