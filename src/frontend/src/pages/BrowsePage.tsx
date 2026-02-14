import { useState, useMemo } from 'react';
import { useListParcels, useListTrips, useGetAllUserProfiles } from '../hooks/useQueries';
import RouteSearchBar from '../components/browse/RouteSearchBar';
import ParcelCard from '../components/cards/ParcelCard';
import TripCard from '../components/cards/TripCard';
import SkeletonCard from '../components/loading/SkeletonCard';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { filterByRoute, filterByPrice, filterByInsurance, filterByVerified, filterByTravelMode } from '../lib/domain/search';
import { Mode, Parcel, Trip } from '../backend';
import { SlidersHorizontal } from 'lucide-react';

export default function BrowsePage() {
  const { data: parcels = [], isLoading: parcelsLoading } = useListParcels();
  const { data: trips = [], isLoading: tripsLoading } = useListTrips();
  const { data: profiles = {} } = useGetAllUserProfiles();

  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedMode, setSelectedMode] = useState<Mode | 'all'>('all');
  const [withInsurance, setWithInsurance] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filteredParcels = useMemo(() => {
    let result: Parcel[] = parcels;
    result = filterByRoute(result, fromLocation, toLocation) as Parcel[];
    if (maxPrice) result = filterByPrice(result, parseFloat(maxPrice)) as Parcel[];
    if (withInsurance) result = filterByInsurance(result) as Parcel[];
    if (verifiedOnly) result = filterByVerified(result, profiles) as Parcel[];
    if (selectedMode !== 'all') result = filterByTravelMode(result, selectedMode) as Parcel[];
    return result;
  }, [parcels, fromLocation, toLocation, maxPrice, withInsurance, verifiedOnly, selectedMode, profiles]);

  const filteredTrips = useMemo(() => {
    let result: Trip[] = trips;
    result = filterByRoute(result, fromLocation, toLocation) as Trip[];
    if (maxPrice) result = filterByPrice(result, parseFloat(maxPrice)) as Trip[];
    if (withInsurance) result = filterByInsurance(result) as Trip[];
    if (verifiedOnly) result = filterByVerified(result, profiles) as Trip[];
    if (selectedMode !== 'all') result = filterByTravelMode(result, selectedMode) as Trip[];
    return result;
  }, [trips, fromLocation, toLocation, maxPrice, withInsurance, verifiedOnly, selectedMode, profiles]);

  const isLoading = parcelsLoading || tripsLoading;
  const hasResults = filteredParcels.length > 0 || filteredTrips.length > 0;

  return (
    <div className="container max-w-2xl space-y-6 p-4">
      {/* Banner Image */}
      <div className="overflow-hidden rounded-2xl shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
        <img
          src="/assets/generated/browse-transport-photo.dim_1200x400.jpg"
          alt="Travel and transport on bright background"
          className="w-full h-auto object-cover"
        />
      </div>

      <div className="sky-gradient-header rounded-xl p-4 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Browse Listings</h1>
        <RouteSearchBar
          fromLocation={fromLocation}
          toLocation={toLocation}
          onFromChange={setFromLocation}
          onToChange={setToLocation}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading...' : `${filteredParcels.length + filteredTrips.length} results`}
        </p>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Results</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Max Price (₹)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="Any"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelMode">Travel Mode</Label>
                <Select value={selectedMode} onValueChange={(value) => setSelectedMode(value as Mode | 'all')}>
                  <SelectTrigger id="travelMode">
                    <SelectValue placeholder="All modes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All modes</SelectItem>
                    <SelectItem value={Mode.car}>Car</SelectItem>
                    <SelectItem value={Mode.bus}>Bus</SelectItem>
                    <SelectItem value={Mode.train}>Train</SelectItem>
                    <SelectItem value={Mode.flight}>Flight</SelectItem>
                    <SelectItem value={Mode.bike}>Bike</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="insurance">With Insurance</Label>
                <Switch
                  id="insurance"
                  checked={withInsurance}
                  onCheckedChange={setWithInsurance}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="verified">Verified Users Only</Label>
                <Switch
                  id="verified"
                  checked={verifiedOnly}
                  onCheckedChange={setVerifiedOnly}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : !hasResults ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <img
            src="/assets/generated/empty-search.dim_900x600.png"
            alt="No results found"
            className="mb-6 h-48 w-auto opacity-50"
          />
          <h3 className="text-lg font-semibold">No listings found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search criteria
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredParcels.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Parcels</h2>
              <div className="space-y-3">
                {filteredParcels.map((parcel) => (
                  <ParcelCard key={Number(parcel.id)} parcel={parcel} />
                ))}
              </div>
            </div>
          )}

          {filteredTrips.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Trips</h2>
              <div className="space-y-3">
                {filteredTrips.map((trip) => (
                  <TripCard key={Number(trip.id)} trip={trip} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
