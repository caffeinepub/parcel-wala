export interface ParcelData {
  from: string;
  to: string;
  category: string;
  weight: number;
  size: string;
  date: string;
  price: number;
  description: string;
  insuranceTier: 'none' | 'basic' | 'premium';
}

export interface TripData {
  from: string;
  to: string;
  date: string;
  capacity: number;
  pricePerKg: number;
  insuranceTier: 'none' | 'basic' | 'premium';
}

export function serializeParcel(data: ParcelData): string {
  return JSON.stringify(data);
}

export function deserializeParcel(serialized: string): ParcelData | null {
  try {
    return JSON.parse(serialized);
  } catch {
    return null;
  }
}

export function serializeTrip(data: TripData): string {
  return JSON.stringify(data);
}

export function deserializeTrip(serialized: string): TripData | null {
  try {
    return JSON.parse(serialized);
  } catch {
    return null;
  }
}
