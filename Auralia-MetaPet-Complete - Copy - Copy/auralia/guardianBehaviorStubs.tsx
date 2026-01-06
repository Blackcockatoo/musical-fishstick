/**
 * Guardian Behavior Stubs
 * Standalone implementation of guardian behavior system
 * Replaces the missing ../../../shared/auralia/guardianBehavior module
 */

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TIME_THEMES } from './config/themes';

// ===== TYPE DEFINITIONS =====

export type GuardianScaleName = 'harmonic' | 'pentatonic' | 'dorian' | 'phrygian';

export interface GuardianSigilPoint {
  id: number;
  x: number;
  y: number;
  angle: number;
  radius: number;
}

export type GuardianAIMode = 'idle' | 'observing' | 'focusing' | 'playing' | 'dreaming';

export interface AIBehaviorConfig {
  timings: {
    idle: { min: number; max: number };
    observing: { min: number; max: number };
    focusing: { min: number; max: number };
    playing: { min: number; max: number };
    dreaming: { min: number; max: number };
  };
  probabilities: {
    idleToDream: number;
    idleToObserve: number;
    idleToFocus: number;
  };
}

export type SpontaneousBehavior =
  | 'pulse'
  | 'shimmer'
  | 'startle'
  | 'giggle'
  | 'stretch'
  | 'sigh'
  | null;

export interface GuardianPosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface InteractionResponse {
  type: 'poke' | 'pet' | 'tickle' | 'shake' | 'drag' | 'grab' | 'release';
  intensity: number;
  message?: string;
  reaction?: string;
}

export interface GuardianStats {
  energy: number;
  curiosity: number;
  bond: number;
  health: number;
}

export interface GuardianField {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface GuardianDrive {
  explore?: number;
  rest: number;
  play?: number;
  focus?: number;
  resonance?: number;
  exploration?: number;
  connection?: number;
  expression?: number;
}

export interface ComfortState {
  physical?: number;
  mental?: number;
  emotional?: number;
  overall: number;
  source: string;
  unmetNeeds: string[];
  dominantDrive?: string;
}

export type ExpandedEmotionalState =
  | 'joyful'
  | 'curious'
  | 'content'
  | 'tired'
  | 'anxious'
  | 'playful'
  | 'focused'
  | 'dreaming'
  | 'neutral'
  | 'serene'
  | 'ecstatic'
  | 'contemplative'
  | 'mischievous'
  | 'affectionate'
  | 'protective'
  | 'restless'
  | 'yearning'
  | 'withdrawn'
  | 'calm'
  | 'happy'
  | 'unhappy'
  | 'excited'
  | 'overwhelmed';

export interface GBSPState {
  drives: GuardianDrive;
  comfort: ComfortState;
  emotionalState: ExpandedEmotionalState;
  awareness: number;
  sentiment: number;
  position: GuardianPosition;
}

// ===== CONSTANTS =====

export const DEFAULT_AI_CONFIG: AIBehaviorConfig = {
  timings: {
    idle: { min: 3000, max: 8000 },
    observing: { min: 5000, max: 12000 },
    focusing: { min: 2000, max: 4000 },
    playing: { min: 3000, max: 6000 },
    dreaming: { min: 8000, max: 15000 },
  },
  probabilities: {
    idleToDream: 0.15,
    idleToObserve: 0.5,
    idleToFocus: 0.25,
  },
};

export const DEFAULT_AUDIO_CONFIG = {
  masterVolume: 0.3,
  reverbMix: 0.2,
  attackTime: 0.01,
  releaseTime: 0.5,
  lfoRate: 0.5,
  lfoDepth: 0.1,
};

// ===== TIME FUNCTIONS =====

export function getTimeOfDay(): 'dawn' | 'day' | 'dusk' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}

export function getTimeTheme(timeOfDay: 'dawn' | 'day' | 'dusk' | 'night') {
  return TIME_THEMES[timeOfDay] || TIME_THEMES.day;
}

export function getAdaptiveTimeTheme() {
  return getTimeTheme(getTimeOfDay());
}

// ===== HELPER FUNCTIONS =====

export function selectScaleFromStats(stats: GuardianStats): GuardianScaleName {
  const { energy, curiosity, bond } = stats;

  if (energy > 70 && curiosity > 60) return 'harmonic';
  if (bond > 60) return 'pentatonic';
  if (curiosity > 50) return 'dorian';
  return 'phrygian';
}

export function getUnlockedLore(dreamCount: number): string[] {
  const lore: string[] = [];

  if (dreamCount >= 1) lore.push('The Guardian awakens to sacred geometry...');
  if (dreamCount >= 3) lore.push('Fibonacci sequences dance in the quantum foam...');
  if (dreamCount >= 5) lore.push('The MossPrimeSeed reveals ancient patterns...');
  if (dreamCount >= 10) lore.push('Unity emerges from deterministic chaos...');
  if (dreamCount >= 20) lore.push('Consciousness transcends the code boundary...');

  return lore;
}

