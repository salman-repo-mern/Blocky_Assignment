
import React, { useEffect, useRef } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

interface AnimatedMarkerProps {
    position: [number, number];
    icon: L.DivIcon;
    duration?: number;
}

const AnimatedMarker: React.FC<AnimatedMarkerProps> = ({ position, icon, duration = 2000 }) => {
    const markerRef = useRef<L.Marker | null>(null);
    const map = useMap();

    useEffect(() => {
        if (markerRef.current && position) {
            const marker = markerRef.current;
            const startLatLng = marker.getLatLng();
            const endLatLng = L.latLng(position);

            if (startLatLng.equals(endLatLng)) {
                return;
            }

            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(1, elapsedTime / duration);

                const lat = startLatLng.lat + (endLatLng.lat - startLatLng.lat) * progress;
                const lng = startLatLng.lng + (endLatLng.lng - startLatLng.lng) * progress;

                marker.setLatLng([lat, lng]);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    marker.setLatLng(endLatLng);
                }
            };

            requestAnimationFrame(animate);
            map.panTo(endLatLng, { animate: true, duration: duration / 1000 });
        }
    }, [position, duration, map]);
    
    const initialPosition = position || [0, 0];

    return <Marker ref={markerRef} position={initialPosition} icon={icon} />;
};

export default AnimatedMarker;
