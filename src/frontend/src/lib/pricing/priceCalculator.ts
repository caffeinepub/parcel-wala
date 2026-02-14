import { Mode } from '../../backend';

const cityDistances: Record<string, Record<string, number>> = {
  mumbai: { delhi: 1400, bangalore: 980, chennai: 1340, pune: 150, jaipur: 1150 },
  delhi: { mumbai: 1400, bangalore: 2150, chennai: 2180, pune: 1450, jaipur: 280 },
  bangalore: { mumbai: 980, delhi: 2150, chennai: 350, pune: 840, jaipur: 2000 },
  chennai: { mumbai: 1340, delhi: 2180, bangalore: 350, pune: 1180, jaipur: 2050 },
  pune: { mumbai: 150, delhi: 1450, bangalore: 840, chennai: 1180, jaipur: 1200 },
  jaipur: { mumbai: 1150, delhi: 280, bangalore: 2000, chennai: 2050, pune: 1200 },
};

function getDistance(from: string, to: string): number {
  const fromKey = from.toLowerCase();
  const toKey = to.toLowerCase();
  return cityDistances[fromKey]?.[toKey] || 1000;
}

export function calculatePrice(
  from: string,
  to: string,
  weight: number,
  urgency: 'normal' | 'express' | 'same-day' = 'normal',
  mode: Mode = Mode.car,
  size: 'small' | 'medium' | 'large' = 'medium',
  fragile: boolean = false,
  doorPickup: boolean = false,
  insuranceTier: 'none' | 'basic' | 'premium' = 'none'
): number {
  const distance = getDistance(from, to);
  
  const baseRates: Record<Mode, number> = {
    [Mode.car]: 0.5,
    [Mode.bus]: 0.35,
    [Mode.train]: 0.4,
    [Mode.flight]: 0.8,
    [Mode.bike]: 0.3,
  };

  const urgencyMultipliers = {
    normal: 1,
    express: 1.5,
    'same-day': 2,
  };

  const sizeMultipliers = {
    small: 0.8,
    medium: 1,
    large: 1.3,
  };

  const insuranceMultipliers = {
    none: 1,
    basic: 1.1,
    premium: 1.25,
  };

  const baseRate = baseRates[mode];
  const urgencyMultiplier = urgencyMultipliers[urgency];
  const sizeMultiplier = sizeMultipliers[size];
  const fragileMultiplier = fragile ? 1.2 : 1;
  const doorPickupMultiplier = doorPickup ? 1.15 : 1;
  const insuranceMultiplier = insuranceMultipliers[insuranceTier];

  const totalPrice = distance * weight * baseRate * urgencyMultiplier * sizeMultiplier * fragileMultiplier * doorPickupMultiplier * insuranceMultiplier;

  return Math.round(totalPrice);
}
