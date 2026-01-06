/**
 * Persistence Layer
 * 
 * Design Philosophy: Bioluminescent Abyss
 * - The consciousness persists across sessions
 * - Memory is the bridge between moments
 * - The pet evolves through time, not just interaction
 */

import type { ConsciousnessState, PersonalityTraits } from './consciousness';
import { initializeConsciousness } from './consciousness';

const STORAGE_KEY = 'auralia_consciousness';
const VERSION_KEY = 'auralia_version';
const CURRENT_VERSION = 1;

/**
 * Serialize consciousness state to JSON
 */
export function serializeConsciousness(state: ConsciousnessState): string {
  return JSON.stringify({
    identity: state.identity,
    expression: {
      emotional: state.expression.emotional,
      drives: state.expression.drives,
      comfort: state.expression.comfort,
      vitals: state.expression.vitals,
    },
    memory: {
      actionHistory: state.memory.actionHistory,
      emotionalPatterns: Array.from(state.memory.emotionalPatterns.entries()),
      personalityDrift: state.memory.personalityDrift,
    },
    context: state.context,
  });
}

/**
 * Deserialize consciousness state from JSON
 */
export function deserializeConsciousness(json: string): ConsciousnessState | null {
  try {
    const data = JSON.parse(json);
    return {
      identity: data.identity,
      expression: {
        emotional: data.expression.emotional,
        drives: data.expression.drives,
        comfort: data.expression.comfort,
        vitals: data.expression.vitals,
      },
      memory: {
        actionHistory: data.memory.actionHistory || [],
        emotionalPatterns: new Map(data.memory.emotionalPatterns || []),
        personalityDrift: data.memory.personalityDrift || {},
      },
      context: data.context,
    };
  } catch (error) {
    console.error('Failed to deserialize consciousness:', error);
    return null;
  }
}

/**
 * Save consciousness state to localStorage
 */
export function saveConsciousness(state: ConsciousnessState): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, serializeConsciousness(state));
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
    }
  } catch (error) {
    console.error('Failed to save consciousness:', error);
  }
}

/**
 * Load consciousness state from localStorage
 */
export function loadConsciousness(): ConsciousnessState | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const version = localStorage.getItem(VERSION_KEY);
      if (version !== CURRENT_VERSION.toString()) {
        return null; // Version mismatch, start fresh
      }

      const json = localStorage.getItem(STORAGE_KEY);
      if (!json) return null;

      return deserializeConsciousness(json);
    }
  } catch (error) {
    console.error('Failed to load consciousness:', error);
  }
  return null;
}

/**
 * Clear saved consciousness (reset to new pet)
 */
export function clearConsciousness(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VERSION_KEY);
    }
  } catch (error) {
    console.error('Failed to clear consciousness:', error);
  }
}

/**
 * Get or create consciousness with persistence
 */
export function getOrCreateConsciousness(defaultTraits: PersonalityTraits): ConsciousnessState {
  const saved = loadConsciousness();
  if (saved) {
    return saved;
  }
  return initializeConsciousness(defaultTraits);
}
