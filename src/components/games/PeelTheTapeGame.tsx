"use client";

import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import { RotateCcw, Sparkles } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

interface TapeStrip {
  id: number;
  label: string;
  color: string;
  pattern: string;
  peelPercent: number; // 0 to 100
  rotation: number;
  top: number; // percent
  left: number; // percent
  width: number; // px
  isComplete: boolean;
}

const INITIAL_TAPES: TapeStrip[] = [
  {
    id: 1,
    label: "🌸 Spring Blooms",
    color: "#FF9E9E",
    pattern: "repeating-linear-gradient(45deg, #FF9E9E, #FF9E9E 10px, #FFB8B8 10px, #FFB8B8 20px)",
    peelPercent: 0,
    rotation: -8,
    top: 25,
    left: 20,
    width: 280,
    isComplete: false,
  },
  {
    id: 2,
    label: "✨ Starry Sky",
    color: "#7856E8",
    pattern: "repeating-linear-gradient(-45deg, #7856E8, #7856E8 10px, #987AEE 10px, #987AEE 20px)",
    peelPercent: 0,
    rotation: 6,
    top: 42,
    left: 15,
    width: 320,
    isComplete: false,
  },
  {
    id: 3,
    label: "🌿 Mint Matcha",
    color: "#4ECCA3",
    pattern: "repeating-linear-gradient(45deg, #4ECCA3, #4ECCA3 12px, #70DEB1 12px, #70DEB1 24px)",
    peelPercent: 0,
    rotation: -4,
    top: 60,
    left: 22,
    width: 290,
    isComplete: false,
  },
  {
    id: 4,
    label: "☀️ Sunset Glow",
    color: "#FFD66B",
    pattern: "repeating-linear-gradient(90deg, #FFD66B, #FFD66B 15px, #FFE082 15px, #FFE082 30px)",
    peelPercent: 0,
    rotation: 12,
    top: 76,
    left: 18,
    width: 300,
    isComplete: false,
  },
];

export function PeelTheTapeGame() {
  const [tapes, setTapes] = useState<TapeStrip[]>(INITIAL_TAPES);
  const activeTapeRef = useRef<number | null>(null);
  const dragStartXRef = useRef<number>(0);
  const startPercentRef = useRef<number>(0);

  const handlePointerDown = (id: number, e: React.PointerEvent) => {
    const tape = tapes.find((t) => t.id === id);
    if (!tape || tape.isComplete) return;

    activeTapeRef.current = id;
    dragStartXRef.current = e.clientX;
    startPercentRef.current = tape.peelPercent;
    sounds.tapePeel();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeTapeRef.current === null) return;

    const deltaX = e.clientX - dragStartXRef.current;
    const progress = Math.min(100, Math.max(0, startPercentRef.current + (deltaX / 2.5)));

    setTapes((prev) =>
      prev.map((t) => {
        if (t.id === activeTapeRef.current) {
          const isComplete = progress >= 95;
          if (isComplete && !t.isComplete) {
            sounds.bubblePop(1.4);
          }
          return {
            ...t,
            peelPercent: progress,
            isComplete,
          };
        }
        return t;
      })
    );
  };

  const handlePointerUp = () => {
    activeTapeRef.current = null;

    // Check if all peeled
    const allDone = tapes.every((t) => t.isComplete);
    if (allDone) {
      confetti({ particleCount: 50, spread: 70 });
    }
  };

  const resetTapes = () => {
    sounds.uiClick();
    setTapes(INITIAL_TAPES.map((t) => ({ ...t, peelPercent: 0, isComplete: false })));
  };

  const completedCount = tapes.filter((t) => t.isComplete).length;

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#FAF8F5] dark:bg-[#151426] rounded-3xl border border-amber-100 dark:border-purple-950/60 flex flex-col justify-between p-4 sm:p-6 shadow-inner overflow-hidden select-none"
    >
      {/* Wooden / Craft desk subtle grid lines */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#E8E0D5 1px, transparent 1px), linear-gradient(90deg, #E8E0D5 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Controls */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="px-3.5 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-yellow" />
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Peeled:</span>
          <span className="text-sm font-extrabold text-brand-purple dark:text-purple-300">
            {completedCount} / {tapes.length}
          </span>
        </div>

        <button
          onClick={resetTapes}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1E1D36] text-brand-text-dark dark:text-white shadow-sm hover:text-brand-purple border border-purple-100 dark:border-purple-800/40 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Apply New Tape</span>
        </button>
      </div>

      {/* Main Interactive Tape Surface */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center">
        {tapes.map((tape) => {
          if (tape.isComplete) return null; // Peeled off!

          const unpeeledWidth = 100 - tape.peelPercent;

          return (
            <div
              key={tape.id}
              style={{
                top: `${tape.top}%`,
                left: `${tape.left}%`,
                transform: `rotate(${tape.rotation}deg)`,
                width: `${tape.width}px`,
                maxWidth: "75%",
              }}
              className="absolute h-12 rounded-sm shadow-md transition-shadow cursor-grab active:cursor-grabbing flex items-center"
            >
              {/* Peeled Curl Tab */}
              <div
                onPointerDown={(e) => handlePointerDown(tape.id, e)}
                style={{
                  width: `${tape.peelPercent}%`,
                  transform: `scaleX(-1) skewY(-5deg)`,
                  backgroundColor: "#FFFFFF",
                  opacity: 0.9,
                }}
                className="h-full rounded-l-sm border-r-2 border-dashed border-gray-300 shadow-lg relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-yellow-100/40" />
              </div>

              {/* Remaining Adhered Tape Strip */}
              <div
                onPointerDown={(e) => handlePointerDown(tape.id, e)}
                style={{
                  width: `${unpeeledWidth}%`,
                  background: tape.pattern,
                }}
                className="h-full rounded-r-sm flex items-center justify-center px-4 relative shadow-sm border-t border-b border-white/40"
              >
                <span className="text-xs font-bold text-white drop-shadow-sm select-none pointer-events-none truncate">
                  {tape.label}
                </span>

                {/* Peel Arrow Hint on left edge */}
                {tape.peelPercent < 15 && (
                  <span className="absolute left-1 text-[10px] bg-white/80 rounded px-1 text-gray-700 animate-pulse">
                    Pull ➔
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {completedCount === tapes.length && (
          <div className="text-center z-10 animate-in fade-in zoom-in-95">
            <span className="text-5xl">✨</span>
            <p className="font-extrabold text-xl text-brand-purple dark:text-purple-300 mt-2">
              Clean Surface!
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All tape cleanly peeled away with zero sticky residue.
            </p>
            <button
              onClick={resetTapes}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-md hover:bg-brand-purple/90"
            >
              Peel More Tape
            </button>
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="text-center z-10">
        <span className="text-[11px] font-semibold text-brand-text-muted dark:text-gray-400 bg-white/70 dark:bg-[#121124]/70 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-100/60 dark:border-purple-900/40">
          💡 Click and drag the tape edge to pull and peel it off the board!
        </span>
      </div>
    </div>
  );
}
