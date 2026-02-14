import { Package, Car, MapPin, IndianRupee, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TabId } from '../App';
import { useListParcels, useListTrips } from '../hooks/useQueries';

interface HomePageProps {
  onNavigate: (tab: TabId) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: parcels = [] } = useListParcels();
  const { data: trips = [] } = useListTrips();

  const myParcelsCount = parcels.length;
  const myTripsCount = trips.length;

  return (
    <div className="container max-w-2xl space-y-6 p-4">
      <div className="space-y-2 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Parcel Wala</h1>
        <p className="text-muted-foreground">
          Send parcels or earn money by carrying packages on your journey
        </p>
      </div>

      {/* Hero Image with Parcel Wala branding */}
      <div className="overflow-hidden rounded-2xl shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
        <img
          src="/assets/generated/home-hero-photo-pacel-wala.dim_1200x600.jpg"
          alt="Parcel Wala - Courier package and smartphone"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => onNavigate('send')}
          className="h-24 flex-col gap-2 transition-all duration-200 motion-safe:hover:scale-105 motion-safe:hover:shadow-lg motion-safe:active:scale-95"
          variant="outline"
        >
          <Package className="h-6 w-6" />
          <span>Send Parcel</span>
        </Button>
        <Button
          onClick={() => onNavigate('offer')}
          className="h-24 flex-col gap-2 transition-all duration-200 motion-safe:hover:scale-105 motion-safe:hover:shadow-lg motion-safe:active:scale-95"
          variant="outline"
        >
          <Car className="h-6 w-6" />
          <span>Offer Trip</span>
        </Button>
        <Button
          onClick={() => onNavigate('browse')}
          className="h-24 flex-col gap-2 transition-all duration-200 motion-safe:hover:scale-105 motion-safe:hover:shadow-lg motion-safe:active:scale-95"
          variant="outline"
        >
          <MapPin className="h-6 w-6" />
          <span>Browse</span>
        </Button>
        <Button
          onClick={() => onNavigate('earnings')}
          className="h-24 flex-col gap-2 transition-all duration-200 motion-safe:hover:scale-105 motion-safe:hover:shadow-lg motion-safe:active:scale-95"
          variant="outline"
        >
          <IndianRupee className="h-6 w-6" />
          <span>Earnings</span>
        </Button>
      </div>

      <Card className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active Parcels</span>
            <span className="text-2xl font-bold">{myParcelsCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active Trips</span>
            <span className="text-2xl font-bold">{myTripsCount}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-200">
        <CardHeader>
          <CardTitle className="text-primary">
            Earn While You Travel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-foreground/90">
          <p>💰 <strong>Bus/Train:</strong> ₹200-800 per trip</p>
          <p>✈️ <strong>Flight:</strong> ₹500-2000 per trip</p>
          <p>🚗 <strong>Car:</strong> Offset your fuel costs</p>
        </CardContent>
      </Card>
    </div>
  );
}
