import { useState, useEffect } from 'react';
import { useLocalStorage } from 'react-use';

export interface TrackingData {
  id: string;
  status: 'in-transit' | 'delivered';
  progress: number;
  currentLat: number;
  currentLng: number;
  from: { lat: number; lng: number; name: string };
  to: { lat: number; lng: number; name: string };
  eta: string;
  timeline: Array<{
    timestamp: string;
    location: string;
    status: string;
    lat: number;
    lng: number;
  }>;
}

export function useTracking() {
  const [selectedItemId, setSelectedItemId] = useLocalStorage<string | null>('tracked-item', null);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

  useEffect(() => {
    if (!selectedItemId) {
      setTrackingData(null);
      return;
    }

    // Simulated tracking data
    const initialData: TrackingData = {
      id: selectedItemId,
      status: 'in-transit',
      progress: 45,
      currentLat: 19.0760,
      currentLng: 72.8777,
      from: { lat: 18.5204, lng: 73.8567, name: 'Mumbai' },
      to: { lat: 28.7041, lng: 77.1025, name: 'Delhi' },
      eta: '2 hours',
      timeline: [
        {
          timestamp: new Date(Date.now() - 3600000).toLocaleString(),
          location: 'Mumbai',
          status: 'Picked up',
          lat: 18.5204,
          lng: 73.8567,
        },
        {
          timestamp: new Date(Date.now() - 1800000).toLocaleString(),
          location: 'Thane',
          status: 'In transit',
          lat: 19.2183,
          lng: 72.9781,
        },
      ],
    };

    setTrackingData(initialData);

    // Simulate GPS updates
    const interval = setInterval(() => {
      setTrackingData((prev) => {
        if (!prev) return null;

        const newProgress = Math.min(prev.progress + 2, 100);
        const latDiff = prev.to.lat - prev.from.lat;
        const lngDiff = prev.to.lng - prev.from.lng;
        const progressRatio = newProgress / 100;

        return {
          ...prev,
          progress: newProgress,
          currentLat: prev.from.lat + latDiff * progressRatio,
          currentLng: prev.from.lng + lngDiff * progressRatio,
          status: newProgress >= 100 ? 'delivered' : 'in-transit',
          eta: newProgress >= 100 ? 'Delivered' : `${Math.ceil((100 - newProgress) / 10)} hours`,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedItemId]);

  const selectItem = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  return {
    trackingData,
    selectItem,
  };
}
