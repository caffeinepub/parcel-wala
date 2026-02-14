import { MapPin, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface TimelineEvent {
  timestamp: string;
  location: string;
  status: string;
  lat: number;
  lng: number;
}

interface TrackingTimelineProps {
  timeline: TimelineEvent[];
}

export default function TrackingTimeline({ timeline }: TrackingTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracking History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((event, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {index === timeline.length - 1 ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </div>
                {index < timeline.length - 1 && (
                  <div className="h-full w-0.5 bg-border" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className="font-semibold">{event.status}</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
                <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                <p className="text-xs text-muted-foreground">
                  {event.lat.toFixed(4)}, {event.lng.toFixed(4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
