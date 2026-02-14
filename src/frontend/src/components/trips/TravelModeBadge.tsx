import { Mode } from '../../backend';
import { Badge } from '../ui/badge';

interface TravelModeBadgeProps {
  mode: Mode;
}

const modeConfig: Record<Mode, { icon: string; label: string; color: string }> = {
  [Mode.car]: { icon: '🚗', label: 'Car', color: 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' },
  [Mode.bus]: { icon: '🚌', label: 'Bus', color: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100' },
  [Mode.train]: { icon: '🚆', label: 'Train', color: 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100' },
  [Mode.flight]: { icon: '✈️', label: 'Flight', color: 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100' },
  [Mode.bike]: { icon: '🏍️', label: 'Bike', color: 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100' },
};

export default function TravelModeBadge({ mode }: TravelModeBadgeProps) {
  const config = modeConfig[mode];

  return (
    <Badge className={config.color}>
      {config.icon} {config.label}
    </Badge>
  );
}
