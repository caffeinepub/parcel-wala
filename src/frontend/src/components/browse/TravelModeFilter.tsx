import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Mode } from '../../backend';

interface TravelModeFilterProps {
  value: Mode | 'all';
  onChange: (value: Mode | 'all') => void;
}

export default function TravelModeFilter({ value, onChange }: TravelModeFilterProps) {
  return (
    <div className="space-y-2">
      <Label>Travel Mode</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="All modes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Modes</SelectItem>
          <SelectItem value={Mode.car}>🚗 Car</SelectItem>
          <SelectItem value={Mode.bus}>🚌 Bus</SelectItem>
          <SelectItem value={Mode.train}>🚆 Train</SelectItem>
          <SelectItem value={Mode.flight}>✈️ Flight</SelectItem>
          <SelectItem value={Mode.bike}>🏍️ Bike</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
