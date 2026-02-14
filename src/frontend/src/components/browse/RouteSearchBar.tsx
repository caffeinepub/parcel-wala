import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { MapPin, Navigation, ArrowLeftRight } from 'lucide-react';
import { Badge } from '../ui/badge';

interface RouteSearchBarProps {
  fromLocation: string;
  toLocation: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

const popularRoutes = [
  { from: 'Mumbai', to: 'Delhi' },
  { from: 'Bangalore', to: 'Chennai' },
  { from: 'Delhi', to: 'Jaipur' },
  { from: 'Pune', to: 'Mumbai' },
];

export default function RouteSearchBar({
  fromLocation,
  toLocation,
  onFromChange,
  onToChange,
}: RouteSearchBarProps) {
  const handleSwap = () => {
    const temp = fromLocation;
    onFromChange(toLocation);
    onToChange(temp);
  };

  const handleRouteClick = (from: string, to: string) => {
    onFromChange(from);
    onToChange(to);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={fromLocation}
            onChange={(e) => onFromChange(e.target.value)}
            placeholder="From (city)"
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" onClick={handleSwap}>
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
        <div className="relative flex-1">
          <Navigation className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={toLocation}
            onChange={(e) => onToChange(e.target.value)}
            placeholder="To (city)"
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {popularRoutes.map((route, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleRouteClick(route.from, route.to)}
          >
            {route.from} → {route.to}
          </Badge>
        ))}
      </div>
    </div>
  );
}
