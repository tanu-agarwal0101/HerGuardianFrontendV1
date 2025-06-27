"use client"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";




export default function LocationMap({
    lat, lon, label
}: {
    lat:number;
    lon: number;
    label?: string;
}) {


    const position: LatLngExpression = [lat, lon]
    console.log("position", position)

    useEffect(() => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
      
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          iconUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
        });
      }, []);  


    return (
        <div className="m-2 p-2 border-2 min-w-50 min-h-60 bg-purple-300">

        <MapContainer center={position} zoom={15} style={{height: "100%", width: "100%"}} scrollWheelZoom={false}>
            <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
            <Marker position={position}>
                <Popup>{label ?? "selected location"}</Popup>                
            </Marker>
        </MapContainer>
        
        </div>
    )
}