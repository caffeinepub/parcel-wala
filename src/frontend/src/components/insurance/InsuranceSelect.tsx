import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Mode } from '../../backend';
import { getInsuranceCoverage } from '../../lib/domain/insurance';

interface InsuranceSelectProps {
  value: 'none' | 'basic' | 'premium';
  onChange: (value: 'none' | 'basic' | 'premium') => void;
  travelMode: Mode;
}

export default function InsuranceSelect({ value, onChange, travelMode }: InsuranceSelectProps) {
  const basicCoverage = getInsuranceCoverage('basic', travelMode);
  const premiumCoverage = getInsuranceCoverage('premium', travelMode);

  return (
    <div className="space-y-2">
      <Label htmlFor="insurance">Insurance Coverage</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="insurance">
          <SelectValue placeholder="Select insurance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Insurance (Free)</SelectItem>
          <SelectItem value="basic">
            Basic Cover - ₹{basicCoverage.cost} (up to ₹{basicCoverage.coverage})
          </SelectItem>
          <SelectItem value="premium">
            Premium Cover - ₹{premiumCoverage.cost} (up to ₹{premiumCoverage.coverage} + Trip delay)
          </SelectItem>
        </SelectContent>
      </Select>
      {value !== 'none' && (
        <p className="text-xs text-muted-foreground">
          ✓ Increases booking rate by 60% • Priority in search results
        </p>
      )}
    </div>
  );
}
