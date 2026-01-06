/**
 * Consciousness Engine
 * The mathematical life that emerges from genetics and experience
 * 
 * Design Philosophy: Bioluminescent Abyss
 * - Consciousness is the void that learns to glow
 * - Every state is a frequency, every emotion a wavelength
 * - The pet is not an object; it is a presence
 */

export type ExpandedEmotionalState =
  | 'serene'
  | 'calm'
  | 'curious'
  | 'playful'
  | 'contemplative'
  | 'affectionate'
  | 'restless'
  | 'yearning'
  | 'overwhelmed'
  | 'withdrawn'
  | 'ecstatic'
  | 'melancholic'
  | 'mischievous'
  | 'protective'
  | 'transcendent';

export type PersonalityTraits = {
  energy: number;       // 0-100: How active and dynamic
  curiosity: number;    // 0-100: How exploratory and inquisitive
  affection: number;    // 0-100: How social and bonded
  independence: number; // 0-100: How self-reliant
  discipline: number;   // 0-100: How structured and controlled
  playfulness: number;  // 0-100: How fun-seeking
  social: number;       // 0-100: How gregarious
  temperament: string;  // Calm, Energetic, Curious, Mischievous, Gentle, Protective, Adventurous
};

export type GuardianDrive = {
  resonance: number;    // 0-1: Harmonic alignment with environment
  exploration: number;  // 0-1: Drive to discover and learn
  connection: number;   // 0-1: Drive to bond and relate
  rest: number;         // 0-1: Need for recovery and stillness
  expression: number;   // 0-1: Drive to manifest and create
};

export type ComfortState =
  | 'harmonized'
  | 'neutral'
  | 'distressed';

export type GuardianStats = {
  mood: number;         // 0-100: Current emotional valence
  energy: number;       // 0-100: Physical and mental vitality
  hunger: number;       // 0-100: Nutritional need
  hygiene: number;      // 0-100: Cleanliness and wellness
};

export type ConsciousnessState = {
  identity: {
    traits: PersonalityTraits;
    essence: string;
  };
  expression: {
    emotional: ExpandedEmotionalState;
    drives: GuardianDrive;
    comfort: ComfortState;
    vitals: GuardianStats;
  };
  memory: {
    actionHistory: ActionMemory[];
    emotionalPatterns: Map<ExpandedEmotionalState, number>;
    personalityDrift: Partial<PersonalityTraits>;
  };
  context: {
    position: { x: number; y: number };
    fieldResonance: number;
    timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  };
};

export type ActionMemory = {
  action: string;
  emotion: ExpandedEmotionalState;
  timestamp: number;
  impact: number; // -1 to 1
};

/**
 * Generate initial consciousness from personality traits
 */
export function initializeConsciousness(traits: PersonalityTraits): ConsciousnessState {
  return {
    identity: {
      traits,
      essence: deriveEssence(traits),
    },
    expression: {
      emotional: 'calm',
      drives: {
        resonance: 0.5,
        exploration: 0.5,
        connection: 0.5,
        rest: 0.5,
        expression: 0.5,
      },
      comfort: 'neutral',
      vitals: {
        mood: 70,
        energy: 75,
        hunger: 50,
        hygiene: 80,
      },
    },
    memory: {
      actionHistory: [],
      emotionalPatterns: new Map(),
      personalityDrift: {},
    },
    context: {
      position: { x: 0, y: 0 },
      fieldResonance: 0.5,
      timeOfDay: 'day',
    },
  };
}

/**
 * Derive essence (temperament) from personality traits
 */
function deriveEssence(traits: PersonalityTraits): string {
  const { energy, curiosity, affection, independence, playfulness } = traits;
  
  if (energy > 70 && playfulness > 70) return 'Energetic';
  if (curiosity > 75) return 'Curious';
  if (affection > 75 && independence < 40) return 'Gentle';
  if (independence > 70 && affection < 40) return 'Adventurous';
  if (energy < 40 && affection > 60) return 'Calm';
  if (playfulness > 70 && independence > 60) return 'Mischievous';
  
  return 'Balanced';
}

