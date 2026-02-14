import { Button } from '../ui/button';
import { Package } from 'lucide-react';

interface TrackedItemPickerProps {
  onSelect: (itemId: string) => void;
}

export default function TrackedItemPicker({ onSelect }: TrackedItemPickerProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Select a delivery to track:</p>
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={() => onSelect('DEL001')}
      >
        <Package className="h-4 w-4" />
        <span>Mumbai → Delhi (DEL001)</span>
      </Button>
    </div>
  );
}
