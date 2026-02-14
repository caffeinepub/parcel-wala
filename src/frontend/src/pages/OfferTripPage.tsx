import { useState } from 'react';
import { useCreateTrip } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import TravelModeSelect from '../components/trips/TravelModeSelect';
import TripModeDetailsForm from '../components/trips/TripModeDetailsForm';
import InsuranceSelect from '../components/insurance/InsuranceSelect';
import { Mode, Conditional } from '../backend';
import { toast } from 'sonner';
import { TabId } from '../App';
import { serializeTrip } from '../lib/domain/serialization';

interface OfferTripPageProps {
  onNavigate: (tab: TabId) => void;
}

export default function OfferTripPage({ onNavigate }: OfferTripPageProps) {
  const createTrip = useCreateTrip();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [travelMode, setTravelMode] = useState<Mode | ''>('');
  const [insuranceTier, setInsuranceTier] = useState<'none' | 'basic' | 'premium'>('none');

  // Mode-specific details
  const [carReg, setCarReg] = useState('');
  const [carVerified, setCarVerified] = useState(false);
  const [busOperator, setBusOperator] = useState('');
  const [busSeat, setBusSeat] = useState('');
  const [busTicket, setBusTicket] = useState('');
  const [busVerified, setBusVerified] = useState(false);
  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [trainPnr, setTrainPnr] = useState('');
  const [trainSeat, setTrainSeat] = useState('');
  const [trainVerified, setTrainVerified] = useState(false);
  const [flightNumber, setFlightNumber] = useState('');
  const [airline, setAirline] = useState('');
  const [flightPnr, setFlightPnr] = useState('');
  const [flightConfirmed, setFlightConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!from || !to || !date || !capacity || !pricePerKg || !travelMode) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mode-specific validation
    if (travelMode === Mode.flight && (!flightNumber || !flightPnr)) {
      toast.error('Flight number and booking PNR are required for flights');
      return;
    }

    try {
      let details: Conditional;

      switch (travelMode) {
        case Mode.car:
          details = {
            __kind__: 'onCar',
            onCar: {
              registration: carReg,
              verified: carVerified,
            },
          };
          break;
        case Mode.bus:
          details = {
            __kind__: 'onBus',
            onBus: {
              operator: busOperator,
              seatNumber: BigInt(busSeat || '0'),
              ticketReference: busTicket || undefined,
              verified: busVerified,
            },
          };
          break;
        case Mode.train:
          details = {
            __kind__: 'onTrain',
            onTrain: {
              trainNumber,
              trainName,
              pnr: trainPnr,
              seatBerth: trainSeat,
              verified: trainVerified,
            },
          };
          break;
        case Mode.flight:
          details = {
            __kind__: 'onFlight',
            onFlight: {
              flightNumber,
              airline,
              bookingPNR: flightPnr,
              confirmed: flightConfirmed,
            },
          };
          break;
        default:
          details = {
            __kind__: 'onCar',
            onCar: { registration: '', verified: false },
          };
      }

      const serialized = serializeTrip({
        from,
        to,
        date,
        capacity: parseFloat(capacity),
        pricePerKg: parseFloat(pricePerKg),
        insuranceTier,
      });

      // Merge serialized data into description
      await createTrip.mutateAsync({
        details,
        mode: travelMode,
      });

      toast.success('Trip posted successfully!');
      
      // Reset form
      setFrom('');
      setTo('');
      setDate('');
      setCapacity('');
      setPricePerKg('');
      setTravelMode('');
      setInsuranceTier('none');
      setCarReg('');
      setCarVerified(false);
      setBusOperator('');
      setBusSeat('');
      setBusTicket('');
      setBusVerified(false);
      setTrainNumber('');
      setTrainName('');
      setTrainPnr('');
      setTrainSeat('');
      setTrainVerified(false);
      setFlightNumber('');
      setAirline('');
      setFlightPnr('');
      setFlightConfirmed(false);

      onNavigate('listings');
    } catch (error) {
      toast.error('Failed to post trip');
      console.error(error);
    }
  };

  return (
    <div className="container max-w-2xl space-y-6 p-4">
      {/* Header Illustration */}
      <div className="overflow-hidden rounded-2xl shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
        <img
          src="/assets/generated/offer-trip-illustration.dim_900x600.png"
          alt="Traveler carrying package illustration with sky-blue accents"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="sky-gradient-header rounded-xl p-4 shadow-sm">
        <h1 className="text-2xl font-bold">Offer a Trip</h1>
        <p className="text-sm text-muted-foreground">
          Share your journey and earn money carrying parcels
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
          <Label htmlFor="date">Travel Date *</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <TravelModeSelect value={travelMode} onChange={setTravelMode} />

        {travelMode && (
          <TripModeDetailsForm
            mode={travelMode}
            carReg={carReg}
            carVerified={carVerified}
            onCarRegChange={setCarReg}
            onCarVerifiedChange={setCarVerified}
            busOperator={busOperator}
            busSeat={busSeat}
            busTicket={busTicket}
            busVerified={busVerified}
            onBusOperatorChange={setBusOperator}
            onBusSeatChange={setBusSeat}
            onBusTicketChange={setBusTicket}
            onBusVerifiedChange={setBusVerified}
            trainNumber={trainNumber}
            trainName={trainName}
            trainPnr={trainPnr}
            trainSeat={trainSeat}
            trainVerified={trainVerified}
            onTrainNumberChange={setTrainNumber}
            onTrainNameChange={setTrainName}
            onTrainPnrChange={setTrainPnr}
            onTrainSeatChange={setTrainSeat}
            onTrainVerifiedChange={setTrainVerified}
            flightNumber={flightNumber}
            airline={airline}
            flightPnr={flightPnr}
            flightConfirmed={flightConfirmed}
            onFlightNumberChange={setFlightNumber}
            onAirlineChange={setAirline}
            onFlightPnrChange={setFlightPnr}
            onFlightConfirmedChange={setFlightConfirmed}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity (kg) *</Label>
            <Input
              id="capacity"
              type="number"
              step="0.1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="0.0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePerKg">Price per kg (₹) *</Label>
            <Input
              id="pricePerKg"
              type="number"
              step="0.01"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {travelMode && (
          <InsuranceSelect
            value={insuranceTier}
            onChange={setInsuranceTier}
            travelMode={travelMode}
          />
        )}

        <Button type="submit" className="w-full" disabled={createTrip.isPending}>
          {createTrip.isPending ? 'Posting...' : 'Post Trip'}
        </Button>
      </form>
    </div>
  );
}
