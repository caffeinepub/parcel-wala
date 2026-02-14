import { Trip } from '../../backend';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import TravelModeBadge from '../trips/TravelModeBadge';
import VerificationBadges from '../trips/VerificationBadges';
import { MapPin, Calendar, IndianRupee } from 'lucide-react';
import { deserializeTrip } from '../../lib/domain/serialization';

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const data = deserializeTrip(JSON.stringify(trip.details));

  return (
    <Card className="transition-all duration-200 motion-safe:hover:shadow-lg motion-safe:hover:-translate-y-0.5">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <TravelModeBadge mode={trip.travelMode} />
            <div className="flex gap-1">
              <VerificationBadges trip={trip} />
              {data?.insuranceTier && data.insuranceTier !== 'none' && (
                <Badge variant="secondary" className="text-xs">
                  🛡️
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {data?.from || 'Unknown'} → {data?.to || 'Unknown'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{data?.date || 'No date'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IndianRupee className="h-4 w-4" />
              <span className="font-semibold text-foreground">
                ₹{data?.pricePerKg || 0}/kg • {data?.capacity || 0}kg available
              </span>
            </div>
          </div>

          {trip.details.__kind__ === 'onTrain' && (
            <div className="rounded bg-muted p-2 text-xs">
              <p>
                <strong>Train:</strong> {trip.details.onTrain.trainNumber} -{' '}
                {trip.details.onTrain.trainName}
              </p>
              <p>
                <strong>Seat:</strong> {trip.details.onTrain.seatBerth}
              </p>
            </div>
          )}

          {trip.details.__kind__ === 'onFlight' && (
            <div className="rounded bg-muted p-2 text-xs">
              <p>
                <strong>Flight:</strong> {trip.details.onFlight.flightNumber} -{' '}
                {trip.details.onFlight.airline}
              </p>
            </div>
          )}

          {trip.details.__kind__ === 'onBus' && (
            <div className="rounded bg-muted p-2 text-xs">
              <p>
                <strong>Bus:</strong> {trip.details.onBus.operator}
              </p>
              <p>
                <strong>Seat:</strong> {trip.details.onBus.seatNumber.toString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
