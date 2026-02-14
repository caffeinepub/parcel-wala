import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { calculatePrice } from '../../lib/pricing/priceCalculator';
import { Mode } from '../../backend';
import { Calculator } from 'lucide-react';

interface PriceCalculatorCardProps {
  from: string;
  to: string;
  weight: number;
  onApplyPrice: (price: string) => void;
}

export default function PriceCalculatorCard({
  from,
  to,
  weight,
  onApplyPrice,
}: PriceCalculatorCardProps) {
  const [urgency, setUrgency] = useState<'normal' | 'express' | 'same-day'>('normal');
  const [mode, setMode] = useState<Mode>(Mode.car);
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [fragile, setFragile] = useState(false);
  const [doorPickup, setDoorPickup] = useState(false);
  const [insuranceTier, setInsuranceTier] = useState<'none' | 'basic' | 'premium'>('none');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const handleCalculate = () => {
    if (!from || !to || !weight) return;
    const price = calculatePrice(from, to, weight, urgency, mode, size, fragile, doorPickup, insuranceTier);
    setCalculatedPrice(price);
  };

  const handleApply = () => {
    if (calculatedPrice !== null) {
      onApplyPrice(calculatedPrice.toString());
    }
  };

  return (
    <Card className="border-primary/30 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Price Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Travel Mode</Label>
            <Select value={mode} onValueChange={(v: Mode) => setMode(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Mode.car}>Car</SelectItem>
                <SelectItem value={Mode.bus}>Bus</SelectItem>
                <SelectItem value={Mode.train}>Train</SelectItem>
                <SelectItem value={Mode.flight}>Flight</SelectItem>
                <SelectItem value={Mode.bike}>Bike</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Parcel Size</Label>
            <Select value={size} onValueChange={(v: any) => setSize(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Delivery Speed</Label>
          <Select value={urgency} onValueChange={(v: any) => setUrgency(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal (3-5 days)</SelectItem>
              <SelectItem value="express">Express (1-2 days)</SelectItem>
              <SelectItem value="same-day">Same Day</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Insurance</Label>
          <Select value={insuranceTier} onValueChange={(v: any) => setInsuranceTier(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Insurance</SelectItem>
              <SelectItem value="basic">Basic (₹500 cover)</SelectItem>
              <SelectItem value="premium">Premium (₹2000 cover)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="fragile">Fragile Item</Label>
            <Switch id="fragile" checked={fragile} onCheckedChange={setFragile} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="doorPickup">Door Pickup</Label>
            <Switch id="doorPickup" checked={doorPickup} onCheckedChange={setDoorPickup} />
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          variant="outline"
          className="w-full"
          disabled={!from || !to || !weight}
        >
          Calculate Price
        </Button>

        {calculatedPrice !== null && (
          <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/10 p-4">
            <p className="text-sm">
              Suggested Price: <strong className="text-xl">₹{calculatedPrice}</strong>
            </p>
            <Button onClick={handleApply} className="w-full" size="sm">
              Apply to Form
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
