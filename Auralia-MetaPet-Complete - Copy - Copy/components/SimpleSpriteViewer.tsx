"use client";

import React, { useState, useEffect } from 'react';
import { initField, generateSigilPoints } from '@/auralia/utils/mossPrimeSeed';
import { GUARDIAN_FORMS } from '@/auralia/config/forms';
import type { FormKey } from '@/auralia/types';

/**
 * Simple Auralia Sprite Viewer
 *
 * Focus on the sprite display without Tamagotchi game logic
 * Click to cycle through different forms
 */
const SimpleSpriteViewer: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<FormKey>('radiant');
  const [field] = useState(() => initField('AURALIA'));
  const [sigilPoints] = useState(() => generateSigilPoints(field, 'DEMO_SEED', 7));
  const [rotation, setRotation] = useState(0);

  // Gentle rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(r => (r + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const form = GUARDIAN_FORMS[currentForm];
  const formKeys: FormKey[] = ['radiant', 'meditation', 'sage', 'vigilant', 'celestial', 'wild'];

  const cycleForm = () => {
    const currentIndex = formKeys.indexOf(currentForm);
    const nextIndex = (currentIndex + 1) % formKeys.length;
    setCurrentForm(formKeys[nextIndex]);
  };

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      {/* Title */}
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
        Auralia Sprite Viewer
      </h1>

      {/* Form Name */}
      <div className="text-2xl mb-2" style={{ color: form.primaryGold }}>
        {form.name}
      </div>
      <div className="text-sm text-slate-400 mb-8">{form.description}</div>

      {/* Sprite Display */}
      <div
        className="relative mb-8 cursor-pointer transition-transform hover:scale-105"
        onClick={cycleForm}
        style={{
          width: '400px',
          height: '400px',
          borderRadius: '20px',
          background: `radial-gradient(circle at 50% 50%, ${form.glowColor}, transparent 70%)`,
          border: `2px solid ${form.primaryGold}30`,
        }}
      >
        {/* Guardian Body (Central Circle) */}
        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          className="absolute inset-0"
        >
          {/* Outer glow ring */}
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke={form.primaryGold}
            strokeWidth="1"
            opacity="0.2"
          />

          {/* Main body */}
          <circle
            cx="200"
            cy="200"
            r="100"
            fill={form.baseColor}
            stroke={form.primaryGold}
            strokeWidth="3"
            style={{
              filter: `drop-shadow(0 0 20px ${form.glowColor})`,
            }}
          />

          {/* Sigil points constellation */}
          {sigilPoints.map((point, idx) => {
            const angle = (rotation + idx * 51.4285) * (Math.PI / 180); // Golden angle spacing
            const radius = 60;
            const x = 200 + Math.cos(angle) * radius;
            const y = 200 + Math.sin(angle) * radius;

            return (
              <g key={idx}>
                {/* Connecting line to center */}
                <line
                  x1="200"
                  y1="200"
                  x2={x}
                  y2={y}
                  stroke={form.tealAccent}
                  strokeWidth="1"
                  opacity="0.3"
                />
                {/* Sigil point */}
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={form.secondaryGold}
                  stroke={form.primaryGold}
                  strokeWidth="2"
                  style={{
                    filter: `drop-shadow(0 0 10px ${form.primaryGold})`,
                  }}
                />
              </g>
            );
          })}

          {/* Eyes */}
          <circle
            cx="180"
            cy="190"
            r="12"
            fill={form.eyeColor}
            style={{
              filter: `drop-shadow(0 0 15px ${form.eyeColor})`,
            }}
          />
          <circle
            cx="220"
            cy="190"
            r="12"
            fill={form.eyeColor}
            style={{
              filter: `drop-shadow(0 0 15px ${form.eyeColor})`,
            }}
          />

          {/* Eye pupils */}
          <circle cx="180" cy="190" r="5" fill={form.baseColor} />
          <circle cx="220" cy="190" r="5" fill={form.baseColor} />

          {/* Energy pattern (rotating inner ring) */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (rotation * 2 + i * 60) * (Math.PI / 180);
            const r = 40;
            const x = 200 + Math.cos(angle) * r;
            const y = 200 + Math.sin(angle) * r;

            return (
              <circle
                key={`energy-${i}`}
                cx={x}
                cy={y}
                r="3"
                fill={form.tealAccent}
                opacity="0.6"
              />
            );
          })}
        </svg>
      </div>

      {/* Instructions */}
      <div className="text-slate-400 text-sm mb-4">
        Click the sprite to cycle through forms
      </div>

      {/* Form selector buttons */}
      <div className="flex gap-2 flex-wrap justify-center max-w-2xl">
        {formKeys.map((key) => {
          const f = GUARDIAN_FORMS[key];
          return (
            <button
              key={key}
              onClick={() => setCurrentForm(key)}
              className="px-4 py-2 rounded-lg border-2 transition-all font-medium"
              style={{
                borderColor: currentForm === key ? f.primaryGold : `${f.primaryGold}30`,
                backgroundColor: currentForm === key ? `${f.baseColor}80` : 'transparent',
                color: f.primaryGold,
              }}
            >
              {f.name}
            </button>
          );
        })}
      </div>

      {/* Color palette display */}
      <div className="mt-8 p-6 rounded-lg border border-slate-700 bg-slate-900/50">
        <div className="text-sm text-slate-300 mb-3">Current Palette:</div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-lg border-2 border-slate-600"
              style={{ backgroundColor: form.baseColor }}
            />
            <span className="text-xs text-slate-400">Base</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-lg border-2 border-slate-600"
              style={{ backgroundColor: form.primaryGold }}
            />
            <span className="text-xs text-slate-400">Primary</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-lg border-2 border-slate-600"
              style={{ backgroundColor: form.secondaryGold }}
            />
            <span className="text-xs text-slate-400">Secondary</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-lg border-2 border-slate-600"
              style={{ backgroundColor: form.tealAccent }}
            />
            <span className="text-xs text-slate-400">Accent</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 rounded-lg border-2 border-slate-600"
              style={{ backgroundColor: form.eyeColor }}
            />
            <span className="text-xs text-slate-400">Eyes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleSpriteViewer;
