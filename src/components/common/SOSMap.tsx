"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const fixLeafletIcon = () => {

  const prototype = L.Icon.Default.prototype as any;
  delete prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom(), { animate: true });
  }, [lat, lon, map]);
  return null;
}

interface Point {
    latitude: number;
    longitude: number;
}

export default function SOSMap({ 
    center, 
    history = [], 
    className 
}: { 
    center: { lat: number; lon: number };
    history?: Point[];
    className?: string;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fixLeafletIcon();
  }, []);

  if (!isClient) return <div className={className} />;

  const polylinePositions: [number, number][] = history.map(p => [p.latitude, p.longitude]);
 
  if (polylinePositions.length === 0 || 
      (polylinePositions[polylinePositions.length-1][0] !== center.lat || 
       polylinePositions[polylinePositions.length-1][1] !== center.lon)) {
    polylinePositions.push([center.lat, center.lon]);
  }

  return (
    <div className={className}>
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "inherit" }}
      >
      
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <Polyline 
            positions={polylinePositions} 
            pathOptions={{ color: '#ef4444', weight: 4, opacity: 0.7, dashArray: '5, 10' }} 
        />
        <Marker position={[center.lat, center.lon]}>
          <Popup>
            <div className="text-black">
              Current Location
            </div>
          </Popup>
        </Marker>

        <RecenterMap lat={center.lat} lon={center.lon} />
      </MapContainer>
    </div>
  );
}
