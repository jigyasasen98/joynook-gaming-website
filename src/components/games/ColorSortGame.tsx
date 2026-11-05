"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { RotateCcw, Undo2, Trophy, Sparkles, ChevronRight } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

// Standard pastel liquid colors
const COLOR_MAP: Record<string, { bg: string; name: string }> = {
  purple: { bg: "#7856E8", name: "Purple" },
  coral: { bg: "#FF7777", name: "Coral" },
  yellow: { bg: "#FFD66B", name: "Yellow" },
  mint: { bg: "#4ECCA3", name: "Mint" },
  sky: { bg: "#5BC0EB", name: "Sky" },
  orange: { bg: "#FFA07A", name: "Orange" },
};

// Handcrafted level configs (each tube has 4 capacity)
const LEVELS: { tubes: string[][] }[] = [
  // Level 1: 3 tubes, 2 colors (Intro)
  {
    tubes: [
      ["purple", "coral", "purple", "coral"],
      ["coral", "purple", "coral", "purple"],
      [],
    ],
  },
  // Level 2: 4 tubes, 3 colors
  {
    tubes: [
      ["mint", "purple", "coral", "mint"],
      ["coral", "mint", "purple", "coral"],
      ["purple", "coral", "mint", "purple"],
      [],
    ],
  },
  // Level 3: 5 tubes, 3 colors
  {
    tubes: [
      ["yellow", "purple", "coral", "yellow"],
      ["purple", "coral", "yellow", "purple"],
      ["coral", "yellow", "purple", "coral"],
      [],
      [],
    ],
  },
  // Level 4: 5 tubes, 4 colors
  {
    tubes: [
      ["mint", "yellow", "sky", "coral"],
      ["sky", "mint", "yellow", "mint"],
      ["coral", "sky", "coral", "yellow"],
      ["yellow", "coral", "mint", "sky"],
      [],
      [],
    ],
  },
  // Level 5: 6 tubes, 4 colors
  {
    tubes: [
      ["purple", "yellow", "mint", "purple"],
      ["coral", "mint", "purple", "yellow"],
      ["yellow", "coral", "coral", "mint"],
      ["mint", "purple", "yellow", "coral"],
      [],
      [],
    ],
  },
];

