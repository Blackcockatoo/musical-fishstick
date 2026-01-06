/**
 * useConsciousness Hook
 * 
 * Manages consciousness state with persistence and auto-save
 */

import { useState, useEffect } from 'react';
import type { ConsciousnessState, PersonalityTraits } from '@/lib/consciousness';
import { getOrCreateConsciousness } from '@/lib/persistence';
import { saveConsciousness } from '@/lib/persistence';

type UpdateFn = (prev: ConsciousnessState) => ConsciousnessState;

export type UseConsciousnessReturn = ReturnType<typeof useConsciousness>;

export function useConsciousness(defaultTraits: PersonalityTraits) {
  const [consciousness, setConsciousnessState] = useState<ConsciousnessState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize consciousness on mount
  useEffect(() => {
    const initial = getOrCreateConsciousness(defaultTraits);
    setConsciousnessState(initial);
    setIsLoaded(true);
  }, []);

  // Auto-save consciousness when it changes
  useEffect(() => {
    if (consciousness && isLoaded) {
      const timer = setTimeout(() => {
        saveConsciousness(consciousness);
      }, 1000); // Debounce saves to every 1 second

      return () => clearTimeout(timer);
    }
  }, [consciousness, isLoaded]);

  // Update consciousness with auto-save
  const updateConsciousness = (newState: ConsciousnessState | UpdateFn) => {
    if (typeof newState === 'function') {
      setConsciousnessState((prev) => newState(prev as ConsciousnessState));
    } else {
      setConsciousnessState(newState);
    }
  };

  return {
    consciousness,
    isLoaded,
    updateConsciousness,
  } as const;
}
