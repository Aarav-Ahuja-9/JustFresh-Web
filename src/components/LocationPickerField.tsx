"use client";

import { useState } from "react";
import LocationPicker from "./LocationPicker";

export default function LocationPickerField() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  return (
    <>
      <LocationPicker 
        onLocationSelect={(newLat, newLng) => {
          setLat(newLat);
          setLng(newLng);
        }} 
      />
      {lat !== null && lng !== null && (
        <>
          <input type="hidden" name="latitude" value={lat.toString()} />
          <input type="hidden" name="longitude" value={lng.toString()} />
        </>
      )}
    </>
  );
}
