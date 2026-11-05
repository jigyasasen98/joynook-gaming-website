"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { RotateCcw, Trophy, Clock, Sparkles } from "lucide-react";
import { sounds } from "@/lib/soundEffects";
import { formatTime } from "@/lib/utils";

export function SlidingPuzzleGame() {
  const [gridSize, setGridSize] = useState<3 | 4>(3);
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Generate a guaranteed solvable board by simulating random valid moves from solved state
  const initBoard = useCallback((size: 3 | 4) => {
    const total = size * size;
    // Solved order: [1, 2, 3, ..., total - 1, 0] (0 = empty)
    let currentTiles = Array.from({ length: total }, (_, i) => (i + 1) % total);
    let emptyIndex = total - 1;

    // Perform 80 random valid moves
    for (let i = 0; i < 80; i++) {
      const row = Math.floor(emptyIndex / size);
      const col = emptyIndex % size;
      const validNeighbors: number[] = [];

      if (row > 0) validNeighbors.push(emptyIndex - size); // top
      if (row < size - 1) validNeighbors.push(emptyIndex + size); // bottom
      if (col > 0) validNeighbors.push(emptyIndex - 1); // left
      if (col < size - 1) validNeighbors.push(emptyIndex + 1); // right

      const nextIndex = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
      // Swap
      currentTiles[emptyIndex] = currentTiles[nextIndex];
      currentTiles[nextIndex] = 0;
      emptyIndex = nextIndex;
    }

    setTiles(currentTiles);
    setMoves(0);
    setTimer(0);
    setIsRunning(false);
    setIsWon(false);
  }, []);

  useEffect(() => {
    initBoard(gridSize);
  }, [gridSize, initBoard]);

  // Stopwatch timer
  useEffect(() => {
    if (!isRunning || isWon) return;
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isWon]);

  // Handle tile click
  const handleTileClick = (index: number) => {
    if (isWon || tiles[index] === 0) return;

    const size = gridSize;
    const emptyIndex = tiles.indexOf(0);

    const tileRow = Math.floor(index / size);
    const tileCol = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    const isAdjacent =
      (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
      (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow);

    if (isAdjacent) {
      if (!isRunning) setIsRunning(true);

      sounds.slideTile();

      const newTiles = [...tiles];
      newTiles[emptyIndex] = tiles[index];
      newTiles[index] = 0;

      setTiles(newTiles);
      setMoves((m) => m + 1);

      // Check win condition: [1, 2, ..., total-1, 0]
      const total = size * size;
      const won = newTiles.every((val, idx) => (idx === total - 1 ? val === 0 : val === idx + 1));

      if (won) {
        setIsWon(true);
        setIsRunning(false);
        sounds.victoryFanfare();
        confetti({ particleCount: 75, spread: 80 });
      }
    }
  };

  const handleRestart = () => {
    sounds.uiClick();
    initBoard(gridSize);
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-purple-50/60 via-white to-purple-100/30 dark:from-[#18172E] dark:via-[#131226] dark:to-[#1C1B33] rounded-3xl border border-purple-100 dark:border-purple-900/50 flex flex-col justify-between p-4 sm:p-6 shadow-inner overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          {/* Moves */}
          <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>Moves:</span>
            <span className="font-extrabold text-brand-purple dark:text-purple-300">{moves}</span>
          </div>

          {/* Timer */}
          <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5 text-brand-sky" />
            <span className="font-mono font-extrabold text-brand-text-dark dark:text-white">
              {formatTime(timer)}
            </span>
          </div>

          {/* Grid Size Switcher */}
          <div className="p-1 rounded-xl bg-purple-100/70 dark:bg-purple-950/60 flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setGridSize(3)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                gridSize === 3
                  ? "bg-white dark:bg-[#1E1D36] text-brand-purple dark:text-purple-300 shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              3x3
            </button>
            <button
              onClick={() => setGridSize(4)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                gridSize === 4
                  ? "bg-white dark:bg-[#1E1D36] text-brand-purple dark:text-purple-300 shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              4x4
            </button>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1E1D36] text-brand-text-dark dark:text-white shadow-sm hover:text-brand-purple border border-purple-100 dark:border-purple-800/40 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Main Sliding Grid */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div
          className="grid gap-2 sm:gap-3 p-3 bg-purple-100/60 dark:bg-purple-950/40 rounded-3xl shadow-inner border border-purple-200/60 dark:border-purple-900/40 backdrop-blur-sm"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: "min(340px, 72vw)",
            height: "min(340px, 72vw)",
          }}
        >
          {tiles.map((tileVal, idx) => {
            if (tileVal === 0) {
              return (
                <div
                  key="empty"
                  className="w-full h-full rounded-2xl bg-purple-200/20 dark:bg-purple-950/20 border border-dashed border-purple-300/40"
                />
              );
            }

            return (
              <button
                key={tileVal}
                onClick={() => handleTileClick(idx)}
                className="w-full h-full rounded-2xl bg-gradient-to-tr from-brand-purple to-purple-500 text-white font-extrabold text-xl sm:text-2xl shadow-card hover:shadow-card-hover flex items-center justify-center border-t border-purple-300/40 active:scale-95 transition-all duration-150"
              >
                {tileVal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-center z-10">
        <span className="text-[11px] font-semibold text-brand-text-muted dark:text-gray-400 bg-white/70 dark:bg-[#121124]/70 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-100/60 dark:border-purple-900/40">
          💡 Click tiles adjacent to the empty slot to slide into sequence
        </span>
      </div>

      {/* Victory Modal */}
      {isWon && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1B33] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-purple-100 dark:border-purple-800/50 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-4xl">🎉</span>
            <h3 className="font-extrabold text-xl text-brand-text-dark dark:text-white mt-2">
              Puzzle Solved!
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-1">
              Completed in {moves} moves and {formatTime(timer)}!
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
    </div>
  );
}
