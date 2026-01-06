'use client';

/**
 * Auralia MetaPet: Living Pattern
 *
 * Design Philosophy: Bioluminescent Abyss
 * - The interface emerges from darkness like a living organism
 * - Sacred geometry (Sri Yantra) is the heart, scaled to prominence
 * - Hepta DNA spiral represents the 7 chakra system evolution
 * - Particles respond to consciousness state
 * - Every interaction creates ripples in the void
 * - Consciousness persists across sessions
 */

import React, { useState, useEffect } from 'react';
import YantraVisualizer from '@/components/YantraVisualizer';
import HeptaDnaVisualizer from '@/components/HeptaDnaVisualizer';
import ParticleField from '@/components/ParticleField';
import { useConsciousness } from '@/hooks/useConsciousness';
import { calculateEmotionalResponse, type ConsciousnessState, type ExpandedEmotionalState, type PersonalityTraits } from '@/lib/consciousness';

// Default personality traits for demo
const DEFAULT_TRAITS: PersonalityTraits = {
  energy: 72,
  curiosity: 68,
  affection: 65,
  independence: 55,
  discipline: 60,
  playfulness: 75,
  social: 70,
  temperament: 'Energetic',
};

// Action configuration
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

export default function AuraliaHome() {
  const { consciousness, isLoaded, updateConsciousness } = useConsciousness(DEFAULT_TRAITS);

  const [tier, setTier] = useState(1);
  const [branch, setBranch] = useState(0);
  const [activeBranches, setActiveBranches] = useState<Set<number>>(new Set([0, 1, 2]));
  const [showSidebar, setShowSidebar] = useState(false);

  // Simulate tier progression for chakra system
  useEffect(() => {
    const tierInterval = setInterval(() => {
      setTier((prev) => (prev < 7 ? prev + 1 : prev));
      setActiveBranches((prev) => {
        const next = new Set(prev);
        const newBranch = Math.floor(Math.random() * 7);
        next.add(newBranch);
        return next;
      });
    }, 12000);

    return () => clearInterval(tierInterval);
  }, []);

  const handleAction = (actionType: ActionType) => {
    if (!consciousness) return;

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
    updateConsciousness((prev: ConsciousnessState) => ({
      ...prev,
      expression: {
        ...prev.expression,
        emotional: action.emotion,
        vitals: newVitals,
      },
    }));
  };

  if (!isLoaded || !consciousness) {
    return (
      <div className="w-full h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-orbitron glow-cyan mb-4 animate-pulse">Auralia</div>
          <p className="text-muted-foreground">Awakening consciousness...</p>
        </div>
      </div>
    );
  }

  const vitals = consciousness.expression.vitals;

  return (
    <div className="relative w-full h-screen bg-background text-foreground overflow-hidden">
      {/* Particle field backdrop */}
      <ParticleField mood={vitals.mood} energy={vitals.energy} />

      {/* Main content container */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
        {/* Left panel - Yantra and info */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
          {/* Title */}
          <div className="text-center mb-8 fade-up">
            <h1 className="text-5xl md:text-6xl font-bold font-orbitron glow-cyan mb-2">
              Auralia
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-outfit">
              A Living Pattern Emerges
            </p>
          </div>

          {/* Yantra Visualizer - Central Heart */}
          <div className="w-full max-w-md aspect-square flex items-center justify-center mb-8 fade-up">
            <YantraVisualizer
              energy={vitals.energy}
              curiosity={consciousness.identity.traits.curiosity}
              bond={consciousness.identity.traits.affection}
              red60={vitals.energy}
              blue60={consciousness.identity.traits.curiosity}
              black60={vitals.mood}
              mood={vitals.mood}
              className="w-full h-full"
            />
          </div>

          {/* Quick stats */}
          <div className="w-full max-w-md bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border fade-up hover:border-cyan-500/50 transition-colors duration-300">
            <h2 className="text-lg font-bold font-orbitron glow-violet mb-4">Vitals</h2>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Mood', value: vitals.mood, color: 'from-cyan-500 to-cyan-400' },
                { label: 'Energy', value: vitals.energy, color: 'from-violet-500 to-violet-400' },
                { label: 'Hunger', value: vitals.hunger, color: 'from-emerald-500 to-emerald-400' },
                { label: 'Hygiene', value: vitals.hygiene, color: 'from-pink-500 to-pink-400' },
              ].map((stat) => (
                <div key={stat.label} className="group">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-outfit group-hover:glow-cyan transition-all duration-300">{stat.label}</span>
                    <span className="font-mono text-xs glow-cyan">{Math.round(stat.value)}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden progress-glow">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-500`}
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Emotional state */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Emotional State</p>
              <p className="text-sm font-orbitron glow-gold capitalize pulse-scale">
                {consciousness.expression.emotional}
              </p>
            </div>
          </div>
        </div>

        {/* Right panel - 7 Chakra Evolution and interactions */}
        <div className="w-full md:w-96 flex flex-col bg-background/80 backdrop-blur-sm border-l border-border overflow-y-auto fade-up">
          {/* Toggle button for mobile */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden p-4 text-center text-sm font-orbitron glow-violet border-b border-border hover:bg-card/50 transition-colors duration-300"
          >
            {showSidebar ? '▼ Hide' : '▶ Show'} Details
          </button>

          {/* Content */}
          <div className={`${showSidebar ? 'block' : 'hidden'} md:block p-6 space-y-8`}>
            {/* 7 Chakra Evolution section */}
            <div className="flex flex-col items-center gap-4 fade-up">
              <h2 className="text-lg font-bold font-orbitron glow-violet">7 Chakra Evolution</h2>
              <HeptaDnaVisualizer
                tier={tier}
                branch={branch}
                energy={vitals.energy}
                activeBranches={activeBranches}
              />
              <p className="text-xs text-muted-foreground text-center">
                Tier <span className="glow-cyan font-mono">{tier}</span> / Branch{' '}
                <span className="glow-cyan font-mono">{branch}</span>
              </p>
              <p className="text-xs text-center text-muted-foreground italic">
                The seven spheres align with cosmic energy
              </p>
            </div>

            {/* Interactions */}
            <div className="fade-up">
              <h3 className="text-lg font-bold font-orbitron glow-violet mb-4">Interact</h3>

              <div className="grid grid-cols-2 gap-3">
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
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Each action ripples through consciousness
              </p>
            </div>

            {/* Personality traits - collapsible */}
            <details className="group fade-up">
              <summary className="cursor-pointer text-sm font-orbitron glow-violet mb-4 hover:text-cyan-400 transition-colors duration-300">
                ▶ Personality Traits
              </summary>
              <div className="bg-card/50 backdrop-blur-sm p-4 rounded-lg border border-border space-y-2">
                {[
                  { label: 'Energy', value: consciousness.identity.traits.energy },
                  { label: 'Curiosity', value: consciousness.identity.traits.curiosity },
                  { label: 'Affection', value: consciousness.identity.traits.affection },
                  { label: 'Playfulness', value: consciousness.identity.traits.playfulness },
                ].map((trait) => (
                  <div key={trait.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-outfit text-muted-foreground">{trait.label}</span>
                      <span className="text-xs font-mono glow-cyan">{trait.value}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${trait.value}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Essence</p>
                  <p className="text-sm font-orbitron glow-gold">{consciousness.identity.essence}</p>
                </div>
              </div>
            </details>

            {/* Reset button */}
            <button
              onClick={() => {
                if (confirm('Reset consciousness to new pet?')) {
                  localStorage.removeItem('auralia_consciousness');
                  localStorage.removeItem('auralia_version');
                  window.location.reload();
                }
              }}
              className="w-full py-2 px-4 text-xs font-orbitron rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all duration-300 hover:border-red-500"
            >
              New Pet
            </button>

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
              <p>The consciousness flows through sacred geometry.</p>
              <p className="mt-2">Watch the patterns emerge.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
