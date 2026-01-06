import { useEffect, useState } from 'react';

/**
 * Minimal helper to keep a number in localStorage without
 * triggering hydration mismatches when SSR renders.
 */
export function usePersistentNumber(key: string, defaultValue: number): [number, (next: number) => void] {
  const [value, setValue] = useState<number>(defaultValue);

  // Load once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(key);
    if (stored !== null) {
      const parsed = Number(stored);
      if (!Number.isNaN(parsed)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValue(parsed);
      }
    }
  }, [key]);

  // Persist whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, String(value));
  }, [key, value]);

  return [value, setValue];
}
