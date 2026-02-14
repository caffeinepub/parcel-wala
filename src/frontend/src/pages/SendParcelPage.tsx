import { useState } from 'react';
import { useCreateParcel } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import PriceCalculatorCard from '../components/pricing/PriceCalculatorCard';
import { Mode } from '../backend';
import { toast } from 'sonner';
import { TabId } from '../App';

interface SendParcelPageProps {
  onNavigate: (tab: TabId) => void;
}

export default function SendParcelPage({ onNavigate }: SendParcelPageProps) {
  const createParcel = useCreateParcel();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!from || !to || !description || !weight) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const parcelDescription = `${description} | From: ${from} | To: ${to} | Weight: ${weight}kg${price ? ` | Price: ₹${price}` : ''}`;

      // Use car as default mode since travel mode selector is removed
      await createParcel.mutateAsync({
        desc: parcelDescription,
        mode: Mode.car,
      });

      toast.success('Parcel posted successfully!');
      
      // Reset form
      setFrom('');
      setTo('');
      setDescription('');
      setWeight('');
      setPrice('');

      onNavigate('listings');
    } catch (error) {
      toast.error('Failed to post parcel');
      console.error(error);
    }
  };

  return (
    <div className="container max-w-2xl space-y-6 p-4">
      {/* Header Illustration */}
      <div className="overflow-hidden rounded-2xl shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
        <img
          src="/assets/generated/send-parcel-illustration.dim_900x600.png"
          alt="Parcel delivery illustration with city and sky-blue accents"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="sky-gradient-header rounded-xl p-4 shadow-sm">
        <h1 className="text-2xl font-bold">Send a Parcel</h1>
        <p className="text-sm text-muted-foreground">
          Find travelers going your way
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from">From *</Label>
            <Input
              id="from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Origin city"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">To *</Label>
            <Input
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Destination city"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you sending?"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg) *</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0.0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Offered Price (₹)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Optional"
          />
        </div>

        {from && to && weight && (
          <PriceCalculatorCard
            from={from}
            to={to}
            weight={parseFloat(weight) || 0}
            onApplyPrice={setPrice}
          />
        )}

        <Button type="submit" className="w-full" disabled={createParcel.isPending}>
          {createParcel.isPending ? 'Posting...' : 'Post Parcel'}
        </Button>
      </form>
    </div>
  );
}
