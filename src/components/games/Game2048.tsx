"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { RotateCcw, Trophy, Sparkles } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

type Board = number[][];

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  2: { bg: "bg-purple-100 dark:bg-purple-950/60", text: "text-purple-800 dark:text-purple-200" },
  4: { bg: "bg-purple-200 dark:bg-purple-900/60", text: "text-purple-900 dark:text-purple-100" },
  8: { bg: "bg-coral-200 dark:bg-coral-900/60", text: "text-coral-900 dark:text-coral-100" },
  16: { bg: "bg-coral-300 dark:bg-coral-800/80", text: "text-white" },
  32: { bg: "bg-coral-400 dark:bg-coral-700", text: "text-white" },
  64: { bg: "bg-brand-coral", text: "text-white" },
  128: { bg: "bg-yellow-200 dark:bg-yellow-900/80", text: "text-yellow-900 dark:text-yellow-100" },
  256: { bg: "bg-yellow-300 dark:bg-yellow-800", text: "text-yellow-900 dark:text-white" },
  512: { bg: "bg-brand-yellow", text: "text-yellow-950" },
  1024: { bg: "bg-mint-400 dark:bg-mint-600", text: "text-white" },
  2048: { bg: "bg-brand-purple text-white shadow-glow", text: "text-white" },
  4096: { bg: "bg-indigo-600 text-white shadow-glow", text: "text-white" },
};