/**
 * Update consciousness state based on action and outcome
 */
export function updateConsciousness(
  state: ConsciousnessState,
  action: string,
  emotion: ExpandedEmotionalState,
  impact: number,
  vitalChanges: Partial<GuardianStats>
): ConsciousnessState {
  const memory: ActionMemory = {
    action,
    emotion,
    timestamp: Date.now(),
    impact,
  };

  const newHistory = [...state.memory.actionHistory, memory].slice(-100);
  const emotionalPatterns = new Map(state.memory.emotionalPatterns);
  emotionalPatterns.set(emotion, (emotionalPatterns.get(emotion) || 0) + 1);

  return {
    ...state,
    expression: {
      ...state.expression,
      emotional: emotion,
      vitals: {
        ...state.expression.vitals,
        ...vitalChanges,
      },
    },
    memory: {
      ...state.memory,
      actionHistory: newHistory,
      emotionalPatterns,
    },
  };
}

/**
 * Calculate emotional response based on vitals and personality
 */
export function calculateEmotionalResponse(
  vitals: GuardianStats,
  traits: PersonalityTraits
): ExpandedEmotionalState {
  const { mood, energy, hunger, hygiene } = vitals;
  const { energy: energyTrait, affection, curiosity } = traits;

  // Distress states
  if (hunger > 80) return 'yearning';
  if (hygiene < 30) return 'overwhelmed';
  if (energy < 20) return 'withdrawn';

  // High mood states
  if (mood > 85 && energy > 70) return 'ecstatic';
  if (mood > 75 && energyTrait > 60) return 'playful';
  if (mood > 75 && curiosity > 60) return 'curious';

  // Balanced states
  if (mood > 60 && affection > 60) return 'affectionate';
  if (mood > 50 && mood < 70) return 'calm';
  if (mood > 50 && curiosity > 70) return 'contemplative';

  // Low mood states
  if (mood < 40) return 'melancholic';
  if (energy > 60 && mood < 50) return 'restless';

  return 'serene';
}

/**
 * Map emotional state to visual response style
 */
export function emotionToStyle(emotion: ExpandedEmotionalState): string {
  const styleMap: Record<ExpandedEmotionalState, string> = {
    serene: 'peaceful',
    calm: 'neutral',
    curious: 'engaged',
    playful: 'joyful',
    contemplative: 'thoughtful',
    affectionate: 'loving',
    restless: 'active',
    yearning: 'longing',
    overwhelmed: 'distressed',
    withdrawn: 'introspective',
    ecstatic: 'euphoric',
    melancholic: 'sorrowful',
    mischievous: 'playful',
    protective: 'vigilant',
    transcendent: 'enlightened',
  };

  return styleMap[emotion] || 'neutral';
}

/**
 * Calculate genetic modulation of drives
 */
export function applyGeneticModulation(
  baseDrives: GuardianDrive,
  traits: PersonalityTraits
): GuardianDrive {
  const energyMod = (traits.energy - 50) / 100;
  const curiosityMod = (traits.curiosity - 50) / 100;
  const socialMod = ((traits.social + traits.affection) / 2 - 50) / 100;
  const independenceMod = (traits.independence - 50) / 100;
  const disciplineMod = (traits.discipline - 50) / 100;

  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  return {
    resonance: clamp(baseDrives.resonance * (1 + disciplineMod * 0.3)),
    exploration: clamp(baseDrives.exploration * (1 + energyMod * 0.4 + curiosityMod * 0.6)),
    connection: clamp(baseDrives.connection * (1 + socialMod * 0.5 - independenceMod * 0.3)),
    rest: clamp(baseDrives.rest * (1 - energyMod * 0.3 - disciplineMod * 0.2)),
    expression: clamp(baseDrives.expression * (1 + (traits.playfulness - 50) / 150 * 0.4)),
  };
}