export function ColorSortGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [tubes, setTubes] = useState<string[][]>([]);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [history, setHistory] = useState<string[][][]>([]);
  const [isWon, setIsWon] = useState(false);
  const [movesCount, setMovesCount] = useState(0);

  // Initialize level
  const initLevel = useCallback((lvlIdx: number) => {
    const config = LEVELS[lvlIdx % LEVELS.length];
    // Deep copy
    setTubes(config.tubes.map((t) => [...t]));
    setSelectedTube(null);
    setHistory([]);
    setIsWon(false);
    setMovesCount(0);
  }, []);

  useEffect(() => {
    initLevel(levelIndex);
  }, [levelIndex, initLevel]);

  // Check victory condition
  const checkWin = (currentTubes: string[][]) => {
    const allSorted = currentTubes.every((t) => {
      if (t.length === 0) return true;
      if (t.length !== 4) return false;
      return t.every((color) => color === t[0]);
    });

    if (allSorted) {
      setIsWon(true);
      sounds.victoryFanfare();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleTubeClick = (index: number) => {
    if (isWon) return;

    // If nothing selected, select this tube if not empty
    if (selectedTube === null) {
      if (tubes[index].length > 0) {
        setSelectedTube(index);
        sounds.uiClick();
      }
      return;
    }

    // If clicking same tube, unselect
    if (selectedTube === index) {
      setSelectedTube(null);
      sounds.uiClick();
      return;
    }

    // Attempt pour from selectedTube -> index
    const source = tubes[selectedTube];
    const target = tubes[index];

    if (target.length >= 4) {
      // Target full
      setSelectedTube(index);
      sounds.uiClick();
      return;
    }

    const sourceTopColor = source[source.length - 1];
    const targetTopColor = target.length > 0 ? target[target.length - 1] : null;

    if (targetTopColor === null || targetTopColor === sourceTopColor) {
      // Valid pour! Check how many contiguous segments of sourceTopColor can move
      let countToMove = 0;
      for (let i = source.length - 1; i >= 0; i--) {
        if (source[i] === sourceTopColor) countToMove++;
        else break;
      }
      const availableSpace = 4 - target.length;
      const actualMove = Math.min(countToMove, availableSpace);

      if (actualMove > 0) {
        // Save history for undo
        setHistory((prev) => [...prev, tubes.map((t) => [...t])]);

        // Pour
        const newTubes = tubes.map((t) => [...t]);
        const movedColors = newTubes[selectedTube].splice(-actualMove, actualMove);
        newTubes[index].push(...movedColors);

        setTubes(newTubes);
        setSelectedTube(null);
        setMovesCount((m) => m + 1);
        sounds.liquidPour();

        // Check victory
        checkWin(newTubes);
        return;
      }
    }

    // Invalid pour onto non-matching tube: switch selection
    if (tubes[index].length > 0) {
      setSelectedTube(index);
      sounds.uiClick();
    } else {
      setSelectedTube(null);
    }
  };

  const handleUndo = () => {
    if (history.length === 0 || isWon) return;
    sounds.uiClick();
    const prev = history[history.length - 1];
    setTubes(prev);
    setHistory((h) => h.slice(0, -1));
    setSelectedTube(null);
  };

  const handleRestart = () => {
    sounds.uiClick();
    initLevel(levelIndex);
  };

  const handleNextLevel = () => {
    sounds.uiClick();
    setLevelIndex((prev) => (prev + 1) % LEVELS.length);
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-purple-50/60 via-white to-purple-100/30 dark:from-[#18172E] dark:via-[#131226] dark:to-[#1C1B33] rounded-3xl border border-purple-100 dark:border-purple-900/50 flex flex-col justify-between p-4 sm:p-6 shadow-inner overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 text-xs font-extrabold text-brand-purple dark:text-purple-300">
            Level {levelIndex + 1} / {LEVELS.length}
          </span>
          <span className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 text-xs font-bold text-gray-500 dark:text-gray-400">
            Moves: {movesCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || isWon}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              history.length > 0 && !isWon
                ? "bg-white dark:bg-[#1E1D36] text-brand-text-dark dark:text-white shadow-sm hover:text-brand-purple border border-purple-100 dark:border-purple-800/40"
                : "opacity-40 cursor-not-allowed text-gray-400"
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1E1D36] text-brand-text-dark dark:text-white shadow-sm hover:text-brand-purple border border-purple-100 dark:border-purple-800/40 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Main Tubes Display Area */}
      <div className="flex-1 flex items-center justify-center gap-3 sm:gap-6 px-2 py-4">
        {tubes.map((tube, idx) => {
          const isSelected = selectedTube === idx;
          return (
            <div
              key={idx}
              onClick={() => handleTubeClick(idx)}
              className={`relative flex flex-col justify-end items-center cursor-pointer transition-transform duration-200 select-none ${
                isSelected ? "-translate-y-5" : "hover:-translate-y-1"
              }`}
            >
              {/* Selection Halo */}
              {isSelected && (
                <div className="absolute -top-3 w-3 h-3 rounded-full bg-brand-coral animate-bounce" />
              )}

              {/* Glass Test Tube Container */}
              <div className="relative w-12 sm:w-16 h-40 sm:h-52 rounded-b-3xl rounded-t-lg border-2 border-white/80 dark:border-purple-500/40 bg-white/20 dark:bg-purple-950/20 backdrop-blur-sm shadow-md overflow-hidden flex flex-col-reverse p-1 gap-1">
                {/* 4 slots max */}
                {tube.map((colorKey, slotIdx) => {
                  const colorInfo = COLOR_MAP[colorKey] || { bg: "#7856E8", name: "Color" };
                  return (
                    <div
                      key={slotIdx}
                      style={{ backgroundColor: colorInfo.bg }}
                      className="w-full h-8 sm:h-11 rounded-xl shadow-inner transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Subtle liquid surface highlight */}
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-white/30 rounded-t-xl" />
                    </div>
                  );
                })}
              </div>

              {/* Wooden Tube Stand Base */}
              <div className="w-14 sm:w-18 h-3 rounded-full bg-amber-100/80 dark:bg-purple-900/40 border border-amber-200 dark:border-purple-800/50 mt-1 shadow-sm" />
            </div>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="text-center">
        <span className="text-[11px] font-semibold text-brand-text-muted dark:text-gray-400 bg-white/70 dark:bg-[#121124]/70 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-100/60 dark:border-purple-900/40">
          💡 Tap a tube to select, then tap another tube to pour matching liquid
        </span>
      </div>

      {/* Level Complete Modal */}
      {isWon && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1B33] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-purple-100 dark:border-purple-800/50 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-brand-purple dark:text-purple-300 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-xl text-brand-text-dark dark:text-white mt-3">
              Level {levelIndex + 1} Cleared!
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-1">
              Perfect sort in {movesCount} moves!
            </p>

            <button
              onClick={handleNextLevel}
              className="mt-5 w-full py-2.5 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-transform active:scale-95"
            >
              <span>Next Level</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
