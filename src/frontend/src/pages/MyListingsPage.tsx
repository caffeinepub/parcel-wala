import { useListParcels, useListTrips, useDeleteParcel, useDeleteTrip } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ParcelCard from '../components/cards/ParcelCard';
import TripCard from '../components/cards/TripCard';
import SkeletonCard from '../components/loading/SkeletonCard';
import { Button } from '../components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { TabId } from '../App';

interface MyListingsPageProps {
  onNavigate: (tab: TabId) => void;
}

export default function MyListingsPage({ onNavigate }: MyListingsPageProps) {
  const { identity } = useInternetIdentity();
  const { data: allParcels = [], isLoading: parcelsLoading } = useListParcels();
  const { data: allTrips = [], isLoading: tripsLoading } = useListTrips();
  const deleteParcel = useDeleteParcel();
  const deleteTrip = useDeleteTrip();

  const myPrincipal = identity?.getPrincipal().toString();

  const myParcels = allParcels.filter(p => p.sender.toString() === myPrincipal);
  const myTrips = allTrips.filter(t => t.carrier.toString() === myPrincipal);

  const handleDeleteParcel = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this parcel?')) return;
    
    try {
      await deleteParcel.mutateAsync(id);
      toast.success('Parcel deleted successfully');
    } catch (error) {
      toast.error('Failed to delete parcel');
      console.error(error);
    }
  };

  const handleDeleteTrip = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      await deleteTrip.mutateAsync(id);
      toast.success('Trip deleted successfully');
    } catch (error) {
      toast.error('Failed to delete trip');
      console.error(error);
    }
  };

  if (parcelsLoading || tripsLoading) {
    return (
      <div className="container max-w-2xl space-y-6 p-4">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">My Parcels</h2>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <h2 className="text-lg font-semibold">My Trips</h2>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">My Listings</h1>

      <div className="space-y-4">
        <div>
          <h2 className="mb-3 text-lg font-semibold">My Parcels ({myParcels.length})</h2>
          {myParcels.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
              <p className="mb-4 text-sm text-muted-foreground">
                You haven't posted any parcels yet
              </p>
              <Button 
                onClick={() => onNavigate('send')}
                className="transition-all duration-200 motion-safe:hover:scale-105 motion-safe:active:scale-95"
              >
                Post a Parcel
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {myParcels.map((parcel, index) => (
                <div 
                  key={parcel.id.toString()} 
                  className="relative motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <ParcelCard parcel={parcel} />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 transition-all duration-200 motion-safe:hover:scale-110 motion-safe:active:scale-95"
                    onClick={() => handleDeleteParcel(parcel.id)}
                    disabled={deleteParcel.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">My Trips ({myTrips.length})</h2>
          {myTrips.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
              <p className="mb-4 text-sm text-muted-foreground">
                You haven't posted any trips yet
              </p>
              <Button 
                onClick={() => onNavigate('offer')}
                className="transition-all duration-200 motion-safe:hover:scale-105 motion-safe:active:scale-95"
              >
                Offer a Trip
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {myTrips.map((trip, index) => (
                <div 
                  key={trip.id.toString()} 
                  className="relative motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <TripCard trip={trip} />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 transition-all duration-200 motion-safe:hover:scale-110 motion-safe:active:scale-95"
                    onClick={() => handleDeleteTrip(trip.id)}
                    disabled={deleteTrip.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
