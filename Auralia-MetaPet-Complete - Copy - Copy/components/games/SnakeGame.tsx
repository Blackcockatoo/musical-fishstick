'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePersistentNumber } from './usePersistentNumber';

type SnakeSegment = { x: number; y: number };
type SnakeDirection = 'up' | 'down' | 'left' | 'right';

type SnakeGameProps = {
  prng: () => number;
  audioEnabled: boolean;
  playNote: (note: number, sustain?: number) => void;
  onClose: () => void;
  onWin: (score: number) => void;
  onWhisper: (text: string) => void;
};

const GRID_SIZE = 15;
const WIN_SCORE = 50;

export function SnakeGame({
  prng,
  audioEnabled,
  playNote,
  onClose,
  onWin,
  onWhisper,
}: SnakeGameProps) {
  const [segments, setSegments] = useState<SnakeSegment[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<SnakeDirection>('right');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speedMs, setSpeedMs] = useState(200);
  const [hasWon, setHasWon] = useState(false);
  const [highScore, setHighScore] = usePersistentNumber('snakeHighScore', 0);

  const spawnFood = useCallback(
    (current: SnakeSegment[]) => {
      for (let attempts = 0; attempts < 50; attempts++) {
        const candidate = {
          x: Math.floor(prng() * GRID_SIZE),
          y: Math.floor(prng() * GRID_SIZE),
        };
        const overlapsSnake = current.some((seg) => seg.x === candidate.x && seg.y === candidate.y);
        if (!overlapsSnake) return candidate;
      }
      // Fallback in unlikely case
      return { x: 0, y: 0 };
    },
    [prng]
  );

  const resetGame = useCallback(() => {
    const startingSnake: SnakeSegment[] = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    setSegments(startingSnake);
    setFood(spawnFood(startingSnake));
    setDirection('right');
    setScore(0);
    setGameOver(false);
    setPaused(false);
    setHasWon(false);
    onWhisper('Navigate the serpent through the grid!');
  }, [spawnFood, onWhisper]);

  useEffect(() => {
    onWhisper('Navigate the serpent through the grid!');
    setFood(spawnFood(segments));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore, setHighScore]);

  const isSnakeCell = useCallback(
    (x: number, y: number) => segments.some((seg) => seg.x === x && seg.y === y),
    [segments]
  );

  const tick = useCallback(() => {
    setSegments((prev) => {
      const head = prev[0];
      const newHead: SnakeSegment = { ...head };

      if (direction === 'up') newHead.y -= 1;
      if (direction === 'down') newHead.y += 1;
      if (direction === 'left') newHead.x -= 1;
      if (direction === 'right') newHead.x += 1;

      const willGrow = newHead.x === food.x && newHead.y === food.y;
      const bodyToCheck = willGrow ? prev : prev.slice(0, -1);

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        bodyToCheck.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
      ) {
        setGameOver(true);
        onWhisper(`Snake game over! Score: ${score}`);
        return prev;
      }

      const newSegments = [newHead, ...prev];

      if (willGrow) {
        const nextFood = spawnFood(newSegments);
        setFood(nextFood);
        const nextScore = score + 10;
        setScore(nextScore);
        if (audioEnabled) playNote(nextScore % 7, 0.2);

        if (nextScore >= WIN_SCORE && !hasWon) {
          setHasWon(true);
          setGameOver(true);
          setPaused(true);
          onWhisper(`Serpent mastery achieved! ${nextScore} points.`);
          onWin(nextScore);
        }
        return newSegments;
      }

      newSegments.pop();
      return newSegments;
    });
  }, [direction, food, spawnFood, audioEnabled, playNote, score, onWhisper, onWin, hasWon]);

  useEffect(() => {
    if (gameOver || paused) return undefined;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === ' ') {
        setPaused((p) => !p);
        return;
      }
      if (e.key === 'ArrowUp' && direction !== 'down') setDirection('up');
      if (e.key === 'ArrowDown' && direction !== 'up') setDirection('down');
      if (e.key === 'ArrowLeft' && direction !== 'right') setDirection('left');
      if (e.key === 'ArrowRight' && direction !== 'left') setDirection('right');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver, paused, onClose]);

  useEffect(() => {
    if (gameOver || paused) return undefined;
    const id = setInterval(tick, speedMs);
    return () => clearInterval(id);
  }, [tick, speedMs, gameOver, paused]);

  const touchControls = useMemo(
    () => [
      { label: '⬆', onPress: () => direction !== 'down' && setDirection('up') },
      { label: '⬇', onPress: () => direction !== 'up' && setDirection('down') },
      { label: '⬅', onPress: () => direction !== 'right' && setDirection('left') },
      { label: '➡', onPress: () => direction !== 'left' && setDirection('right') },
    ],
    [direction]
  );

  return (
    <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <p className="text-sm text-green-300 font-medium">Snake Game</p>
          <p className="text-sm text-green-400">Score: {score}</p>
          <p className="text-xs text-green-200">High: {highScore}</p>
          {paused && <span className="text-xs text-yellow-300">Paused</span>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPaused((p) => !p)}
            className="px-2 py-1 text-xs bg-green-700/40 hover:bg-green-600/60 border border-green-500/40 rounded"
            aria-label="Pause or resume Snake"
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={resetGame}
            className="px-2 py-1 text-xs bg-green-700/40 hover:bg-green-600/60 border border-green-500/40 rounded"
            aria-label="Restart Snake"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs bg-green-700/40 hover:bg-green-600/60 border border-green-500/40 rounded"
            aria-label="Close Snake game"
          >
            Close
          </button>
        </div>
      </div>

      {gameOver ? (
        <div className="text-center py-4">
          <p className="text-sm text-red-400 mb-2">Game Over!</p>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-15 gap-0.5 bg-gray-950 p-2 rounded">
          {Array.from({ length: GRID_SIZE }).map((_, y) => (
            <div key={y} className="flex gap-0.5">
              {Array.from({ length: GRID_SIZE }).map((_, x) => {
                const isHead = segments[0].x === x && segments[0].y === y;
                const snake = isSnakeCell(x, y);
                const isFood = food.x === x && food.y === y;
                return (
                  <div
                    key={x}
                    className={`w-3 h-3 rounded-sm ${isHead ? 'bg-green-400' : snake ? 'bg-green-600' : isFood ? 'bg-red-500' : 'bg-gray-800'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <label className="text-gray-400">Speed</label>
          <input
            type="range"
            min={100}
            max={400}
            step={20}
            value={speedMs}
            onChange={(e) => setSpeedMs(Number(e.target.value))}
            className="w-32 accent-green-500"
          />
          <span>{speedMs}ms</span>
        </div>
        <span>Controls: arrows / space to pause / Esc to close</span>
      </div>

      <div className="mt-3 flex gap-2 justify-center text-lg">
        {touchControls.map((ctrl) => (
          <button
            key={ctrl.label}
            onClick={ctrl.onPress}
            className="w-10 h-10 bg-green-800/40 hover:bg-green-700/60 rounded border border-green-500/30"
            aria-label={`Move ${ctrl.label}`}
          >
            {ctrl.label}
          </button>
        ))}
      </div>
    </div>
  );
}
