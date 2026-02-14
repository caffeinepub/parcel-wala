import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Mode } from '../../backend';

interface TravelModeSelectProps {
  value: Mode | '';
  onChange: (value: Mode) => void;
}

export default function TravelModeSelect({ value, onChange }: TravelModeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="travelMode">How are you traveling? *</Label>
      <Select value={value} onValueChange={(v) => onChange(v as Mode)} required>
        <SelectTrigger id="travelMode" className="border-primary">
          <SelectValue placeholder="Select travel mode" />
        </SelectTrigger>
        <SelectContent>
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
