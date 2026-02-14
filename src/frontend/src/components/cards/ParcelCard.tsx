import { Parcel } from '../../backend';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Package, MapPin, Calendar, IndianRupee } from 'lucide-react';
import { deserializeParcel } from '../../lib/domain/serialization';

interface ParcelCardProps {
  parcel: Parcel;
}

export default function ParcelCard({ parcel }: ParcelCardProps) {
  const data = deserializeParcel(parcel.description);

  return (
    <Card className="transition-all duration-200 motion-safe:hover:shadow-lg motion-safe:hover:-translate-y-0.5">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">{data?.category || 'Parcel'}</span>
            </div>
            {data?.insuranceTier && data.insuranceTier !== 'none' && (
              <Badge variant="secondary">🛡️ Insured</Badge>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {data?.from || 'Unknown'} → {data?.to || 'Unknown'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{data?.date || 'No date'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IndianRupee className="h-4 w-4" />
              <span className="font-semibold text-foreground">₹{data?.price || 0}</span>
            </div>
          </div>

          {data?.description && (
            <p className="text-sm text-muted-foreground">{data.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
