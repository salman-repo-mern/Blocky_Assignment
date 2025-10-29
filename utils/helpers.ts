
import { RoutePoint } from '../types';

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

export function calculateSpeedKmH(currentIndex: number, routeData: RoutePoint[]): string {
    if (currentIndex < 1 || routeData.length <= 1) return '0.00';

    const currPoint = routeData[currentIndex];
    const prevPoint = routeData[currentIndex - 1];

    if (!prevPoint || !currPoint) return '0.00';

    const distanceKm = calculateDistanceKm(
        prevPoint.lat, prevPoint.lng,
        currPoint.lat, currPoint.lng
    );

    const timeDeltaMs = new Date(currPoint.timestamp).getTime() - new Date(prevPoint.timestamp).getTime();
    if (timeDeltaMs <= 0) return 'N/A';
    
    const timeDeltaHours = timeDeltaMs / (1000 * 60 * 60);

    const speed = distanceKm / timeDeltaHours;
    return speed.toFixed(2);
}
