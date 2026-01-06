'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePersistentNumber } from './usePersistentNumber';

type TetrisPiece = { shape: number[][]; x: number; y: number; color: string };
type Board = number[][];

type TetrisGameProps = {
  prng: () => number;
  audioEnabled: boolean;
  playNote: (note: number, sustain?: number) => void;
  onClose: () => void;
  onWin: (score: number) => void;
  onWhisper: (text: string) => void;
};

const BOARD_HEIGHT = 20;
const BOARD_WIDTH = 10;
const WIN_SCORE = 300;

const TETRIS_PIECES = [
  { shape: [[1, 1, 1, 1]], color: '#00FFFF' }, // I
  { shape: [[1, 1], [1, 1]], color: '#FFFF00' }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#FF00FF' }, // T
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#00FF00' }, // S
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#FF0000' }, // Z
  { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000FF' }, // J
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#FFA500' }, // L
];

const rotatePiece = (shape: number[][]): number[][] => {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = [];
  for (let i = 0; i < cols; i++) {
    rotated[i] = [];
    for (let j = 0; j < rows; j++) {
      rotated[i][j] = shape[rows - 1 - j][i];
    }
  }
  return rotated;
};

export function TetrisGame({
  prng,
  audioEnabled,
  playNote,
  onClose,
  onWin,
  onWhisper,
}: TetrisGameProps) {
  const emptyBoard = useMemo<Board>(() => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)), []);
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [currentPiece, setCurrentPiece] = useState<TetrisPiece | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speedMs, setSpeedMs] = useState(500);
  const [hasWon, setHasWon] = useState(false);
  const [highScore, setHighScore] = usePersistentNumber('tetrisHighScore', 0);

  const nextRandomPiece = useCallback((): TetrisPiece => {
    const piece = TETRIS_PIECES[Math.floor(prng() * TETRIS_PIECES.length)];
    return { ...piece, x: 4, y: 0 };
  }, [prng]);

  const resetGame = useCallback(() => {
    setBoard(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(nextRandomPiece());
    setScore(0);
    setGameOver(false);
    setPaused(false);
    setHasWon(false);
    onWhisper('Stack the sacred geometries!');
  }, [nextRandomPiece, onWhisper]);

  useEffect(() => {
    onWhisper('Stack the sacred geometries!');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPiece(nextRandomPiece());
  }, [nextRandomPiece, onWhisper]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore, setHighScore]);

  const canPlacePiece = useCallback(
    (piece: TetrisPiece, offsetX = 0, offsetY = 0, targetBoard: Board = board) => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = piece.x + x + offsetX;
            const newY = piece.y + y + offsetY;
            if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return false;
            if (newY >= 0 && targetBoard[newY][newX]) return false;
          }
        }
      }
      return true;
    },
    [board]
  );

  const mergePiece = useCallback(
    (piece: TetrisPiece, targetBoard: Board) => {
      const newBoard = targetBoard.map((row) => [...row]);
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x] && piece.y + y >= 0) {
            newBoard[piece.y + y][piece.x + x] = 1;
          }
        }
      }
      return newBoard;
    },
    []
  );

  const clearLines = useCallback(
    (targetBoard: Board) => {
      const newBoard = targetBoard.map((row) => [...row]);
      let linesCleared = 0;
      for (let y = newBoard.length - 1; y >= 0; y--) {
        if (newBoard[y].every((cell) => cell === 1)) {
          newBoard.splice(y, 1);
          newBoard.unshift(Array(BOARD_WIDTH).fill(0));
          linesCleared++;
          y++;
        }
      }
      return { newBoard, linesCleared };
    },
    []
  );

  const lockPiece = useCallback(() => {
    setBoard((prevBoard) => {
      if (!currentPiece) return prevBoard;

      const boardWithPiece = mergePiece(currentPiece, prevBoard);
      const { newBoard, linesCleared } = clearLines(boardWithPiece);
      const addedScore = linesCleared * 100;
      setScore((s) => s + addedScore);
      if (linesCleared > 0 && audioEnabled) {
        playNote(linesCleared % 7, 0.3);
      }

      const nextPiece = nextRandomPiece();
      if (!canPlacePiece(nextPiece, 0, 0, newBoard)) {
        setGameOver(true);
        setCurrentPiece(null);
        onWhisper(`Tetris complete! Score: ${score + addedScore}`);
        if (score + addedScore >= WIN_SCORE && !hasWon) {
          setHasWon(true);
          onWin(score + addedScore);
        }
        return newBoard;
      }

      setCurrentPiece(nextPiece);
      return newBoard;
    });
  }, [
    currentPiece,
    mergePiece,
    clearLines,
    canPlacePiece,
    nextRandomPiece,
    audioEnabled,
    playNote,
    score,
    onWhisper,
    onWin,
    hasWon,
  ]);

  const movePiece = useCallback(
    (dx: number, dy: number) => {
      setCurrentPiece((prev) => {
        if (!prev) return prev;
        if (canPlacePiece(prev, dx, dy)) {
          return { ...prev, x: prev.x + dx, y: prev.y + dy };
        }
        if (dy > 0) {
          lockPiece();
        }
        return prev;
      });
    },
    [canPlacePiece, lockPiece]
  );

  const rotateCurrentPiece = useCallback(() => {
    setCurrentPiece((prev) => {
      if (!prev) return prev;
      const rotated = { ...prev, shape: rotatePiece(prev.shape) };
      if (canPlacePiece(rotated)) {
        return rotated;
      }
      return prev;
    });
  }, [canPlacePiece]);

  const hardDrop = useCallback(() => {
    setCurrentPiece((prev) => {
      if (!prev) return prev;
      let dropY = 0;
      while (canPlacePiece(prev, 0, dropY + 1)) {
        dropY += 1;
      }
      if (dropY > 0) {
        return { ...prev, y: prev.y + dropY };
      }
      return prev;
    });
    lockPiece();
  }, [canPlacePiece, lockPiece]);

  useEffect(() => {
    if (!currentPiece || gameOver || paused) return undefined;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === ' ') {
        setPaused((p) => !p);
        return;
      }
      if (e.key === 'ArrowLeft') movePiece(-1, 0);
      if (e.key === 'ArrowRight') movePiece(1, 0);
      if (e.key === 'ArrowDown') movePiece(0, 1);
      if (e.key === 'ArrowUp') rotateCurrentPiece();
      if (e.key === 'Shift') hardDrop();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPiece, gameOver, paused, movePiece, rotateCurrentPiece, hardDrop, onClose]);

  useEffect(() => {
    if (!currentPiece || gameOver || paused) return undefined;
    const id = setInterval(() => movePiece(0, 1), Math.max(120, speedMs));
    return () => clearInterval(id);
  }, [currentPiece, movePiece, gameOver, paused, speedMs]);

  const touchControls = useMemo(
    () => [
      { label: '⬅', onPress: () => movePiece(-1, 0) },
      { label: '⬆', onPress: rotateCurrentPiece },
      { label: '⬇', onPress: () => movePiece(0, 1) },
      { label: '⤓', onPress: hardDrop },
      { label: '⏯', onPress: () => setPaused((p) => !p) },
    ],
    [movePiece, rotateCurrentPiece, hardDrop]
  );

  return (
    <div className="mt-4 p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <p className="text-sm text-indigo-300 font-medium">Tetris Game</p>
          <p className="text-sm text-indigo-400">Score: {score}</p>
          <p className="text-xs text-indigo-200">High: {highScore}</p>
          {paused && <span className="text-xs text-yellow-300">Paused</span>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPaused((p) => !p)}
            className="px-2 py-1 text-xs bg-indigo-800/60 hover:bg-indigo-700/70 border border-indigo-500/40 rounded"
            aria-label="Pause or resume Tetris"
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={resetGame}
            className="px-2 py-1 text-xs bg-indigo-800/60 hover:bg-indigo-700/70 border border-indigo-500/40 rounded"
            aria-label="Restart Tetris"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs bg-indigo-800/60 hover:bg-indigo-700/70 border border-indigo-500/40 rounded"
            aria-label="Close Tetris game"
          >
            Close
          </button>
        </div>
      </div>

      {gameOver || !currentPiece ? (
        <div className="text-center py-4">
          <p className="text-sm text-red-400 mb-2">Game Over!</p>
          <button onClick={resetGame} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm">
            Play Again
          </button>
        </div>
      ) : (
        <div className="bg-gray-950 p-2 rounded inline-block">
          {board.map((row, y) => (
            <div key={y} className="flex gap-0.5">
              {row.map((cell, x) => {
                let cellColor = cell ? '#4B5563' : '#1F2937';
                for (let py = 0; py < currentPiece.shape.length; py++) {
                  for (let px = 0; px < currentPiece.shape[py].length; px++) {
                    if (currentPiece.shape[py][px] && currentPiece.x + px === x && currentPiece.y + py === y) {
                      cellColor = currentPiece.color;
                    }
                  }
                }
                return (
                  <div
                    key={`${x}-${y}`}
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: cellColor }}
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
            min={140}
            max={900}
            step={40}
            value={speedMs}
            onChange={(e) => setSpeedMs(Number(e.target.value))}
            className="w-32 accent-indigo-500"
          />
          <span>{speedMs}ms</span>
        </div>
        <span>Controls: arrows / space to pause / shift for hard drop / Esc to close</span>
      </div>

      <div className="mt-3 flex gap-2 justify-center text-lg">
        {touchControls.map((ctrl) => (
          <button
            key={ctrl.label}
            onClick={ctrl.onPress}
            className="w-10 h-10 bg-indigo-800/40 hover:bg-indigo-700/60 rounded border border-indigo-500/30"
            aria-label={`Control ${ctrl.label}`}
          >
            {ctrl.label}
          </button>
        ))}
      </div>
    </div>
  );
}
