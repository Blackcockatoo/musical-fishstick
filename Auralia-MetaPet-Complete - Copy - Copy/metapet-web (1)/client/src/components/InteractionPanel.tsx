/**
 * Interaction Panel
 * 
 * Design Philosophy: Bioluminescent Abyss
 * - Actions that affect consciousness state
 * - Each action creates ripples in the void
 * - Glowing buttons with hover effects
 */

import React, { useState } from 'react';
import type { ConsciousnessState, ExpandedEmotionalState } from '@/lib/consciousness';
import { updateConsciousness, calculateEmotionalResponse } from '@/lib/consciousness';

interface InteractionPanelProps {
  consciousness: ConsciousnessState;
  onUpdate: (newState: ConsciousnessState) => void;
  className?: string;
}

type ActionType = 'feed' | 'play' | 'rest' | 'pet' | 'explore';

interface ActionConfig {
  label: string;
  emoji: string;
  color: string;
  vitalChanges: {
    mood: number;
    energy: number;
    hunger: number;
    hygiene: number;
  };
  emotion: ExpandedEmotionalState;
}

const ACTIONS: Record<ActionType, ActionConfig> = {
  feed: {
    label: 'Feed',
    emoji: '🍽️',
    color: 'from-emerald-500 to-emerald-400',
    vitalChanges: { mood: 10, energy: 5, hunger: -30, hygiene: -5 },
    emotion: 'affectionate',
  },
  play: {
    label: 'Play',
    emoji: '🎮',
    color: 'from-cyan-500 to-cyan-400',
    vitalChanges: { mood: 20, energy: -15, hunger: 10, hygiene: -10 },
    emotion: 'playful',
  },
  rest: {
    label: 'Rest',
    emoji: '😴',
    color: 'from-violet-500 to-violet-400',
    vitalChanges: { mood: 5, energy: 30, hunger: 5, hygiene: 10 },
    emotion: 'serene',
  },
  pet: {
    label: 'Pet',
    emoji: '🤝',
    color: 'from-pink-500 to-pink-400',
    vitalChanges: { mood: 15, energy: 0, hunger: 0, hygiene: 5 },
    emotion: 'affectionate',
  },
  explore: {
    label: 'Explore',
    emoji: '🔍',
    color: 'from-gold-500 to-gold-400',
    vitalChanges: { mood: 8, energy: -10, hunger: 5, hygiene: 0 },
    emotion: 'curious',
  },
};

export const InteractionPanel: React.FC<InteractionPanelProps> = ({
  consciousness,
  onUpdate,
  className = '',
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAction = (actionType: ActionType) => {
    const action = ACTIONS[actionType];
    const vitals = consciousness.expression.vitals;

    // Calculate new vitals with clamping
    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    const newVitals = {
      mood: clamp(vitals.mood + action.vitalChanges.mood),
      energy: clamp(vitals.energy + action.vitalChanges.energy),
      hunger: clamp(vitals.hunger + action.vitalChanges.hunger),
      hygiene: clamp(vitals.hygiene + action.vitalChanges.hygiene),
    };

    // Update consciousness
    const newState = updateConsciousness(
      consciousness,
      actionType,
      action.emotion,
      0.5,
      newVitals
    );

    onUpdate(newState);

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-bold font-orbitron glow-violet">Interact</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(ACTIONS).map(([key, action]) => (
          <button
            key={key}
            onClick={() => handleAction(key as ActionType)}
            className={`
              relative p-4 rounded-lg border border-border
              bg-gradient-to-br ${action.color} bg-opacity-10
              hover:bg-opacity-20 transition-all duration-300
              transform hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
              group
            `}
            aria-label={`${action.label} interaction`}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10 bg-gradient-to-br from-cyan-500/50 to-violet-500/50" />

            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">{action.emoji}</span>
              <span className="text-xs font-outfit font-semibold text-foreground">{action.label}</span>
            </div>

            {/* Ripple effect */}
            {isAnimating && (
              <div className="absolute inset-0 rounded-lg border border-cyan-400 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Each action ripples through consciousness
      </p>
    </div>
  );
};

export default InteractionPanel;
