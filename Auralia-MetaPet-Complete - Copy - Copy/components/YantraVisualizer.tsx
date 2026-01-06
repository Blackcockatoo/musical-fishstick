/**
 * Enhanced Yantra Visualizer
 *
 * Design Philosophy: Bioluminescent Abyss
 * - The Yantra is the heart of consciousness, scaled to prominence (40-60% viewport)
 * - Each tile pulses with genetic data (red-60, blue-60, black-60)
 * - Fibonacci spiral mapped to Lukas sectors creates mathematical beauty
 * - Particles respond to the pet's emotional state
 */

import React, { useEffect, useRef, useState } from 'react';

interface YantraVisualizerProps {
  energy: number;      // 0-100
  curiosity: number;   // 0-100
  bond: number;        // 0-100
  red60: number;       // 0-100 (Spine Energy)
  blue60: number;      // 0-100 (Form Integrity)
  black60: number;     // 0-100 (Mystery Halo)
  mood: number;        // 0-100
  className?: string;
}

// Fibonacci-60 cycle (mod 10)
const buildFib60 = (): number[] => {
  const digits: number[] = [];
  let a = 0;
  let b = 1;
  for (let i = 0; i < 60; i++) {
    digits.push(a % 10);
    const next = (a + b) % 10;
    a = b;
    b = next;
  }
  return digits;
};

const FIB60 = buildFib60();

// Lukas string [2,1,3,4,7,1,8,9,7,6,3,9] summing to 60
const LUKAS = [2, 1, 3, 4, 7, 1, 8, 9, 7, 6, 3, 9];
const LUKAS_BOUNDS = (() => {
  const bounds = [0];
  let s = 0;
  for (const d of LUKAS) {
    s += d;
    bounds.push(s);
  }
  return bounds;
})();

