import { Mode } from '../../backend';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

interface TripModeDetailsFormProps {
  mode: Mode;
  carReg: string;
  carVerified: boolean;
  onCarRegChange: (value: string) => void;
  onCarVerifiedChange: (value: boolean) => void;
  busOperator: string;
  busSeat: string;
  busTicket: string;
  busVerified: boolean;
  onBusOperatorChange: (value: string) => void;
  onBusSeatChange: (value: string) => void;
  onBusTicketChange: (value: string) => void;
  onBusVerifiedChange: (value: boolean) => void;
  trainNumber: string;
  trainName: string;
  trainPnr: string;
  trainSeat: string;
  trainVerified: boolean;
  onTrainNumberChange: (value: string) => void;
  onTrainNameChange: (value: string) => void;
  onTrainPnrChange: (value: string) => void;
  onTrainSeatChange: (value: string) => void;
  onTrainVerifiedChange: (value: boolean) => void;
  flightNumber: string;
  airline: string;
  flightPnr: string;
  flightConfirmed: boolean;
  onFlightNumberChange: (value: string) => void;
  onAirlineChange: (value: string) => void;
  onFlightPnrChange: (value: string) => void;
  onFlightConfirmedChange: (value: boolean) => void;
}

export default function TripModeDetailsForm(props: TripModeDetailsFormProps) {
  if (props.mode === Mode.car) {
    return (
      <div className="space-y-3 rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">🚗 Car Details</h3>
        <div className="space-y-2">
          <Label htmlFor="carReg">Vehicle Registration</Label>
          <Input
            id="carReg"
            value={props.carReg}
            onChange={(e) => props.onCarRegChange(e.target.value)}
            placeholder="e.g., MH01AB1234"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="carVerified"
            checked={props.carVerified}
            onCheckedChange={props.onCarVerifiedChange}
          />
          <Label htmlFor="carVerified" className="cursor-pointer">
            Vehicle Verified (+80% booking rate)
          </Label>
        </div>
      </div>
    );
  }

  if (props.mode === Mode.bus) {
    return (
      <div className="space-y-3 rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
        <h3 className="font-semibold text-green-900 dark:text-green-100">🚌 Bus Details</h3>
        <div className="space-y-2">
          <Label htmlFor="busOperator">Bus Operator</Label>
          <Input
            id="busOperator"
            value={props.busOperator}
            onChange={(e) => props.onBusOperatorChange(e.target.value)}
            placeholder="e.g., VRL Travels"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="busSeat">Seat Number</Label>
          <Input
            id="busSeat"
            value={props.busSeat}
            onChange={(e) => props.onBusSeatChange(e.target.value)}
            placeholder="e.g., 22A"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="busTicket">E-Ticket Reference (optional)</Label>
          <Input
            id="busTicket"
            value={props.busTicket}
            onChange={(e) => props.onBusTicketChange(e.target.value)}
            placeholder="Ticket number"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="busVerified"
            checked={props.busVerified}
            onCheckedChange={props.onBusVerifiedChange}
          />
          <Label htmlFor="busVerified" className="cursor-pointer">
            Ticket Verified
          </Label>
        </div>
      </div>
    );
  }

  if (props.mode === Mode.train) {
    return (
      <div className="space-y-3 rounded-lg border-2 border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950">
        <h3 className="font-semibold text-purple-900 dark:text-purple-100">🚆 Train Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trainNumber">Train Number</Label>
            <Input
              id="trainNumber"
              value={props.trainNumber}
              onChange={(e) => props.onTrainNumberChange(e.target.value)}
              placeholder="e.g., 12951"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trainName">Train Name</Label>
            <Input
              id="trainName"
              value={props.trainName}
              onChange={(e) => props.onTrainNameChange(e.target.value)}
              placeholder="e.g., Mumbai Rajdhani"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="trainPnr">PNR Number</Label>
          <Input
            id="trainPnr"
            value={props.trainPnr}
            onChange={(e) => props.onTrainPnrChange(e.target.value)}
            placeholder="10-digit PNR"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trainSeat">Seat/Berth Number</Label>
          <Input
            id="trainSeat"
            value={props.trainSeat}
            onChange={(e) => props.onTrainSeatChange(e.target.value)}
            placeholder="e.g., A1-45"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="trainVerified"
            checked={props.trainVerified}
            onCheckedChange={props.onTrainVerifiedChange}
          />
          <Label htmlFor="trainVerified" className="cursor-pointer">
            PNR Verified (auto-checks with IRCTC)
          </Label>
        </div>
      </div>
    );
  }

  if (props.mode === Mode.flight) {
    return (
      <div className="space-y-3 rounded-lg border-2 border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
        <h3 className="font-semibold text-orange-900 dark:text-orange-100">✈️ Flight Details</h3>
        <p className="text-xs text-orange-700 dark:text-orange-300">
          ⚠️ Flight number and booking PNR are required for security compliance
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="flightNumber">Flight Number *</Label>
            <Input
              id="flightNumber"
              value={props.flightNumber}
              onChange={(e) => props.onFlightNumberChange(e.target.value)}
              placeholder="e.g., AI101"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="airline">Airline</Label>
            <Input
              id="airline"
              value={props.airline}
              onChange={(e) => props.onAirlineChange(e.target.value)}
              placeholder="e.g., Air India"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="flightPnr">Booking PNR/Confirmation *</Label>
          <Input
            id="flightPnr"
            value={props.flightPnr}
            onChange={(e) => props.onFlightPnrChange(e.target.value)}
            placeholder="6-character PNR"
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="flightConfirmed"
            checked={props.flightConfirmed}
            onCheckedChange={props.onFlightConfirmedChange}
          />
          <Label htmlFor="flightConfirmed" className="cursor-pointer">
            Flight Confirmed (checks real-time status)
          </Label>
        </div>
      </div>
    );
  }

  if (props.mode === Mode.bike) {
    return (
      <div className="space-y-3 rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
        <h3 className="font-semibold text-red-900 dark:text-red-100">🏍️ Bike/Scooter Details</h3>
        <p className="text-xs text-red-700 dark:text-red-300">
          Note: Limited capacity (2-5kg max recommended)
        </p>
        <div className="space-y-2">
          <Label htmlFor="bikeReg">Vehicle Registration</Label>
          <Input
            id="bikeReg"
            value={props.carReg}
            onChange={(e) => props.onCarRegChange(e.target.value)}
            placeholder="e.g., MH01AB1234"
          />
        </div>
      </div>
    );
  }

  return null;
}
