/**
 * Consciousness Hook
 * Manages unified consciousness state that blends genetics, behavior, and environment
 */

import { useState, useEffect, useCallback } from 'react';
import type { DerivedTraits } from './genomeTypes';
import type { GuardianStats, GuardianPosition, GuardianField } from './guardianBehaviorStubs';
import {
  type ConsciousnessState,
  initializeConsciousness,
  applyGeneticModulation,
  refineEmotionalExpression,
  getEffectivePersonality,
  emotionToParticleParams,
  recordExperience,
  consciousnessToResponseContext,
} from './consciousness';

export interface UseConsciousnessOptions {
  traits: DerivedTraits;
  initialVitals: GuardianStats;
  field: GuardianField;
  position: GuardianPosition;
  fieldResonance: number;
}

export interface ConsciousnessActions {
  recordAction: (action: string, impact: number) => void;
  updateVitals: (vitals: Partial<GuardianStats>) => void;
  updatePosition: (position: Partial<GuardianPosition>) => void;
  updateContext: (context: { fieldResonance?: number; timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night' }) => void;
  getParticleParams: () => ReturnType<typeof emotionToParticleParams>;
  getResponseContext: (vitals: { mood: number; energy: number; hunger: number; hygiene: number }) => ReturnType<typeof consciousnessToResponseContext>;
}

/**
 * Main consciousness hook - unifies genetics, behavior, sentiment
 */
export function useConsciousness({
  traits,
  initialVitals,
  field,
  position,
  fieldResonance,
}: UseConsciousnessOptions): [ConsciousnessState, ConsciousnessActions] {
  // Initialize consciousness state
  const [consciousness, setConsciousness] = useState<ConsciousnessState>(() =>
    initializeConsciousness(traits, initialVitals, position, fieldResonance)
  );

  // Actions
  const recordAction = useCallback((action: string, impact: number) => {
    setConsciousness(prev => {
      return recordExperience(prev, action, prev.expression.emotional, impact);
    });
  }, []);

  const updateVitals = useCallback((vitals: Partial<GuardianStats>) => {
    setConsciousness(prev => ({
      ...prev,
      expression: {
        ...prev.expression,
        vitals: {
          ...prev.expression.vitals,
          ...vitals,
        },
      },
    }));
  }, []);

  const updatePosition = useCallback((newPosition: Partial<GuardianPosition>) => {
    setConsciousness(prev => ({
      ...prev,
      context: {
        ...prev.context,
        position: {
          ...prev.context.position,
          ...newPosition,
        },
      },
    }));
  }, []);

  const updateContext = useCallback((context: { fieldResonance?: number; timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night' }) => {
    setConsciousness(prev => ({
      ...prev,
      context: {
        ...prev.context,
        ...context,
      },
    }));
  }, []);

  const getParticleParams = useCallback(() => {
    return emotionToParticleParams(
      consciousness.expression.emotional,
      consciousness.expression.comfort,
      consciousness.expression.drives
    );
  }, [consciousness.expression]);

  const getResponseContext = useCallback((vitals: { mood: number; energy: number; hunger: number; hygiene: number }) => {
    return consciousnessToResponseContext(consciousness, vitals);
  }, [consciousness]);

  const actions: ConsciousnessActions = {
    recordAction,
    updateVitals,
    updatePosition,
    updateContext,
    getParticleParams,
    getResponseContext,
  };

  return [consciousness, actions];
}

/**
 * Helper hook to sync consciousness with guardian AI state
 * Call this in your component's useEffect when AI state changes
 */
export function useSyncConsciousness(
  actions: ConsciousnessActions,
  vitals: GuardianStats,
  position: GuardianPosition,
  fieldResonance: number
) {
  const { updateVitals, updatePosition, updateContext } = actions;

  useEffect(() => {
    updateVitals(vitals);
  }, [vitals, updateVitals]);

  useEffect(() => {
    updatePosition(position);
  }, [position, updatePosition]);

  useEffect(() => {
    updateContext({ fieldResonance });
  }, [fieldResonance, updateContext]);
}
