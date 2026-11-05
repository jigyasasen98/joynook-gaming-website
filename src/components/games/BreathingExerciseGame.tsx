"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

type BreathPhase = "Inhale" | "Hold" | "Exhale" | "Rest";

interface BreathingPattern {
  name: string;
  phases: { phase: BreathPhase; duration: number }[];
}

const PATTERNS: Record<string, BreathingPattern> = {
  box: {
    name: "Box Breathing (4-4-4-4)",
    phases: [
      { phase: "Inhale", duration: 4 },
      { phase: "Hold", duration: 4 },
      { phase: "Exhale", duration: 4 },
      { phase: "Rest", duration: 4 },
    ],
  },
  relax: {
    name: "4-7-8 Relaxation",
    phases: [
      { phase: "Inhale", duration: 4 },
      { phase: "Hold", duration: 7 },
      { phase: "Exhale", duration: 8 },
    ],
  },
  calm: {
    name: "Deep Calm (4-6)",
    phases: [
      { phase: "Inhale", duration: 4 },
      { phase: "Exhale", duration: 6 },
    ],
  },
};

export function BreathingExerciseGame() {
  const [selectedPatternKey, setSelectedPatternKey] = useState<"box" | "relax" | "calm">("box");
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const pattern = PATTERNS[selectedPatternKey];
  const currentPhase = pattern.phases[currentPhaseIndex];

  // Reset phase when pattern changes
  useEffect(() => {
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(pattern.phases[0].duration);
    setCycleCount(0);
    setIsActive(false);
  }, [selectedPatternKey, pattern.phases]);

  // Main breathing timer tick
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Advance to next phase
          const nextIdx = (currentPhaseIndex + 1) % pattern.phases.length;
          setCurrentPhaseIndex(nextIdx);

          if (nextIdx === 0) {
            setCycleCount((c) => c + 1);
          }

          if (soundEnabled) {
            const nextPhaseName = pattern.phases[nextIdx].phase;
            const pitch = nextPhaseName === "Inhale" ? 528 : nextPhaseName === "Exhale" ? 396 : 432;
            sounds.zenChime(pitch);
          }

          return pattern.phases[nextIdx].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPhaseIndex, pattern.phases, soundEnabled]);

  const toggleActive = () => {
    if (!isActive && soundEnabled) {
      sounds.zenChime(528);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    sounds.uiClick();
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(pattern.phases[0].duration);
    setCycleCount(0);
  };

  // Calculate circle expansion scale based on phase
  let scale = 1.0;
  if (currentPhase.phase === "Inhale") {
    scale = 1.6;
  } else if (currentPhase.phase === "Hold") {
    scale = 1.6;
  } else if (currentPhase.phase === "Exhale") {
    scale = 1.0;
  } else {
    scale = 1.0;
  }

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-[#16152B] via-[#100F21] to-[#1C1B33] rounded-3xl border border-purple-900/50 flex flex-col justify-between p-4 sm:p-6 shadow-inner overflow-hidden select-none text-white">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          {/* Pattern selector */}
          <div className="p-1 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setSelectedPatternKey("box")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedPatternKey === "box"
                  ? "bg-brand-purple text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Box (4-4-4-4)
            </button>
            <button
              onClick={() => setSelectedPatternKey("relax")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedPatternKey === "relax"
                  ? "bg-brand-purple text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              4-7-8
            </button>
            <button
              onClick={() => setSelectedPatternKey("calm")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedPatternKey === "calm"
                  ? "bg-brand-purple text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Calm (4-6)
            </button>
          </div>

          {/* Sound cue toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-xl border border-purple-800/40 ${
              soundEnabled ? "bg-purple-900/80 text-white" : "bg-purple-950/60 text-gray-500"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Breath Cycles count */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-950/80 border border-purple-800/40 text-xs font-bold text-gray-300">
          <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
          <span>Cycles: {cycleCount}</span>
        </div>
      </div>

      {/* Main Breathing Center Circle */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-2">
        {/* Glowing pulsing aura rings */}
        <div
          style={{
            transform: `scale(${scale})`,
            transition: `transform ${currentPhase.duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
          className="relative w-44 sm:w-56 h-44 sm:h-56 rounded-full flex items-center justify-center"
        >
          {/* Outermost soft blur glow */}
          <div className="absolute inset-0 rounded-full bg-brand-purple/20 blur-xl animate-pulse-slow" />

          {/* Middle translucent ring */}
          <div className="absolute inset-3 rounded-full border-2 border-brand-purple/40 bg-gradient-to-tr from-brand-purple/30 via-sky-400/20 to-brand-coral/20 backdrop-blur-md shadow-glow" />

          {/* Inner core */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
            <span className="text-xl sm:text-2xl font-extrabold tracking-wide uppercase text-white drop-shadow">
              {isActive ? currentPhase.phase : "Ready"}
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-brand-yellow mt-1">
              {isActive ? `${phaseSecondsLeft}s` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-3 z-10">
        <button
          onClick={toggleActive}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-extrabold text-sm shadow-lg shadow-brand-purple/30 active:scale-95 transition-all"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Breathing</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-2xl bg-purple-950/80 border border-purple-800/40 text-gray-300 hover:text-white active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
