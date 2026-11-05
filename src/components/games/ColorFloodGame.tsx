"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { RotateCcw, Trophy, Sparkles } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

const FLOOD_COLORS = [
  { name: "Purple", hex: "#7856E8" },
  { name: "Coral", hex: "#FF7777" },
  { name: "Yellow", hex: "#FFD66B" },
  { name: "Mint", hex: "#4ECCA3" },
  { name: "Sky", hex: "#5BC0EB" },
  { name: "Pink", hex: "#FF9E9E" },
];

export function ColorFloodGame() {
  const [boardSize, setBoardSize] = useState<10 | 14>(10);
  const [maxMoves, setMaxMoves] = useState(22);
  const [movesLeft, setMovesLeft] = useState(22);
  const [grid, setGrid] = useState<number[][]>([]);
  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);

  // Initialize randomized grid
  const initBoard = useCallback((size: 10 | 14) => {
    const moves = size === 10 ? 22 : 26;
    setMaxMoves(moves);
    setMovesLeft(moves);
    setIsWon(false);
    setIsLost(false);

    const newGrid: number[][] = [];
    for (let r = 0; r < size; r++) {
      const row: number[] = [];
      for (let c = 0; c < size; c++) {
        row.push(Math.floor(Math.random() * FLOOD_COLORS.length));
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  }, []);

  useEffect(() => {
    initBoard(boardSize);
  }, [boardSize, initBoard]);

  // Flood fill algorithm
  const handleColorPick = (chosenColorIndex: number) => {
    if (isWon || isLost || grid.length === 0) return;
    const currentColor = grid[0][0];
    if (chosenColorIndex === currentColor) return; // No change

    sounds.bubblePop(1.1);

    // Deep copy grid
    const newGrid = grid.map((row) => [...row]);
    const size = boardSize;

    // BFS or DFS to flood contiguous region matching currentColor starting from (0,0)
    const visited = Array.from({ length: size }, () => Array(size).fill(false));
    const queue: [number, number][] = [[0, 0]];
    visited[0][0] = true;

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      newGrid[r][c] = chosenColorIndex;

      // 4 neighbors
      const neighbors: [number, number][] = [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ];

      for (const [nr, nc] of neighbors) {
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
          if (grid[nr][nc] === currentColor) {
            visited[nr][nc] = true;
            queue.push([nr, nc]);
          }
        }
      }
    }

    setGrid(newGrid);

    const newMovesLeft = movesLeft - 1;
    setMovesLeft(newMovesLeft);

    // Check if won: all tiles match chosenColorIndex
    const allMatch = newGrid.every((row) => row.every((c) => c === chosenColorIndex));

    if (allMatch) {
      setIsWon(true);
      sounds.victoryFanfare();
      confetti({ particleCount: 75, spread: 80 });
    } else if (newMovesLeft <= 0) {
      setIsLost(true);
      sounds.uiClick();
    }
  };

  const handleRestart = () => {
    sounds.uiClick();
    initBoard(boardSize);
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-purple-50/60 via-white to-purple-100/30 dark:from-[#18172E] dark:via-[#131226] dark:to-[#1C1B33] rounded-3xl border border-purple-100 dark:border-purple-900/50 flex flex-col justify-between p-4 shadow-inner overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Moves:</span>
            <span
              className={`text-sm font-extrabold ${
                movesLeft <= 3 ? "text-brand-coral" : "text-brand-purple dark:text-purple-300"
              }`}
            >
              {movesLeft} / {maxMoves}
            </span>
          </div>

          <div className="p-1 rounded-xl bg-purple-100/70 dark:bg-purple-950/60 flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => {
                setBoardSize(10);
                initBoard(10);
              }}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                boardSize === 10
                  ? "bg-white dark:bg-[#1E1D36] text-brand-purple dark:text-purple-300 shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              10x10
            </button>
            <button
              onClick={() => {
                setBoardSize(14);
                initBoard(14);
              }}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                boardSize === 14
                  ? "bg-white dark:bg-[#1E1D36] text-brand-purple dark:text-purple-300 shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              14x14
            </button>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1E1D36] text-brand-text-dark dark:text-white shadow-sm hover:text-brand-purple border border-purple-100 dark:border-purple-800/40 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>
      </div>

      {/* Main Color Grid */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div
          className="grid gap-[2px] p-2 bg-white/70 dark:bg-[#1C1B33]/80 rounded-2xl shadow-md border border-purple-100 dark:border-purple-900/40"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
            width: "min(340px, 68vw)",
            height: "min(340px, 68vw)",
          }}
        >
          {grid.map((row, r) =>
            row.map((colorIndex, c) => (
              <div
                key={`${r}-${c}`}
                style={{ backgroundColor: FLOOD_COLORS[colorIndex].hex }}
                className="w-full h-full rounded-[2px] transition-colors duration-200"
              />
            ))
          )}
        </div>
      </div>

      {/* Bottom Color Swatches Bar */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 z-10 pb-1">
        {FLOOD_COLORS.map((col, idx) => (
          <button
            key={col.name}
            onClick={() => handleColorPick(idx)}
            disabled={isWon || isLost}
            style={{ backgroundColor: col.hex }}
            title={`Flood with ${col.name}`}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl shadow-md hover:scale-110 active:scale-95 transition-transform border-2 border-white/80 dark:border-white/20 focus:outline-none"
          />
        ))}
      </div>

      {/* Modals */}
      {isWon && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1B33] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-purple-100 dark:border-purple-800/50 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-4xl">🏆</span>
            <h3 className="font-extrabold text-xl text-brand-text-dark dark:text-white mt-2">
              Board Flooded!
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-1">
              You conquered the grid with {movesLeft} moves to spare!
            </p>
            <button
              onClick={handleRestart}
              className="mt-4 w-full py-2.5 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      )}

      {isLost && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1B33] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-purple-100 dark:border-purple-800/50 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-4xl">💫</span>
            <h3 className="font-extrabold text-xl text-brand-text-dark dark:text-white mt-2">
              Out of Moves!
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-1">
              So close! Try planning two steps ahead next time.
            </p>
            <button
              onClick={handleRestart}
              className="mt-4 w-full py-2.5 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
