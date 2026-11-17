"use client";

import { useState, useEffect } from "react";
import { sounds } from "@/lib/soundEffects";
import { triggerHaptic } from "@/lib/haptics";
import { Sparkles } from "lucide-react";

interface TapPad {
  id: "keyboard" | "wood" | "water" | "metal" | "plastic";
  title: string;
  icon: string;
  description: string;
  color: string;
  accent: string;
  keyLabel: string;
}

const PADS: TapPad[] = [
  {
    id: "keyboard",
    title: "Mechanical Switch",
    icon: "⌨️",
    description: "Crisp mechanical clack",
    color: "from-purple-500/20 to-indigo-500/30",
    accent: "border-purple-300 dark:border-purple-700",
    keyLabel: "A",
  },
  {
    id: "wood",
    title: "Polished Wood",
    icon: "🪵",
    description: "Warm, resonant wooden block",
    color: "from-amber-500/20 to-orange-500/30",
    accent: "border-amber-300 dark:border-amber-700",
    keyLabel: "S",
  },
  {
    id: "water",
    title: "Water Droplet",
    icon: "💧",
    description: "Soothing liquid plop",
    color: "from-sky-500/20 to-blue-500/30",
    accent: "border-sky-300 dark:border-sky-700",
    keyLabel: "D",
  },
  {
    id: "metal",
    title: "Singing Bell",
    icon: "🔔",
    description: "Crystal resonant chime",
    color: "from-yellow-500/20 to-amber-500/30",
    accent: "border-yellow-300 dark:border-yellow-700",
    keyLabel: "F",
  },
  {
    id: "plastic",
    title: "Pop-It Button",
    icon: "🔘",
    description: "Satisfying plastic snap",
    color: "from-coral-500/20 to-rose-500/30",
    accent: "border-coral-300 dark:border-coral-700",
    keyLabel: "Space",
  },
];

export function AsmrTapGame() {
  const [activePad, setActivePad] = useState<string | null>(null);
  const [tapCounts, setTapCounts] = useState<Record<string, number>>({
    keyboard: 0,
    wood: 0,
    water: 0,
    metal: 0,
    plastic: 0,
  });

  const triggerTap = (type: TapPad["id"]) => {
    setActivePad(type);
    if (type === "plastic") {
      sounds.bubbleWrapSnap();
      triggerHaptic("medium");
    } else {
      sounds.asmrTap(type);
      triggerHaptic(type === "metal" ? "heavy" : "light");
    }

    setTapCounts((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));

    setTimeout(() => {
      setActivePad((curr) => (curr === type ? null : curr));
    }, 150);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      if (key === "a") triggerTap("keyboard");
      else if (key === "s") triggerTap("wood");
      else if (key === "d") triggerTap("water");
      else if (key === "f") triggerTap("metal");
      else if (key === " " || key === "spacebar") {
        e.preventDefault();
        triggerTap("plastic");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const totalTaps = Object.values(tapCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-purple-50/60 via-white to-purple-100/30 dark:from-[#18172E] dark:via-[#131226] dark:to-[#1C1B33] rounded-3xl border border-purple-100 dark:border-purple-900/50 flex flex-col justify-between p-4 sm:p-6 shadow-inner overflow-hidden select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-purple" />
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Total Taps:</span>
          <span className="text-sm font-extrabold text-brand-purple dark:text-purple-300">
            {totalTaps}
          </span>
        </div>

        <span className="text-xs font-semibold text-brand-text-muted dark:text-gray-400 hidden sm:inline">
          🎧 Best with headphones
        </span>
      </div>

      {/* Main Pads Playground */}
      <div className="flex-1 flex items-center justify-center py-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full max-w-3xl">
          {PADS.map((pad) => {
            const isActive = activePad === pad.id;
            return (
              <button
                key={pad.id}
                onClick={() => triggerTap(pad.id)}
                className={`relative group flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl border-2 transition-all duration-150 shadow-sm ${
                  pad.accent
                } bg-gradient-to-br ${pad.color} backdrop-blur-sm ${
                  isActive
                    ? "scale-90 shadow-inner bg-opacity-70"
                    : "hover:scale-105 active:scale-95 hover:shadow-md"
                }`}
              >
                {/* Keyboard Badge */}
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/80 dark:bg-black/40 text-[10px] font-mono font-bold text-gray-500 dark:text-gray-300">
                  {pad.keyLabel}
                </span>

                {/* Icon */}
                <span className="text-4xl sm:text-5xl mb-2 filter drop-shadow transform transition-transform group-hover:scale-110">
                  {pad.icon}
                </span>

                {/* Title */}
                <span className="font-bold text-xs sm:text-sm text-brand-text-dark dark:text-white text-center">
                  {pad.title}
                </span>

                {/* Tap count */}
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mt-1">
                  {tapCounts[pad.id]} taps
                </span>

                {/* Ripple glow on tap */}
                {isActive && (
                  <span className="absolute inset-0 rounded-3xl border-4 border-brand-purple/40 animate-ping pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-center z-10">
        <span className="text-[11px] font-semibold text-brand-text-muted dark:text-gray-400 bg-white/70 dark:bg-[#121124]/70 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-100/60 dark:border-purple-900/40">
          💡 Tap pads or press keyboard keys (A, S, D, F, Space) for instant ASMR bliss
        </span>
      </div>
    </div>
  );
}