// ===== CALCULATION FUNCTIONS =====

export function calculateDrives(
  position: GuardianPosition,
  field: GuardianField,
  vitals: GuardianStats,
  awareness: number,
  timestamp: number
): GuardianDrive {
  const { energy, curiosity } = vitals;

  return {
    explore: Math.min(100, curiosity * 0.8 + awareness * 0.2),
    rest: Math.max(0, 100 - energy),
    play: Math.min(100, energy * 0.6 + curiosity * 0.4),
    focus: Math.min(100, curiosity * 0.7 + vitals.bond * 0.3),
  };
}

export function calculateComfort(drives: GuardianDrive): ComfortState {
  const driveValues = Object.values(drives);
  const avgDrive = driveValues.reduce((a, b) => a + b, 0) / driveValues.length;

  const physical = Math.min(100, drives.rest * 0.5 + 50);
  const mental = Math.min(100, drives.focus * 0.6 + 40);
  const emotional = Math.min(100, drives.play * 0.7 + 30);
  const overall = Math.min(100, avgDrive);

  const unmetNeeds: string[] = [];
  if (physical < 50) unmetNeeds.push('rest');
  if (mental < 50) unmetNeeds.push('focus');
  if (emotional < 50) unmetNeeds.push('play');

  let source = 'balanced';
  if (physical > mental && physical > emotional) source = 'physical';
  else if (mental > emotional) source = 'mental';
  else if (emotional > 50) source = 'emotional';

  return {
    physical,
    mental,
    emotional,
    overall,
    source,
    unmetNeeds,
  };
}

export function getExpandedEmotionalState(
  drives: GuardianDrive,
  comfort: ComfortState,
  vitals: GuardianStats,
  aiMode: GuardianAIMode
): ExpandedEmotionalState {
  if (aiMode === 'dreaming') return 'dreaming';
  if (aiMode === 'focusing') return 'focused';
  if (drives.play > 70) return 'playful';
  if (vitals.energy < 30) return 'tired';
  if (drives.explore > 70) return 'curious';
  if (vitals.bond > 70) return 'joyful';
  if (comfort.overall > 60) return 'content';
  if (comfort.overall < 40) return 'anxious';
  return 'neutral';
}

export function calculateGBSPState(
  position: GuardianPosition,
  field: GuardianField,
  vitals: GuardianStats,
  aiMode: GuardianAIMode,
  timestamp: number
): GBSPState {
  const awareness = Math.min(100, (vitals.curiosity + vitals.energy) / 2);
  const drives = calculateDrives(position, field, vitals, awareness, timestamp);
  const comfort = calculateComfort(drives);
  const emotionalState = getExpandedEmotionalState(drives, comfort, vitals, aiMode);
  const sentiment = comfort.overall;

  return {
    drives,
    comfort,
    emotionalState,
    awareness,
    sentiment,
    position,
  };
}

// ===== HOOK: useAuraliaAudio =====

export function useAuraliaAudio(
  enabled: boolean,
  stats: GuardianStats,
  scale: GuardianScaleName,
  settings: typeof DEFAULT_AUDIO_CONFIG
) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      audioContextRef.current = new AudioContextClass();

      const masterGain = audioContextRef.current.createGain();
      masterGain.gain.value = settings.masterVolume;
      masterGain.connect(audioContextRef.current.destination);
      masterGainRef.current = masterGain;

      const reverbNode = audioContextRef.current.createConvolver();
      const reverbLength = audioContextRef.current.sampleRate * 2;
      const reverbBuffer = audioContextRef.current.createBuffer(2, reverbLength, audioContextRef.current.sampleRate);

      for (let channel = 0; channel < 2; channel++) {
        const channelData = reverbBuffer.getChannelData(channel);
        for (let i = 0; i < reverbLength; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLength, 2);
        }
      }

      reverbNode.buffer = reverbBuffer;
      reverbNodeRef.current = reverbNode;
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [enabled, settings.masterVolume]);

  const playNote = useCallback((frequency: number, duration: number = 0.3) => {
    if (!audioContextRef.current || !masterGainRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + settings.attackTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.connect(gainNode);
    gainNode.connect(masterGainRef.current);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }, [settings.attackTime]);

  const setVolume = useCallback((volume: number) => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
  }, []);

  return { playNote, setVolume };
}

// ===== HOOK: useGuardianAI =====

