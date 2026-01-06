/**
 * Hepta DNA Spiral Visualizer
 * 
 * Design Philosophy: Bioluminescent Abyss
 * - The Hepta DNA represents the 7 evolutionary branches
 * - Rendered as a vertical double helix with glowing nodes
 * - Each node pulses with a different color from the Fibonacci palette
 * - The spiral grows/shrinks based on evolution tier
 */

import React, { useEffect, useRef } from 'react';

interface HeptaDnaVisualizerProps {
  tier: number;           // 0-7: Evolution tier
  branch: number;         // 0-6: Current branch (0-6)
  energy: number;         // 0-100
  activeBranches: Set<number>; // Which branches are unlocked
  className?: string;
}

const BRANCH_COLORS = [
  '#ff6b6b', // Red
  '#ff8c42', // Orange
  '#ffd93d', // Gold
  '#6bcf7f', // Green
  '#4d96ff', // Blue
  '#9d4edd', // Purple
  '#ff006e', // Magenta
];

export const HeptaDnaVisualizer: React.FC<HeptaDnaVisualizerProps> = ({
  tier,
  branch,
  energy,
  activeBranches,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 300;
    const height = 600;
    const ratio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(ratio, ratio);

    let running = true;
    let rafId = 0;

    const drawFrame = (timestamp: number) => {
      if (!running) return;
      const t = timestamp / 1000;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const startY = 50;
      const endY = height - 50;
      const spiralRadius = 40;
      const nodeRadius = 8;

      // Draw helix backbone
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.3)';
      ctx.lineWidth = 2;

      for (let i = 0; i < 7; i++) {
        const progress = i / 6;
        const y = startY + (endY - startY) * progress;
        const x1 = centerX - spiralRadius * Math.cos(t + i * Math.PI / 3);
        const x2 = centerX + spiralRadius * Math.cos(t + i * Math.PI / 3);

        // Left helix strand
        ctx.beginPath();
        ctx.moveTo(centerX - spiralRadius * 0.5, y - 10);
        ctx.quadraticCurveTo(x1, y, centerX - spiralRadius * 0.5, y + 10);
        ctx.stroke();

        // Right helix strand
        ctx.beginPath();
        ctx.moveTo(centerX + spiralRadius * 0.5, y - 10);
        ctx.quadraticCurveTo(x2, y, centerX + spiralRadius * 0.5, y + 10);
        ctx.stroke();

        // Connecting line
        ctx.strokeStyle = 'rgba(0, 217, 255, 0.2)';
        ctx.beginPath();
        ctx.moveTo(centerX - spiralRadius * 0.5, y);
        ctx.lineTo(centerX + spiralRadius * 0.5, y);
        ctx.stroke();
      }

      // Draw nodes (7 for heptadic)
      for (let i = 0; i < 7; i++) {
        const progress = i / 6;
        const y = startY + (endY - startY) * progress;
        const x = centerX + spiralRadius * Math.cos(t + i * Math.PI / 3);

        const isActive = activeBranches.has(i);
        const isCurrent = i === branch;
        const color = BRANCH_COLORS[i];

        // Node glow
        if (isActive) {
          ctx.fillStyle = `${color}40`;
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius * 2, 0, Math.PI * 2);
          ctx.fill();

          // Outer glow
          ctx.strokeStyle = `${color}60`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius * 2.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Node core
        const nodePulse = isCurrent ? 0.8 + 0.3 * Math.sin(t * 3) : 0.6;
        ctx.fillStyle = color;
        ctx.globalAlpha = nodePulse;
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Node border
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Tier indicator (fill from bottom)
        if (tier > i) {
          ctx.fillStyle = `${color}80`;
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(drawFrame);
    };

    rafId = requestAnimationFrame(drawFrame);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
    };
  }, [tier, branch, energy, activeBranches]);

  return (
    <canvas
      ref={canvasRef}
      className={`spiral-rotate ${className}`}
      aria-label="Hepta DNA evolution spiral"
      role="img"
    />
  );
};

export default HeptaDnaVisualizer;
