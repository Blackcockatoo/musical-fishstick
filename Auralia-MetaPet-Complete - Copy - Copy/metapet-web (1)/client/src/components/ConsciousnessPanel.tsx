/**
 * Consciousness Panel
 * 
 * Design Philosophy: Bioluminescent Abyss
 * - Displays the pet's inner state in real-time
 * - Personality traits, drives, and emotional patterns
 * - Glowing text, subtle animations, responsive layout
 */

import React from 'react';
import type { ConsciousnessState, GuardianDrive } from '@/lib/consciousness';

interface ConsciousnessPanelProps {
  consciousness: ConsciousnessState;
  className?: string;
}

export const ConsciousnessPanel: React.FC<ConsciousnessPanelProps> = ({
  consciousness,
  className = '',
}) => {
  const { identity, expression, memory } = consciousness;
  const { traits } = identity;
  const { emotional, drives, vitals, comfort } = expression;

  const getDriveColor = (value: number): string => {
    if (value > 0.7) return 'from-cyan-500 to-cyan-400';
    if (value > 0.4) return 'from-violet-500 to-violet-400';
    return 'from-emerald-500 to-emerald-400';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Personality Traits */}
      <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border">
        <h3 className="text-lg font-bold font-orbitron glow-violet mb-4">Personality</h3>

        <div className="space-y-3">
          {[
            { label: 'Energy', value: traits.energy },
            { label: 'Curiosity', value: traits.curiosity },
            { label: 'Affection', value: traits.affection },
            { label: 'Independence', value: traits.independence },
            { label: 'Discipline', value: traits.discipline },
            { label: 'Playfulness', value: traits.playfulness },
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
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Essence</p>
          <p className="text-sm font-orbitron glow-gold">{identity.essence}</p>
        </div>
      </div>

      {/* Guardian Drives */}
      <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border">
        <h3 className="text-lg font-bold font-orbitron glow-violet mb-4">Drives</h3>

        <div className="space-y-3">
          {[
            { label: 'Resonance', value: drives.resonance },
            { label: 'Exploration', value: drives.exploration },
            { label: 'Connection', value: drives.connection },
            { label: 'Rest', value: drives.rest },
            { label: 'Expression', value: drives.expression },
          ].map((drive) => (
            <div key={drive.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-outfit text-muted-foreground">{drive.label}</span>
                <span className="text-xs font-mono glow-cyan">{(drive.value * 100).toFixed(0)}</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getDriveColor(drive.value)} transition-all duration-500`}
                  style={{ width: `${drive.value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comfort & Emotional Patterns */}
      <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border">
        <h3 className="text-lg font-bold font-orbitron glow-violet mb-4">State</h3>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Comfort</p>
            <p className="text-sm font-orbitron capitalize glow-emerald">{comfort}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Emotional Patterns</p>
            <div className="flex flex-wrap gap-2">
              {Array.from(expression.emotional ? [[expression.emotional, 1]] : []).map(([emotion]) => (
                <span
                  key={emotion}
                  className="px-2 py-1 text-xs bg-accent/20 border border-accent rounded-full glow-violet capitalize"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Memory Size</p>
            <p className="text-sm font-mono glow-cyan">{memory.actionHistory.length} / 100 actions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsciousnessPanel;
