/**
 * Particle Field Backdrop
 * 
 * Design Philosophy: Bioluminescent Abyss
 * - Thousands of particles drift in the void
 * - They respond to the pet's emotional state
 * - Clustering during calm states, dispersing during excitement
 * - Creates a sense of presence and life
 */

import React, { useEffect, useRef } from 'react';

interface ParticleFieldProps {
  mood: number;      // 0-100: Affects particle behavior
  energy: number;    // 0-100: Affects particle speed
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const COLORS = [
  '#00d9ff', // Cyan
  '#7c3aed', // Violet
  '#10b981', // Emerald
  '#f59e0b', // Gold
  '#06b6d4', // Teal
];

export const ParticleField: React.FC<ParticleFieldProps> = ({
  mood,
  energy,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ratio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(ratio, ratio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = 150;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 100,
    }));

    let running = true;
    let rafId = 0;

    const drawFrame = (timestamp: number) => {
      if (!running) return;

      frameRef.current++;
      const t = timestamp / 1000;

      ctx.fillStyle = 'rgba(0, 10, 15, 0.1)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Particle behavior based on mood and energy
      const clusterFactor = 1 - mood / 100; // Calm = cluster, excited = disperse
      const speedMult = 0.5 + (energy / 100) * 1.5;

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];

        // Update position
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;

        // Clustering behavior
        if (clusterFactor > 0.5) {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 100) {
            p.vx += (dx / dist) * 0.01 * clusterFactor;
            p.vy += (dy / dist) * 0.01 * clusterFactor;
          }
        }

        // Brownian motion
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Wrap around edges
        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;
        if (p.y < -10) p.y = window.innerHeight + 10;
        if (p.y > window.innerHeight + 10) p.y = -10;

        // Life cycle
        p.life++;
        if (p.life > p.maxLife) {
          p.life = 0;
          p.x = Math.random() * window.innerWidth;
          p.y = Math.random() * window.innerHeight;
          p.opacity = Math.random() * 0.5 + 0.3;
        }

        // Opacity fade
        const lifeFactor = Math.sin((p.life / p.maxLife) * Math.PI);
        const opacity = p.opacity * lifeFactor;

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = opacity * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(drawFrame);
    };

    rafId = requestAnimationFrame(drawFrame);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mood, energy]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export default ParticleField;
