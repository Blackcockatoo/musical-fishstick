/**
 * Trinity Evolution System - Sun, Shadow, Void
 * Breeding mechanics with genome-driven evolution
 */

export type TrinityAspect = 'sun' | 'shadow' | 'void';
export type EvolutionTrait = 'radiant' | 'umbral' | 'cosmic' | 'balanced' | 'chaotic';

export interface EvolutionState {
  primaryAspect: TrinityAspect;
  secondaryAspect: TrinityAspect | null;
  trait: EvolutionTrait;
  power: number; // 0-100
  mutations: string[];
}

export interface BreedingGenome {
  red60: number;
  blue60: number;
  black60: number;
}

/**
 * Determine primary trinity aspect from genome
 * Sun = high red (energy/vitality)
 * Shadow = high blue (form/structure)
 * Void = high black (mystery/chaos)
 */
export function calculateTrinityAspect(genome: BreedingGenome): TrinityAspect {
  const { red60, blue60, black60 } = genome;

  if (red60 > blue60 && red60 > black60) return 'sun';
  if (blue60 > red60 && blue60 > black60) return 'shadow';
  if (black60 > red60 && black60 > blue60) return 'void';

  // Ties default to dominant value
  if (red60 >= Math.max(blue60, black60)) return 'sun';
  if (blue60 >= Math.max(red60, black60)) return 'shadow';
  return 'void';
}

/**
 * Calculate secondary aspect (if significant)
 */
export function calculateSecondaryAspect(genome: BreedingGenome, primary: TrinityAspect): TrinityAspect | null {
  const values = {
    sun: genome.red60,
    shadow: genome.blue60,
    void: genome.black60,
  };

  const primaryValue = values[primary];
  const others = Object.entries(values).filter(([k]) => k !== primary);
  const [secondaryKey, secondaryValue] = others.reduce((max, curr) => curr[1] > max[1] ? curr : max);

  // Secondary must be within 20% of primary to count
  if (secondaryValue >= primaryValue * 0.8) {
    return secondaryKey as TrinityAspect;
  }

  return null;
}

/**
 * Determine evolution trait from genome balance
 */
export function calculateEvolutionTrait(genome: BreedingGenome, primary: TrinityAspect, secondary: TrinityAspect | null): EvolutionTrait {
  const { red60, blue60, black60 } = genome;
  const avg = (red60 + blue60 + black60) / 3;
  const variance = Math.max(
    Math.abs(red60 - avg),
    Math.abs(blue60 - avg),
    Math.abs(black60 - avg)
  );

  // Chaotic = high variance (>30)
  if (variance > 30) return 'chaotic';

  // Balanced = low variance (<15)
  if (variance < 15) return 'balanced';

  // Aspect-specific traits
  if (secondary) {
    // Dual aspect = cosmic
    return 'cosmic';
  }

  // Single dominant aspect
  if (primary === 'sun') return 'radiant';
  if (primary === 'shadow') return 'umbral';

  return 'cosmic'; // Void default
}

/**
 * Calculate evolution power (0-100)
 */
export function calculateEvolutionPower(genome: BreedingGenome): number {
  const { red60, blue60, black60 } = genome;
  const total = red60 + blue60 + black60;
  const max = Math.max(red60, blue60, black60);

  // Power combines total strength and focus
  const strength = total / 3; // 0-100
  const focus = (max / 100) * 100; // Dominant stat as %

  return Math.round((strength * 0.6 + focus * 0.4));
}

/**
 * Generate mutations based on extreme genome values
 */
export function generateMutations(genome: BreedingGenome): string[] {
  const mutations: string[] = [];

  if (genome.red60 > 90) mutations.push('Solar Flare - Enhanced vitality regeneration');
  if (genome.red60 < 10) mutations.push('Dim Ember - Requires less energy to sustain');

  if (genome.blue60 > 90) mutations.push('Crystal Form - Rigid structure, high defense');
  if (genome.blue60 < 10) mutations.push('Fluid Shape - Adaptive form, high flexibility');

  if (genome.black60 > 90) mutations.push('Void Touch - Deep cosmic connection');
  if (genome.black60 < 10) mutations.push('Clear Light - Reduced mystery, increased clarity');

  // Combo mutations
  if (genome.red60 > 85 && genome.black60 > 85) {
    mutations.push('Supernova - Explosive energy release');
  }

  if (genome.blue60 > 85 && genome.black60 > 85) {
    mutations.push('Dark Matter - Hidden mass and presence');
  }

  if (genome.red60 > 85 && genome.blue60 > 85) {
    mutations.push('Plasma Core - Structured energy form');
  }

  return mutations;
}

