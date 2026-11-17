"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { sounds } from "@/lib/soundEffects";
import { triggerHaptic } from "@/lib/haptics";
import { Sparkles, Trophy, RotateCcw } from "lucide-react";

interface Bubble {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
  popped: boolean;
  isGolden?: boolean;
}

const BUBBLE_COLORS = [
  "rgba(120, 86, 232, 0.45)", // purple
  "rgba(255, 119, 119, 0.45)", // coral
  "rgba(255, 214, 107, 0.45)", // yellow
  "rgba(78, 204, 163, 0.45)",  // mint
  "rgba(91, 192, 235, 0.45)",  // sky
];

export function BubblePopGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [score, setScore] = useState(0);
  const [popStreak, setPopStreak] = useState(0);
  const [mode, setMode] = useState<"zen" | "timed">("zen");
  const [timeLeft, setTimeLeft] = useState(45);
  const [isGameOver, setIsGameOver] = useState(false);
  const bubblesRef = useRef<Bubble[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const streakTimerRef = useRef<NodeJS.Timeout | null>(null);

  const spawnBubble = useCallback((width: number, height: number): Bubble => {
    const isGolden = Math.random() < 0.08;
    return {
      id: Math.random(),
      x: Math.random() * (width - 60) + 30,
      y: height + Math.random() * 40 + 20,
      radius: Math.random() * 25 + 24,
      color: isGolden
        ? "rgba(255, 215, 0, 0.7)"
        : BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: -(Math.random() * 1.5 + 1.2),
      popped: false,
      isGolden,
    };
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setPopStreak(0);
    setTimeLeft(45);
    setIsGameOver(false);
    if (canvasRef.current) {
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      bubblesRef.current = Array.from({ length: 15 }, () => spawnBubble(width, height));
    }
  }, [spawnBubble]);

  // Timed mode countdown
  useEffect(() => {
    if (mode === "timed" && !isGameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsGameOver(true);
            confetti({ particleCount: 60, spread: 70 });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, isGameOver, timeLeft]);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    // Initial bubbles
    const width = canvas.getBoundingClientRect().width;
    const height = canvas.getBoundingClientRect().height;
    if (bubblesRef.current.length === 0) {
      bubblesRef.current = Array.from({ length: 16 }, () => spawnBubble(width, height));
    }

    const render = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, w, h);

      // Update & Draw Bubbles
      const bubbles = bubblesRef.current;
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        if (b.popped) continue;

        b.x += b.speedX;
        b.y += b.speedY;

        // Bounce horizontally off walls
        if (b.x - b.radius < 0 || b.x + b.radius > w) {
          b.speedX = -b.speedX;
        }

        // Respawn if floated off top
        if (b.y + b.radius < -10) {
          bubbles[i] = spawnBubble(w, h);
          continue;
        }

        // Draw bubble body
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        // Shimmer stroke
        ctx.lineWidth = 2;
        ctx.strokeStyle = b.isGolden ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.6)";
        ctx.stroke();

        // Specular highlight gleam
        ctx.beginPath();
        ctx.arc(
          b.x - b.radius * 0.35,
          b.y - b.radius * 0.35,
          b.radius * 0.22,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [spawnBubble]);

  const handlePop = (clientX: number, clientY: number) => {
    if (isGameOver && mode === "timed") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    let poppedAny = false;

    bubblesRef.current.forEach((b, idx) => {
      if (b.popped) return;
      const dist = Math.hypot(b.x - clickX, b.y - clickY);
      if (dist <= b.radius + 10) {
        b.popped = true;
        poppedAny = true;

        // Procedural audio pop & tactile haptics
        const pitch = 0.8 + Math.min(popStreak * 0.05, 1.2);
        sounds.bubblePop(pitch);
        triggerHaptic(b.isGolden ? "medium" : "light");

        // Score calc
        const points = b.isGolden ? 50 : 10;
        setScore((prev) => prev + points * (1 + Math.floor(popStreak / 5)));

        // Pop streak
        setPopStreak((prev) => {
          const next = prev + 1;
          if (next % 10 === 0) {
            confetti({
              particleCount: 25,
              origin: { x: clientX / window.innerWidth, y: clientY / window.innerHeight },
            });
          }
          return next;
        });

        // Reset streak after inactivity
        if (streakTimerRef.current) clearTimeout(streakTimerRef.current);
        streakTimerRef.current = setTimeout(() => {
          setPopStreak(0);
        }, 1800);

        // Respawn bubble after brief delay
        setTimeout(() => {
          if (canvasRef.current) {
            const w = canvasRef.current.getBoundingClientRect().width;
            const h = canvasRef.current.getBoundingClientRect().height;
            bubblesRef.current[idx] = spawnBubble(w, h);
          }
        }, 400);
      }
    });

    if (!poppedAny) {
      sounds.uiClick();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    handlePop(e.clientX, e.clientY);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-purple-50/70 via-white to-purple-100/40 dark:from-[#18172E] dark:via-[#131226] dark:to-[#1C1B33] rounded-3xl border border-purple-100 dark:border-purple-900/50 overflow-hidden flex flex-col justify-between p-4 shadow-inner"
    >
      {/* Top HUD */}
      <div className="z-10 flex items-center justify-between gap-3">
        {/* Score & Streak */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-brand-yellow" />
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Score:</span>
            <span className="text-sm font-extrabold text-brand-purple dark:text-purple-300">
              {score}
            </span>
          </div>

          {popStreak > 2 && (
            <div className="px-3 py-1 rounded-full bg-brand-coral/10 border border-brand-coral/30 text-brand-coral text-xs font-extrabold flex items-center gap-1 animate-bounceGentle">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{popStreak}x Streak!</span>
            </div>
          )}
        </div>

        {/* Mode Selector & Timer */}
        <div className="flex items-center gap-2">
          {mode === "timed" && (
            <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 text-xs font-extrabold text-brand-text-dark dark:text-white">
              ⏱️ {timeLeft}s
            </div>
          )}

          <div className="p-1 rounded-xl bg-purple-100/70 dark:bg-purple-950/60 flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => {
                setMode("zen");
                resetGame();
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mode === "zen"
                  ? "bg-white dark:bg-[#1E1D36] text-brand-purple dark:text-purple-300 shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Zen Mode
            </button>
            <button
              onClick={() => {
                setMode("timed");
                resetGame();
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                mode === "timed"
                  ? "bg-white dark:bg-[#1E1D36] text-brand-purple dark:text-purple-300 shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Timed Rush
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Canvas Viewport */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="absolute inset-0 w-full h-full cursor-pointer game-viewport"
      />

      {/* Bottom Hint */}
      <div className="z-10 text-center pointer-events-none">
        <span className="text-[11px] font-semibold text-brand-text-muted dark:text-gray-400 bg-white/70 dark:bg-[#121124]/70 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-100/60 dark:border-purple-900/40">
          💡 Tap or drag cursor over bubbles to pop them
        </span>
      </div>

      {/* Game Over Modal (Timed Mode) */}
      {isGameOver && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1B33] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-purple-100 dark:border-purple-800/50 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-4xl">🎉</span>
            <h3 className="font-extrabold text-xl text-brand-text-dark dark:text-white mt-2">
              Time&apos;s Up!
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-1">
              You popped like a champion!
            </p>
            <div className="my-4 py-3 bg-purple-50 dark:bg-purple-950/50 rounded-2xl">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Final Score
              </span>
              <p className="text-3xl font-extrabold text-brand-purple dark:text-purple-300">
                {score}
              </p>
            </div>
            <button
              onClick={resetGame}
              className="w-full py-2.5 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-transform active:scale-95"
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