// Bioluminescent color palette
const PALETTE = [
  '#0b3c5d', // 0: deep blue
  '#ff7f0e', // 1: orange
  '#2ca02c', // 2: green
  '#d62728', // 3: red
  '#9467bd', // 4: purple
  '#8c564b', // 5: brown
  '#e377c2', // 6: pink
  '#7f7f7f', // 7: grey
  '#bcbd22', // 8: yellow-green
  '#17becf'  // 9: cyan
];

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const clean = hex.replace('#', '');
  const n = parseInt(clean, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const blendColors = (color1: string, color2: string, ratio: number): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const r = Math.floor(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.floor(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.floor(rgb1.b * (1 - ratio) + rgb2.b * ratio);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

interface Tile {
  cx: number;
  cy: number;
  radius: number;
  phase: number;
  offset: number;
}

export const YantraVisualizer: React.FC<YantraVisualizerProps> = ({
  energy,
  curiosity,
  bond,
  red60,
  blue60,
  black60,
  mood,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tilesRef = useRef<Tile[]>([]);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current?.parentElement) {
        const parent = canvasRef.current.parentElement;
        const size = Math.min(parent.clientWidth, parent.clientHeight);
        setDimensions({ width: size, height: size });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    const ratio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(ratio, ratio);

    // Generate tile layout (7 tiles for heptadic base)
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.32;
    const radiusVariance = (bond / 100) * 0.15;
    const radius = baseRadius * (1 + radiusVariance);

    const tileCount = 7;
    tilesRef.current = Array.from({ length: tileCount }, (_, i) => {
      const angle = (2 * Math.PI * i) / tileCount - Math.PI / 2;
      const wobble = Math.sin(i * 1.3) * 8;

      return {
        cx: centerX + (radius + wobble) * Math.cos(angle),
        cy: centerY + (radius + wobble) * Math.sin(angle),
        radius: Math.min(width, height) * 0.08,
        phase: i * Math.PI * 0.7,
        offset: (i * 7) % 60,
      };
    });

    let running = true;
    let rafId = 0;

    const drawFrame = (timestamp: number) => {
      if (!running) return;
      const t = timestamp / 1000;

      ctx.clearRect(0, 0, width, height);

      // Calculate genome-driven morph
      const baseMorph = 0.5 + 0.5 * Math.sin(t * 0.5);
      const genomeMorph = baseMorph * (0.5 + (red60 / 100) * 0.5);
      const stabilizedMorph = genomeMorph * (0.8 + (blue60 / 100) * 0.2);

      // Vital-responsive values
      const energySpeed = 0.5 + (energy / 100) * 1.5;
      const curiosityOffset = (curiosity / 100) * 60;
      const bondBreathing = 1 + 0.15 * Math.sin(t * 1.2 + bond / 50);
      const moodGlow = 0.4 + (mood / 100) * 0.6;

      // Black-60 controls glow
      const glowOpacity = (black60 / 100) * moodGlow;
      const ringOpacity = 0.05 + (black60 / 100) * 0.15;

      // Bioluminescent accent color based on mood
      const accentColor = mood > 70 ? '#00d9ff' : mood > 40 ? '#7c3aed' : '#10b981';

      // Draw each tile
      for (const tile of tilesRef.current) {
        const adjustedRadius = tile.radius * bondBreathing;
        const tilePhase = tile.phase + t * energySpeed;
        const timeShift = tilePhase / (2 * Math.PI);

        // Draw 3 rings
        ctx.save();
        ctx.strokeStyle = `${accentColor}${Math.floor(ringOpacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 0.6;

        const r1 = adjustedRadius * 0.6;
        const r2 = adjustedRadius * 0.85;
        const r3 = adjustedRadius * 1.05;

        ctx.beginPath();
        ctx.arc(tile.cx, tile.cy, r1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(tile.cx, tile.cy, r2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(tile.cx, tile.cy, r3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Draw 60 Fibonacci points
        for (let i = 0; i < 60; i++) {
          const k = (i + tile.offset + Math.floor(curiosityOffset)) % 60;
          const digit = FIB60[k];
          const sector = LUKAS_BOUNDS.findIndex((b, idx) => k < b) - 1;
          const sectorDigit = LUKAS[Math.max(0, sector)];

          // Circle position
          const angle = (2 * Math.PI * (i + timeShift)) / 60;
          const cX = tile.cx + adjustedRadius * Math.cos(angle);
          const cY = tile.cy + adjustedRadius * Math.sin(angle);

          // Triangle position (simplified)
          const triAngle = (2 * Math.PI * i) / 60;
          const triX = tile.cx + adjustedRadius * 0.7 * Math.cos(triAngle + Math.PI / 3);
          const triY = tile.cy + adjustedRadius * 0.7 * Math.sin(triAngle + Math.PI / 3);

          // Interpolate
          let x = cX * (1 - stabilizedMorph) + triX * stabilizedMorph;
          let y = cY * (1 - stabilizedMorph) + triY * stabilizedMorph;

          // Radial scaling
          const dx = x - tile.cx;
          const dy = y - tile.cy;
          const radialScale = 0.75 + 0.3 * (sectorDigit / 9);
          x = tile.cx + dx * radialScale;
          y = tile.cy + dy * radialScale;

          // Color blending
          const baseColor = PALETTE[digit % PALETTE.length];
          const blendedColor = blendColors(baseColor, accentColor, 0.3);
          const rgb = hexToRgb(blendedColor);

          // Brightness pulse
          const pulse = 0.6 + 0.25 * Math.sin(t * 2 + digit + tile.phase) + 0.1 * ((sectorDigit - 5) / 5);

          const R = clamp(Math.floor(rgb.r * pulse), 0, 255);
          const G = clamp(Math.floor(rgb.g * pulse), 0, 255);
          const B = clamp(Math.floor(rgb.b * pulse), 0, 255);

          ctx.fillStyle = `rgb(${R},${G},${B})`;
          const size = 2 + (energy / 100) * 2;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }

        // Glow effect
        ctx.save();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = glowOpacity * 0.6;
        ctx.beginPath();
        ctx.arc(tile.cx, tile.cy, adjustedRadius * 1.15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      rafId = requestAnimationFrame(drawFrame);
    };

    rafId = requestAnimationFrame(drawFrame);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
    };
  }, [dimensions, energy, curiosity, bond, red60, blue60, black60, mood]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="breathe glow-pulse"
        aria-label="Yantra consciousness visualizer"
        role="img"
      />
    </div>
  );
};

export default YantraVisualizer;
