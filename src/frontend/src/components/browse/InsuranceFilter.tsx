import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface InsuranceFilterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function InsuranceFilter({ checked, onChange }: InsuranceFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="insurance" checked={checked} onCheckedChange={onChange} />
      <Label htmlFor="insurance" className="cursor-pointer">
        With Insurance
      </Label>
    </div>
  );
}
