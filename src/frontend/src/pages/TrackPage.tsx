import { useTracking } from '../hooks/useTracking';
import TrackActions from '../components/tracking/TrackActions';
import TrackingTimeline from '../components/tracking/TrackingTimeline';
import TrackedItemPicker from '../components/tracking/TrackedItemPicker';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { MapPin, Clock } from 'lucide-react';

export default function TrackPage() {
  const { trackingData, selectItem } = useTracking();

  if (!trackingData) {
    return (
      <div className="container max-w-2xl space-y-6 p-4">
        <h1 className="text-2xl font-bold">Track Delivery</h1>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
          <MapPin className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <p className="mb-4 text-sm text-muted-foreground">
            Select a parcel or trip to track its delivery status
          </p>
          <TrackedItemPicker onSelect={selectItem} />
        </div>
      </div>
    );
  }

  const { id, status, progress, currentLat, currentLng, from, to, eta, timeline } = trackingData;

  return (
    <div className="container max-w-2xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Track Delivery</h1>
        <TrackedItemPicker onSelect={selectItem} />
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Tracking ID: {id}</span>
          <Badge variant={status === 'delivered' ? 'default' : 'secondary'}>
            {status === 'in-transit' ? 'In Transit' : 'Delivered'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>Current Location</span>
            </div>
            <p className="font-medium">
              {currentLat.toFixed(4)}, {currentLng.toFixed(4)}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>ETA</span>
            </div>
            <p className="font-medium">{eta}</p>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">Route</p>
          <p className="font-medium">
            {from.name} → {to.name}
          </p>
        </div>
      </div>

      <TrackActions
        currentLat={currentLat}
        currentLng={currentLng}
        from={from}
        to={to}
        trackingId={id}
      />

      <TrackingTimeline timeline={timeline} />
    </div>
  );
}
