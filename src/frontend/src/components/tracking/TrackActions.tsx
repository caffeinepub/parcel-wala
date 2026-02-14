import { Button } from '../ui/button';
import { Map, Navigation, Route, Share2 } from 'lucide-react';
import { openGoogleMaps, openAppleMaps, navigateFromMyLocation, viewFullRoute } from '../../lib/tracking/navigationLinks';
import { shareTrackingLink } from '../../lib/share/shareTracking';
import { toast } from 'sonner';

interface TrackActionsProps {
  currentLat: number;
  currentLng: number;
  from: { lat: number; lng: number; name: string };
  to: { lat: number; lng: number; name: string };
  trackingId: string;
}

export default function TrackActions({ currentLat, currentLng, from, to, trackingId }: TrackActionsProps) {
  const handleShare = async () => {
    const success = await shareTrackingLink(trackingId);
    if (success) {
      toast.success('Tracking link copied to clipboard!');
    } else {
      toast.error('Failed to share tracking link');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => openGoogleMaps(currentLat, currentLng)}
      >
        <Map className="h-4 w-4" />
        Google Maps
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => openAppleMaps(currentLat, currentLng)}
      >
        <Map className="h-4 w-4" />
        Apple Maps
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => navigateFromMyLocation(currentLat, currentLng)}
      >
        <Navigation className="h-4 w-4" />
        Navigate
      </Button>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => viewFullRoute(from.lat, from.lng, to.lat, to.lng)}
      >
        <Route className="h-4 w-4" />
        Full Route
      </Button>
      <Button
        variant="default"
        className="col-span-2 gap-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        Share Live Tracking Link
      </Button>
    </div>
  );
}
