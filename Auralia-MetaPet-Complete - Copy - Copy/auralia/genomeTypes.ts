/**
 * Genome Types
 * Minimal type definitions for the consciousness system
 */

export interface PersonalityTraits {
  temperament: string;
  energy: number;
  playfulness: number;
  independence: number;
  affection: number;
  social: number;
  curiosity: number;
  discipline: number;
}

export interface DerivedTraits {
  personality: PersonalityTraits;
}

export interface ResponseContext {
  mood: number;
  energy: number;
  hunger: number;
  hygiene: number;
  recentActions: string[];
}
