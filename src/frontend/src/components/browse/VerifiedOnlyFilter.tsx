import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface VerifiedOnlyFilterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function VerifiedOnlyFilter({ checked, onChange }: VerifiedOnlyFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="verified" checked={checked} onCheckedChange={onChange} />
      <Label htmlFor="verified" className="cursor-pointer">
        Verified Users Only
      </Label>
    </div>
  );
}