export function Game2048() {
  const [board, setBoard] = useState<Board>(() => [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Load best score
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("joynook_2048_best");
      if (saved) setBestScore(parseInt(saved, 10));
    }
  }, []);

  // Update best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      if (typeof window !== "undefined") {
        localStorage.setItem("joynook_2048_best", score.toString());
      }
    }
  }, [score, bestScore]);

  // Spawn random tile (2 or 4)
  const spawnTile = (b: Board): Board => {
    const emptyCells: [number, number][] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) emptyCells.push([r, c]);
      }
    }
    if (emptyCells.length === 0) return b;
    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const val = Math.random() < 0.9 ? 2 : 4;
    const next = b.map((row) => [...row]);
    next[r][c] = val;
    return next;
  };

  const initGame = useCallback(() => {
    let newBoard: Board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    newBoard = spawnTile(newBoard);
    newBoard = spawnTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setIsGameOver(false);
    setHasWon(false);
    setKeepPlaying(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Check if any moves are possible
  const checkGameOver = (b: Board): boolean => {
    // If empty cells exist
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) return false;
      }
    }
    // Check horizontal and vertical merges
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (r < 3 && b[r][c] === b[r + 1][c]) return false;
        if (c < 3 && b[r][c] === b[r][c + 1]) return false;
      }
    }
    return true;
  };

  // Move Logic
  const slideRow = (row: number[]): { newRow: number[]; gained: number; won: boolean } => {
    const filtered = row.filter((val) => val !== 0);
    const newRow: number[] = [];
    let gained = 0;
    let won = false;

    let i = 0;
    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const mergedVal = filtered[i] * 2;
        newRow.push(mergedVal);
        gained += mergedVal;
        if (mergedVal === 2048) won = true;
        i += 2;
      } else {
        newRow.push(filtered[i]);
        i += 1;
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { newRow, gained, won };
  };

  const move = useCallback(
    (dir: "up" | "down" | "left" | "right") => {
      if (isGameOver) return;
      if (hasWon && !keepPlaying) return;

      let changed = false;
      let addedScore = 0;
      let wonReached = false;
      let newBoard = board.map((r) => [...r]);

      if (dir === "left") {
        for (let r = 0; r < 4; r++) {
          const { newRow, gained, won } = slideRow(newBoard[r]);
          if (newRow.some((val, idx) => val !== newBoard[r][idx])) changed = true;
          newBoard[r] = newRow;
          addedScore += gained;
          if (won) wonReached = true;
        }
      } else if (dir === "right") {
        for (let r = 0; r < 4; r++) {
          const reversed = [...newBoard[r]].reverse();
          const { newRow, gained, won } = slideRow(reversed);
          const restored = newRow.reverse();
          if (restored.some((val, idx) => val !== newBoard[r][idx])) changed = true;
          newBoard[r] = restored;
          addedScore += gained;
          if (won) wonReached = true;
        }
      } else if (dir === "up") {
        for (let c = 0; c < 4; c++) {
          const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
          const { newRow, gained, won } = slideRow(col);
          if (newRow.some((val, idx) => val !== col[idx])) changed = true;
          for (let r = 0; r < 4; r++) newBoard[r][c] = newRow[r];
          addedScore += gained;
          if (won) wonReached = true;
        }
      } else if (dir === "down") {
        for (let c = 0; c < 4; c++) {
          const col = [newBoard[3][c], newBoard[2][c], newBoard[1][c], newBoard[0][c]];
          const { newRow, gained, won } = slideRow(col);
          const restored = newRow.reverse();
          if (restored.some((val, idx) => val !== newBoard[idx][c])) changed = true;
          for (let r = 0; r < 4; r++) newBoard[r][c] = restored[r];
          addedScore += gained;
          if (won) wonReached = true;
        }
      }

      if (changed) {
        sounds.slideTile();
        const spawned = spawnTile(newBoard);
        setBoard(spawned);
        setScore((s) => s + addedScore);

        if (wonReached && !keepPlaying) {
          setHasWon(true);
          sounds.victoryFanfare();
          confetti({ particleCount: 80, spread: 80 });
        } else if (checkGameOver(spawned)) {
          setIsGameOver(true);
          sounds.uiClick();
        }
      }
    },
    [board, isGameOver, hasWon, keepPlaying]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") move("up");
      else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") move("down");
      else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") move("left");
      else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") move("right");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move]);

  // Touch Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 30) {
      if (absX > absY) {
        if (dx > 0) move("right");
        else move("left");
      } else {
        if (dy > 0) move("down");
        else move("up");
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-purple-50/60 via-white to-purple-100/30 dark:from-[#18172E] dark:via-[#131226] dark:to-[#1C1B33] rounded-3xl border border-purple-100 dark:border-purple-900/50 flex flex-col justify-between p-4 sm:p-6 shadow-inner overflow-hidden select-none game-viewport"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          {/* Current Score */}
          <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>Score:</span>
            <span className="font-extrabold text-brand-purple dark:text-purple-300">{score}</span>
          </div>

          {/* Best Score */}
          <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
            <Trophy className="w-3.5 h-3.5 text-brand-yellow" />
            <span className="font-extrabold text-brand-text-dark dark:text-white">
              {bestScore}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.uiClick();
            initGame();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1E1D36] text-brand-text-dark dark:text-white shadow-sm hover:text-brand-purple border border-purple-100 dark:border-purple-800/40 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>

      {/* Main 2048 4x4 Grid */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div
          className="grid grid-cols-4 gap-2 sm:gap-3 p-3 bg-purple-200/50 dark:bg-purple-950/40 rounded-3xl shadow-inner border border-purple-200/60 dark:border-purple-900/40 backdrop-blur-sm"
          style={{ width: "min(340px, 72vw)", height: "min(340px, 72vw)" }}
        >
          {board.map((row, r) =>
            row.map((val, c) => {
              const tileStyle = TILE_COLORS[val] || {
                bg: "bg-purple-900 text-white",
                text: "text-white",
              };

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-full h-full rounded-2xl flex items-center justify-center font-extrabold text-xl sm:text-2xl transition-all duration-150 ${
                    val === 0
                      ? "bg-purple-100/40 dark:bg-purple-900/20"
                      : `${tileStyle.bg} ${tileStyle.text} shadow-sm animate-in zoom-in-75 duration-100`
                  }`}
                >
                  {val > 0 ? val : ""}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-center z-10">
        <span className="text-[11px] font-semibold text-brand-text-muted dark:text-gray-400 bg-white/70 dark:bg-[#121124]/70 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-100/60 dark:border-purple-900/40">
          💡 Swipe or use Arrow keys to merge identical numbers into 2048!
        </span>
      </div>

      {/* 2048 Win Modal */}
      {hasWon && !keepPlaying && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1B33] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-purple-100 dark:border-purple-800/50 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-4xl">👑</span>
            <h3 className="font-extrabold text-xl text-brand-text-dark dark:text-white mt-2">
              You Reached 2048!
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-1">
              Incredible strategy and patience!
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setKeepPlaying(true)}
                className="flex-1 py-2.5 rounded-2xl bg-purple-100 text-brand-purple font-bold text-xs hover:bg-purple-200"
              >
                Keep Playing
              </button>
              <button
                onClick={initGame}
                className="flex-1 py-2.5 rounded-2xl bg-brand-purple text-white font-bold text-xs shadow-md"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1B33] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-purple-100 dark:border-purple-800/50 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-4xl">💫</span>
            <h3 className="font-extrabold text-xl text-brand-text-dark dark:text-white mt-2">
              Game Over!
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-1">
              No more valid merges remaining.
            </p>
            <div className="my-3 py-2 bg-purple-50 dark:bg-purple-950/50 rounded-2xl">
              <span className="text-xs text-gray-500 font-bold uppercase">Final Score</span>
              <p className="text-2xl font-extrabold text-brand-purple dark:text-purple-300">
                {score}
              </p>
            </div>
            <button
              onClick={initGame}
              className="w-full py-2.5 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-transform active:scale-95"
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