/**
 * Calculate complete evolution state from genome
 */
export function calculateEvolution(genome: BreedingGenome): EvolutionState {
  const primary = calculateTrinityAspect(genome);
  const secondary = calculateSecondaryAspect(genome, primary);
  const trait = calculateEvolutionTrait(genome, primary, secondary);
  const power = calculateEvolutionPower(genome);
  const mutations = generateMutations(genome);

  return {
    primaryAspect: primary,
    secondaryAspect: secondary,
    trait,
    power,
    mutations,
  };
}

/**
 * Breed two genomes to create offspring genome
 */
export function breedGenomes(parent1: BreedingGenome, parent2: BreedingGenome, randomFn: () => number = Math.random): BreedingGenome {
  // Base inheritance - average of parents with slight variance
  const inheritRed = (parent1.red60 + parent2.red60) / 2;
  const inheritBlue = (parent1.blue60 + parent2.blue60) / 2;
  const inheritBlack = (parent1.black60 + parent2.black60) / 2;

  // Mutation rate: ±15% variance
  const mutate = (value: number): number => {
    const variance = (randomFn() - 0.5) * 30; // -15 to +15
    return Math.max(0, Math.min(100, value + variance));
  };

  // Apply mutations
  let red60 = mutate(inheritRed);
  let blue60 = mutate(inheritBlue);
  let black60 = mutate(inheritBlack);

  // Rare evolution boost (5% chance) - emphasize strongest trait
  if (randomFn() < 0.05) {
    const maxParent1 = Math.max(parent1.red60, parent1.blue60, parent1.black60);
    const maxParent2 = Math.max(parent2.red60, parent2.blue60, parent2.black60);

    if (maxParent1 === parent1.red60 || maxParent2 === parent2.red60) {
      red60 = Math.min(100, red60 + 10);
    } else if (maxParent1 === parent1.blue60 || maxParent2 === parent2.blue60) {
      blue60 = Math.min(100, blue60 + 10);
    } else {
      black60 = Math.min(100, black60 + 10);
    }
  }

  return {
    red60: Math.round(red60),
    blue60: Math.round(blue60),
    black60: Math.round(black60),
  };
}

/**
 * Get evolution description text
 */
export function getEvolutionDescription(evolution: EvolutionState): string {
  const aspectDesc = {
    sun: 'blazing with solar energy',
    shadow: 'wrapped in structured darkness',
    void: 'touched by cosmic mystery',
  };

  const traitDesc = {
    radiant: 'pure and focused',
    umbral: 'deep and contemplative',
    cosmic: 'transcendent and complex',
    balanced: 'harmonious and stable',
    chaotic: 'unpredictable and wild',
  };

  let desc = `A ${traitDesc[evolution.trait]} guardian, ${aspectDesc[evolution.primaryAspect]}`;

  if (evolution.secondaryAspect) {
    desc += ` with hints of ${aspectDesc[evolution.secondaryAspect]}`;
  }

  desc += `. Power: ${evolution.power}`;

  if (evolution.mutations.length > 0) {
    desc += `\n\nMutations:\n${evolution.mutations.map(m => `• ${m}`).join('\n')}`;
  }

  return desc;
}

/**
 * Get evolution color theme
 */
export function getEvolutionColors(evolution: EvolutionState): {
  primary: string;
  secondary: string;
  glow: string;
} {
  const aspectColors = {
    sun: { primary: '#FFD700', secondary: '#FF6B35', glow: 'rgba(255, 215, 0, 0.6)' },
    shadow: { primary: '#4A5568', secondary: '#2D3748', glow: 'rgba(74, 85, 104, 0.6)' },
    void: { primary: '#8B5CF6', secondary: '#1A1A2E', glow: 'rgba(139, 92, 246, 0.6)' },
  };

  return aspectColors[evolution.primaryAspect];
}
