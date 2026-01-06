/**
 * Auralia MetaPet: Living Pattern
 * 
 * Design Philosophy: Bioluminescent Abyss
 * - The interface emerges from darkness like a living organism
 * - Sacred geometry (Sri Yantra) is the heart, scaled to prominence
 * - Hepta DNA spiral represents evolution
 * - Particles respond to consciousness state
 * - Every interaction creates ripples in the void
 * - Consciousness persists across sessions
 */

import React, { useState, useEffect } from 'react';
import YantraVisualizer from '@/components/YantraVisualizer';
import HeptaDnaVisualizer from '@/components/HeptaDnaVisualizer';
import ParticleField from '@/components/ParticleField';
import ConsciousnessPanel from '@/components/ConsciousnessPanel';
import InteractionPanel from '@/components/InteractionPanel';
import { useConsciousness } from '@/hooks/useConsciousness';
import { calculateEmotionalResponse, emotionToStyle } from '@/lib/consciousness';
import type { PersonalityTraits } from '@/lib/consciousness';

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

export default function Home() {
  const { consciousness, isLoaded, updateConsciousness } = useConsciousness(DEFAULT_TRAITS);

  const [tier, setTier] = useState(1);
  const [branch, setBranch] = useState(0);
  const [activeBranches, setActiveBranches] = useState<Set<number>>(new Set([0, 1, 2]));
  const [showSidebar, setShowSidebar] = useState(false);

  // Simulate consciousness evolution over time
  useEffect(() => {
    if (!consciousness) return;

    const interval = setInterval(() => {
      updateConsciousness((prev: typeof consciousness) => {
        // Simulate mood and energy fluctuation
        const newMood = Math.max(0, Math.min(100, prev.expression.vitals.mood + (Math.random() - 0.5) * 8));
        const newEnergy = Math.max(0, Math.min(100, prev.expression.vitals.energy + (Math.random() - 0.5) * 6));
        const newHunger = Math.max(0, Math.min(100, prev.expression.vitals.hunger + (Math.random() - 0.5) * 4));
        const newHygiene = Math.max(0, Math.min(100, prev.expression.vitals.hygiene + (Math.random() - 0.5) * 2));

        const newVitals = {
          ...prev.expression.vitals,
          mood: newMood,
          energy: newEnergy,
          hunger: newHunger,
          hygiene: newHygiene,
        };

        // Calculate new emotional state
        const emotion = calculateEmotionalResponse(newVitals, prev.identity.traits);

        // Update consciousness
              return {
          ...prev,
          expression: {
            ...prev.expression,
            emotional: emotion,
            vitals: newVitals,
          },
          memory: prev.memory,
          identity: prev.identity,
          context: prev.context,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [consciousness]);

  // Simulate tier progression
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

  const emotionalStyle = emotionToStyle(consciousness.expression.emotional);
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
              red60={Math.random() * 100}
              blue60={Math.random() * 100}
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
              <p className="text-xs text-muted-foreground mt-2 capitalize">
                Currently feeling {emotionalStyle}
              </p>
            </div>
          </div>
        </div>

        {/* Right panel - Evolution and interactions */}
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
            {/* Evolution section */}
            <div className="flex flex-col items-center gap-4 fade-up">
              <h2 className="text-lg font-bold font-orbitron glow-violet">Evolution</h2>
              <HeptaDnaVisualizer
                tier={tier}
                branch={branch}
                energy={vitals.energy}
                activeBranches={activeBranches}
              />
              <p className="text-xs text-muted-foreground">
                Tier <span className="glow-cyan font-mono">{tier}</span> / Branch{' '}
                <span className="glow-cyan font-mono">{branch}</span>
              </p>
            </div>

            {/* Interactions */}
            <div className="fade-up">
            <InteractionPanel
              consciousness={consciousness}
              onUpdate={(newState) => updateConsciousness(newState)}
            />
            </div>

            {/* Consciousness details - collapsible */}
            <details className="group fade-up">
              <summary className="cursor-pointer text-sm font-orbitron glow-violet mb-4 hover:text-cyan-400 transition-colors duration-300">
                ▶ Consciousness Details
              </summary>
              <div className="group-open:block hidden">
                <ConsciousnessPanel consciousness={consciousness} />
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
              className="w-full py-2 px-4 text-xs font-orbitron rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition-all duration-300 hover:border-destructive"
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