export function useGuardianAI(
  field: GuardianField,
  sigilPoints: GuardianSigilPoint[],
  onWhisper: (message: string) => void,
  onFocusChange: (sigilId: number | null) => void,
  onDreamComplete: () => void,
  options: {
    config: AIBehaviorConfig;
    stats: GuardianStats;
    onPlay?: () => void;
  }
) {
  const [mode, setMode] = useState<GuardianAIMode>('idle');
  const [focusedSigil, setFocusedSigil] = useState<number | null>(null);
  const spontaneousBehavior: SpontaneousBehavior = null;
  const position: GuardianPosition = {
    x: 0.5,
    y: 0.5,
    vx: 0,
    vy: 0,
  };
  const [since, setSince] = useState<number>(0);
  const [gbspTimestamp, setGbspTimestamp] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const transitionToNextMode = useCallback(function transitionToNextModeInner() {
    const { config, stats } = options;
    const { energy, curiosity } = stats;

    if (mode === 'idle') {
      const rand = Math.random();
      if (energy < 30 && rand < config.probabilities.idleToDream) {
        setMode('dreaming');
        const dreamDuration = config.timings.dreaming.min + Math.random() * (config.timings.dreaming.max - config.timings.dreaming.min);
        timerRef.current = setTimeout(() => {
          setMode('idle');
          onDreamComplete();
        }, dreamDuration);
      } else if (rand < config.probabilities.idleToObserve) {
        setMode('observing');
        const observeDuration = config.timings.observing.min + Math.random() * (config.timings.observing.max - config.timings.observing.min);
        timerRef.current = setTimeout(() => setMode('idle'), observeDuration);
      } else if (curiosity > 40 && rand < config.probabilities.idleToFocus + config.probabilities.idleToObserve) {
        setMode('focusing');
        const focusDuration = config.timings.focusing.min + Math.random() * (config.timings.focusing.max - config.timings.focusing.min);
        timerRef.current = setTimeout(() => {
          setMode('playing');
          const randomSigil = sigilPoints[Math.floor(Math.random() * sigilPoints.length)];
          if (randomSigil) {
            setFocusedSigil(randomSigil.id);
            onFocusChange(randomSigil.id);
            if (options.onPlay) options.onPlay();
          }
          timerRef.current = setTimeout(() => {
            setFocusedSigil(null);
            onFocusChange(null);
            setMode('idle');
          }, config.timings.playing.min + Math.random() * (config.timings.playing.max - config.timings.playing.min));
        }, focusDuration);
      } else {
        const idleDuration = config.timings.idle.min + Math.random() * (config.timings.idle.max - config.timings.idle.min);
        timerRef.current = setTimeout(() => transitionToNextMode(), idleDuration);
      }
    } else {
      const idleDuration = config.timings.idle.min + Math.random() * (config.timings.idle.max - config.timings.idle.min);
      timerRef.current = setTimeout(() => transitionToNextModeInner(), idleDuration);
    }
  }, [mode, sigilPoints, onFocusChange, onDreamComplete, options]);

  useEffect(() => {
    setSince(Date.now());
    if (mode === 'idle') {
      transitionToNextMode();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mode, transitionToNextMode]);

  useEffect(() => {
    setGbspTimestamp(Date.now());
    const id = setInterval(() => setGbspTimestamp(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Calculate GBSP state
  const gbsp = useMemo(() => {
    return calculateGBSPState(position, field, options.stats, mode, gbspTimestamp);
  }, [position, field, options.stats, mode, gbspTimestamp]);

  return {
    mode,
    focusedSigil,
    spontaneousBehavior,
    position,
    targetPosition: { x: field.centerX, y: field.centerY },
    since,
    fieldResonance: options.stats.curiosity / 100,
    gbsp,
  };
}

// ===== HOOK: useGuardianInteraction =====

export function useGuardianInteraction(
  aiState: ReturnType<typeof useGuardianAI>,
  stats: GuardianStats,
  field: GuardianField,
  handlers: {
    onReaction: (response: InteractionResponse) => void;
    onWhisper: (message: string) => void;
    onStatChange: (changes: Partial<GuardianStats>) => void;
  }
) {
  const lastInteractionRef = useRef<number>(0);
  const pokeCountRef = useRef<number>(0);
  const lastPokeTimeRef = useRef<number>(0);

  const handlePoke = useCallback((_x: number, _y: number) => {
    const now = Date.now();

    if (now - lastPokeTimeRef.current < 500) {
      pokeCountRef.current++;
    } else {
      pokeCountRef.current = 1;
    }
    lastPokeTimeRef.current = now;

    if (pokeCountRef.current >= 3) {
      handlers.onReaction({ type: 'tickle', intensity: 1.0, message: 'Hehe!' });
      handlers.onStatChange({ energy: Math.min(100, stats.energy + 5) });
      pokeCountRef.current = 0;
    } else {
      handlers.onReaction({ type: 'poke', intensity: 0.5, message: 'Hey!' });
      handlers.onStatChange({ curiosity: Math.min(100, stats.curiosity + 2) });
    }

    lastInteractionRef.current = now;
  }, [stats, handlers]);

  const handlePet = useCallback((_x: number, _y: number) => {
    handlers.onReaction({ type: 'pet', intensity: 0.7, message: 'Purr~' });
    handlers.onStatChange({ bond: Math.min(100, stats.bond + 3) });
    lastInteractionRef.current = Date.now();
  }, [stats, handlers]);

  const handleDrag = useCallback((_x: number, _y: number, vx: number, vy: number) => {
    const speed = Math.sqrt(vx * vx + vy * vy);

    if (speed > 5) {
      handlers.onReaction({ type: 'shake', intensity: speed / 10, message: 'Whoa!' });
      handlers.onStatChange({ energy: Math.max(0, stats.energy - 2) });
    } else {
      handlers.onReaction({ type: 'drag', intensity: 0.3 });
    }

    lastInteractionRef.current = Date.now();
  }, [stats, handlers]);

  const handleGrab = useCallback((_position: { x: number; y: number }) => {
    handlers.onReaction({ type: 'grab', intensity: 0.6, message: 'Hey!' });
    lastInteractionRef.current = Date.now();
  }, [handlers]);

  const handleShake = useCallback((intensity: number) => {
    handlers.onReaction({ type: 'shake', intensity, message: 'Whoa!' });
    handlers.onStatChange({ energy: Math.max(0, stats.energy - Math.floor(intensity * 3)) });
    lastInteractionRef.current = Date.now();
  }, [stats, handlers]);

  const handleRelease = useCallback((_velocity?: { vx: number; vy: number }) => {
    handlers.onReaction({ type: 'release', intensity: 0.3, message: 'Free!' });
    lastInteractionRef.current = Date.now();
  }, [handlers]);

  const handleTickle = useCallback((_position: { x: number; y: number }) => {
    handlers.onReaction({ type: 'tickle', intensity: 0.8, message: 'Hehe!' });
    handlers.onStatChange({ energy: Math.min(100, stats.energy + 5) });
    lastInteractionRef.current = Date.now();
  }, [stats, handlers]);

  return {
    handlePoke,
    handlePet,
    handleDrag,
    handleGrab,
    handleShake,
    handleRelease,
    handleTickle,
    isHeld: false,
  };
}

// ===== COMPONENT: GuardianSigilCanvas =====

export function GuardianSigilCanvas({
  sigilPoints,
  aiState
}: {
  sigilPoints: GuardianSigilPoint[];
  aiState?: any;
}) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="sigilGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd700" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff8800" stopOpacity="0" />
        </radialGradient>
      </defs>

      {sigilPoints.map((point, idx) => {
        const isFocused = aiState?.focusedSigil === point.id;
        const scale = isFocused ? 1.3 : 1.0;
        const opacity = isFocused ? 1.0 : 0.7;

        return (
          <g key={point.id} transform={`translate(${point.x}, ${point.y})`}>
            {isFocused && (
              <circle
                r={12 * scale}
                fill="url(#sigilGlow)"
                opacity={0.5}
              />
            )}
            <circle
              r={6 * scale}
              fill="#ffd700"
              stroke="#ff8800"
              strokeWidth={1.5}
              opacity={opacity}
            />
            <text
              x={0}
              y={-12}
              textAnchor="middle"
              fill="#ffd700"
              fontSize={10}
              opacity={0.6}
            >
              {idx + 1}
            </text>
          </g>
        );
      })}

      {sigilPoints.length > 1 && (
        <g opacity={0.3}>
          {sigilPoints.map((point, idx) => {
            const nextPoint = sigilPoints[(idx + 1) % sigilPoints.length];
            return (
              <line
                key={`line-${idx}`}
                x1={point.x}
                y1={point.y}
                x2={nextPoint.x}
                y2={nextPoint.y}
                stroke="#4488ff"
                strokeWidth={1}
                strokeDasharray="4 2"
              />
            );
          })}
        </g>
      )}
    </svg>
  );
}

// ===== FUNCTION: generateSigilPoints =====

export function generateSigilPoints(
  seed: number,
  count: number,
  centerX: number,
  centerY: number
): GuardianSigilPoint[] {
  const points: GuardianSigilPoint[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees

  for (let i = 0; i < count; i++) {
    const angle = i * goldenAngle + (seed % 360) * (Math.PI / 180);
    const radius = 60 + (i * 15) + ((seed * 7) % 40);

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    points.push({
      id: i,
      x,
      y,
      angle,
      radius,
    });
  }

  return points;
}
