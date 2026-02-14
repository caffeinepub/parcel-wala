import { Mode } from '../../backend';

export type InsuranceTier = 'none' | 'basic' | 'premium';

export interface InsuranceCoverage {
  tier: InsuranceTier;
  cost: number;
  coverage: number;
  includesDelay: boolean;
}

export function getInsuranceCoverage(tier: InsuranceTier, mode: Mode): InsuranceCoverage {
  if (tier === 'none') {
    return { tier: 'none', cost: 0, coverage: 0, includesDelay: false };
  }

  const coverageMap: Record<Mode, { basic: InsuranceCoverage; premium: InsuranceCoverage }> = {
    [Mode.car]: {
      basic: { tier: 'basic', cost: 50, coverage: 3000, includesDelay: false },
      premium: { tier: 'premium', cost: 100, coverage: 15000, includesDelay: true },
    },
    [Mode.bus]: {
      basic: { tier: 'basic', cost: 50, coverage: 3000, includesDelay: false },
      premium: { tier: 'premium', cost: 100, coverage: 15000, includesDelay: true },
    },
    [Mode.train]: {
      basic: { tier: 'basic', cost: 100, coverage: 5000, includesDelay: false },
      premium: { tier: 'premium', cost: 200, coverage: 25000, includesDelay: true },
    },
    [Mode.flight]: {
      basic: { tier: 'basic', cost: 150, coverage: 10000, includesDelay: false },
      premium: { tier: 'premium', cost: 300, coverage: 50000, includesDelay: true },
    },
    [Mode.bike]: {
      basic: { tier: 'basic', cost: 50, coverage: 3000, includesDelay: false },
      premium: { tier: 'premium', cost: 100, coverage: 15000, includesDelay: true },
    },
  };

  return coverageMap[mode][tier];
}
