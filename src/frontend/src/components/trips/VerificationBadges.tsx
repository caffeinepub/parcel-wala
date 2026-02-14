import React from 'react';
import { Trip } from '../../backend';
import { Badge } from '../ui/badge';

interface VerificationBadgesProps {
  trip: Trip;
}

export default function VerificationBadges({ trip }: VerificationBadgesProps) {
  const badges: React.ReactElement[] = [];

  if (trip.details.__kind__ === 'onCar' && trip.details.onCar.verified) {
    badges.push(
      <Badge key="car" variant="secondary" className="text-xs">
        ✓ Vehicle
      </Badge>
    );
  }

  if (trip.details.__kind__ === 'onBus' && trip.details.onBus.verified) {
    badges.push(
      <Badge key="bus" variant="secondary" className="text-xs">
        ✓ Ticket
      </Badge>
    );
  }

  if (trip.details.__kind__ === 'onTrain' && trip.details.onTrain.verified) {
    badges.push(
      <Badge key="train" variant="secondary" className="text-xs">
        ✓ PNR
      </Badge>
    );
  }

  if (trip.details.__kind__ === 'onFlight' && trip.details.onFlight.confirmed) {
    badges.push(
      <Badge key="flight" variant="secondary" className="text-xs">
        ✓ Flight
      </Badge>
    );
  }

  return <>{badges}</>;
}
