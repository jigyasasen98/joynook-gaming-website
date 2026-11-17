"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { RotateCcw, Sparkles } from "lucide-react";
import { sounds } from "@/lib/soundEffects";
import { triggerHaptic } from "@/lib/haptics";

const GRID_ROWS = 6;
const GRID_COLS = 8;
const TOTAL_BUBBLES = GRID_ROWS * GRID_COLS;

export function VirtualBubbleWrapGame() {
  const [poppedState, setPoppedState] = useState<boolean[]>(
    Array(TOTAL_BUBBLES).fill(false)
  );
  const [sessionPops, setSessionPops] = useState(0);
  const [lifetimePops, setLifetimePops] = useState(0);
  const isDraggingRef = useRef(false);

  // Load lifetime pops from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("joynook_bubblewrap_lifetime");
      if (saved) setLifetimePops(parseInt(saved, 10));
    }
  }, []);

  const popBubble = (index: number) => {
    if (poppedState[index]) return; // already popped

    sounds.bubbleWrapSnap();
    triggerHaptic("medium");

    setPoppedState((prev) => {
      const next = [...prev];
      next[index] = true;

      // Check if all popped
      const allDone = next.every((p) => p);
      if (allDone) {
        confetti({ particleCount: 60, spread: 70 });
        sounds.victoryFanfare();
        triggerHaptic("success");
      }

      return next;
    });

    setSessionPops((p) => p + 1);
    setLifetimePops((p) => {
      const next = p + 1;
      if (typeof window !== "undefined") {
        localStorage.setItem("joynook_bubblewrap_lifetime", next.toString());
      }
      return next;
    });
  };

  const handlePointerDown = (index: number) => {
    isDraggingRef.current = true;
    popBubble(index);
  };

  const handlePointerEnter = (index: number) => {
    if (isDraggingRef.current) {
      popBubble(index);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, []);

  const resetSheet = () => {
    sounds.uiClick();
    setPoppedState(Array(TOTAL_BUBBLES).fill(false));
  };

  const remaining = poppedState.filter((p) => !p).length;

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-sky-50/70 via-white to-blue-50/40 dark:from-[#15162D] dark:via-[#111124] dark:to-[#1C1D3A] rounded-3xl border border-sky-100 dark:border-sky-950/50 flex flex-col justify-between p-4 sm:p-6 shadow-inner overflow-hidden select-none">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-sky-100 dark:border-sky-900/40 flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Sheet:</span>
            <span className="text-sm font-extrabold text-brand-sky">
              {TOTAL_BUBBLES - remaining} / {TOTAL_BUBBLES}
            </span>
          </div>

          <div className="hidden sm:flex px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-sky-100 dark:border-sky-900/40 text-xs font-bold text-gray-500 dark:text-gray-400">
            Lifetime: {lifetimePops}
          </div>
        </div>

        <button
          onClick={resetSheet}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1E1D36] text-brand-text-dark dark:text-white shadow-sm hover:text-brand-purple border border-sky-100 dark:border-sky-900/40 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Sheet</span>
        </button>
      </div>

      {/* Bubble Wrap Grid */}
      <div className="flex-1 flex items-center justify-center p-2 game-viewport">
        <div
          className="grid gap-2 sm:gap-3 p-4 bg-sky-200/40 dark:bg-sky-950/30 rounded-3xl shadow-inner border border-sky-200/50 dark:border-sky-900/30 backdrop-blur-sm"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
            maxWidth: "480px",
            width: "100%",
          }}
        >
          {poppedState.map((isPopped, idx) => (
            <div
              key={idx}
              onPointerDown={() => handlePointerDown(idx)}
              onPointerEnter={() => handlePointerEnter(idx)}
              className={`aspect-square rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center relative ${
                isPopped
                  ? "bg-sky-100/40 dark:bg-sky-950/20 shadow-inner scale-90 border border-sky-200/30"
                  : "bg-gradient-to-tr from-sky-400/80 to-blue-300 shadow-md hover:scale-105 active:scale-95 border-2 border-white/90"
              }`}
            >
              {/* Convex 3D bubble dome reflection */}
              {!isPopped && (
                <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-white/80 pointer-events-none" />
              )}
              {isPopped && (
                <div className="w-2 h-2 rounded-full bg-sky-300/30 pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-center z-10">
        <span className="text-[11px] font-semibold text-brand-text-muted dark:text-gray-400 bg-white/70 dark:bg-[#121124]/70 px-3 py-1 rounded-full backdrop-blur-sm border border-sky-100/60 dark:border-sky-900/40">
          💡 Click or drag across bubbles for rapid-fire multi-popping!
        </span>
      </div>
    </div>
  );
}
