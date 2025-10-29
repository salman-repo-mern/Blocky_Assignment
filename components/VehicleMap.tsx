
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { RoutePoint, RawRoutePoint } from '../types';
import Controls from './Controls';
import AnimatedMarker from './AnimatedMarker';

const INITIAL_CENTER: L.LatLngExpression = [17.3850, 78.4867];
const SIMULATION_INTERVAL_MS = 2000;

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-[2000]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
    </div>
);

const VehicleMap: React.FC = () => {
    const [routeData, setRouteData] = useState<RoutePoint[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/dummy-route.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: RawRoutePoint[] = await response.json();
                setRouteData(data.map(p => ({
                    lat: p.latitude,
                    lng: p.longitude,
                    timestamp: p.timestamp
                })));
            } catch (error) {
                console.error("Error loading route data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (isPlaying && routeData.length > 0) {
            if (currentIndex >= routeData.length - 1) {
                setIsPlaying(false);
                return;
            }
            intervalRef.current = window.setInterval(() => {
                setCurrentIndex(prevIndex => {
                    const nextIndex = prevIndex + 1;
                    if (nextIndex >= routeData.length) {
                        setIsPlaying(false);
                        return prevIndex;
                    }
                    return nextIndex;
                });
            }, SIMULATION_INTERVAL_MS);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, currentIndex, routeData]);

    const togglePlay = () => {
        if (currentIndex >= routeData.length - 1 && !isPlaying) {
            resetSimulation();
            setIsPlaying(true);
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    const resetSimulation = () => {
        setIsPlaying(false);
        setCurrentIndex(0);
    };

    const currentPosition = routeData.length > 0 ? routeData[currentIndex] : null;

    const vehicleIcon = useMemo(() => L.divIcon({
        className: 'vehicle-icon',
        html: `<div class="text-4xl">🚖</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    }), []);
    
    const fullRouteCoords = useMemo(() => routeData.map(p => [p.lat, p.lng] as L.LatLngExpression), [routeData]);
    const traveledRouteCoords = useMemo(() => routeData.slice(0, currentIndex + 1).map(p => [p.lat, p.lng] as L.LatLngExpression), [routeData, currentIndex]);

    return (
        <div className="h-full w-full relative">
            {isLoading && <LoadingSpinner />}
            <MapContainer
                center={INITIAL_CENTER}
                zoom={16}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {routeData.length > 0 && (
                    <>
                        <Polyline
                            pathOptions={{ color: '#a0aec0', weight: 4, opacity: 0.7, dashArray: '5, 10' }}
                            positions={fullRouteCoords}
                        />
                        <Polyline
                            pathOptions={{ color: '#3182ce', weight: 5, opacity: 1 }}
                            positions={traveledRouteCoords}
                        />
                        {currentPosition && (
                            <AnimatedMarker
                                position={[currentPosition.lat, currentPosition.lng]}
                                icon={vehicleIcon}
                                duration={SIMULATION_INTERVAL_MS}
                            />
                        )}
                    </>
                )}
            </MapContainer>
            {!isLoading && routeData.length > 0 && (
                <Controls
                    isPlaying={isPlaying}
                    togglePlay={togglePlay}
                    resetSimulation={resetSimulation}
                    currentPosition={currentPosition}
                    currentIndex={currentIndex}
                    routeData={routeData}
                />
            )}
        </div>
    );
};

export default VehicleMap;
