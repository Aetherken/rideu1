import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet icons issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LiveTracking = () => {
    // Mock position for VJEC
    const vjecPosition = [12.0000, 75.5000]; // Approx Vimal Jyothi College coords
    const busPosition = [11.9500, 75.4500]; // Mock Bus Coords

    return (
        <div className="relative h-[calc(100vh-64px)] w-full">
            <MapContainer center={vjecPosition} zoom={11} className="w-full h-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                <Marker position={vjecPosition}>
                    <Popup>Vimal Jyothi Engineering College</Popup>
                </Marker>

                <Marker position={busPosition}>
                    <Popup>
                        <div className="font-bold">Bus KL-59-901</div>
                        <div>Kannur Route</div>
                        <div className="text-green-600 mt-1 font-medium">ETA: 14 mins</div>
                    </Popup>
                </Marker>
            </MapContainer>

            {/* Floating Panel overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl p-6 z-10 border border-gray-100">
                <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                    <div className="bg-orange-100 text-ride-terracotta p-3 rounded-xl animate-pulse">
                        <Navigation size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-ride-charcoal">Live Map Tracking</h3>
                        <p className="text-sm text-ride-slate">Simulated Bus Locations</p>
                    </div>
                </div>
                <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-ride-slate font-medium">Next Bus to Kannur</span>
                        <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded-md">14 min</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-ride-slate font-medium">Next Bus to Thalassery</span>
                        <span className="bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded-md">30 min</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveTracking;
