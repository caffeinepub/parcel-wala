import { Parcel, Trip, Mode, UserProfile } from '../../backend';

export function filterByRoute(
  items: Parcel[],
  from: string,
  to: string
): Parcel[];
export function filterByRoute(
  items: Trip[],
  from: string,
  to: string
): Trip[];
export function filterByRoute(
  items: Parcel[] | Trip[],
  from: string,
  to: string
): Parcel[] | Trip[] {
  if (!from && !to) return items;

  if (items.length === 0) return items;

  // Check if we're dealing with Parcels (have description field)
  const firstItem = items[0];
  if ('description' in firstItem) {
    return (items as Parcel[]).filter((item) => {
      const desc = item.description.toLowerCase();
      const fromMatch = !from || desc.includes(from.toLowerCase());
      const toMatch = !to || desc.includes(to.toLowerCase());
      return fromMatch && toMatch;
    });
  }

  // For Trips, we can't filter by route since they don't have description
  return items;
}

export function filterByPrice(
  items: Parcel[],
  maxPrice: number
): Parcel[];
export function filterByPrice(
  items: Trip[],
  maxPrice: number
): Trip[];
export function filterByPrice(
  items: Parcel[] | Trip[],
  maxPrice: number
): Parcel[] | Trip[] {
  if (items.length === 0) return items;

  const firstItem = items[0];
  if ('description' in firstItem) {
    return (items as Parcel[]).filter((item) => {
      try {
        const data = JSON.parse(item.description);
        return !data.price || data.price <= maxPrice;
      } catch {
        return true;
      }
    });
  }

  // For Trips, we can't filter by price since they don't have description
  return items;
}

export function filterByInsurance(items: Parcel[]): Parcel[];
export function filterByInsurance(items: Trip[]): Trip[];
export function filterByInsurance(items: Parcel[] | Trip[]): Parcel[] | Trip[] {
  if (items.length === 0) return items;

  const firstItem = items[0];
  if ('description' in firstItem) {
    return (items as Parcel[]).filter((item) => {
      try {
        const data = JSON.parse(item.description);
        return data.insuranceTier && data.insuranceTier !== 'none';
      } catch {
        return false;
      }
    });
  }

  // For Trips, we can't filter by insurance since they don't have description
  return items;
}

export function filterByVerified<T extends Parcel | Trip>(
  items: T[],
  profiles: Record<string, UserProfile | null>
): T[] {
  return items.filter((item) => {
    const principal = ('sender' in item ? item.sender : (item as Trip).carrier)?.toString();
    if (!principal) return false;
    const profile = profiles[principal];
    return profile?.identityVerified && profile?.phoneVerified;
  });
}

export function filterByTravelMode(items: Parcel[], mode: Mode): Parcel[];
export function filterByTravelMode(items: Trip[], mode: Mode): Trip[];
export function filterByTravelMode(
  items: Parcel[] | Trip[],
  mode: Mode
): Parcel[] | Trip[] {
  if (items.length === 0) return items;

  const firstItem = items[0];
  if ('description' in firstItem) {
    return (items as Parcel[]).filter((item) => item.travelMode === mode);
  }

  return (items as Trip[]).filter((item) => item.travelMode === mode);
}
