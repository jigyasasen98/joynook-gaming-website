"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { Heart, Trophy, RotateCcw, Clock } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

interface Balloon {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  color: string;
  type: "normal" | "gold" | "spiky";
  wobbleOffset: number;
  wobbleSpeed: number;
  popped: boolean;
}

const BALLOON_COLORS = ["#7856E8", "#FF7777", "#FFD66B", "#4ECCA3", "#5BC0EB", "#FF9E9E"];

export function BalloonPopGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const balloonsRef = useRef<Balloon[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);

  // Load high score from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("joynook_balloon_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  const spawnBalloon = useCallback((width: number, height: number): Balloon => {
    const rand = Math.random();
    let type: "normal" | "gold" | "spiky" = "normal";
    let color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];

    if (rand < 0.1) {
      type = "gold";
      color = "#FFD700";
    } else if (rand < 0.22) {
      type = "spiky";
      color = "#2D2B42";
    }

    return {
      id: Math.random(),
      x: Math.random() * (width - 80) + 40,
      y: height + 60,
      radius: type === "gold" ? 28 : Math.random() * 8 + 32,
      speed: Math.random() * 1.5 + 2.0,
      color,
      type,
      wobbleOffset: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.02,
      popped: false,
    };
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setTimeLeft(60);
    setIsGameOver(false);
    balloonsRef.current = [];
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isGameOver || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver, timeLeft]);

  // Check game over
  useEffect(() => {
    if (lives <= 0 && !isGameOver) {
      setIsGameOver(true);
    }
  }, [lives, isGameOver]);

  // Save high score
  useEffect(() => {
    if (isGameOver) {
      if (score > highScore) {
        setHighScore(score);
        if (typeof window !== "undefined") {
          localStorage.setItem("joynook_balloon_highscore", score.toString());
        }
        confetti({ particleCount: 80, spread: 80 });
      }
    }
  }, [isGameOver, score, highScore]);

  // Animation Loop
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

    const render = (time: number) => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, w, h);

      if (!isGameOver) {
        // Spawn balloons
        if (time - lastSpawnRef.current > 700 && balloonsRef.current.length < 10) {
          balloonsRef.current.push(spawnBalloon(w, h));
          lastSpawnRef.current = time;
        }
      }

      // Update & Render
      for (let i = balloonsRef.current.length - 1; i >= 0; i--) {
        const b = balloonsRef.current[i];
        if (b.popped) {
          balloonsRef.current.splice(i, 1);
          continue;
        }

        b.y -= b.speed;
        b.wobbleOffset += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.wobbleOffset) * 20;

        // If escaped top edge without popping
        if (b.y + b.radius < -20) {
          if (b.type === "normal" && !isGameOver) {
            setLives((l) => Math.max(0, l - 1));
          }
          balloonsRef.current.splice(i, 1);
          continue;
        }

        // Draw balloon
        ctx.save();
        ctx.translate(currentX, b.y);

        // String
        ctx.beginPath();
        ctx.moveTo(0, b.radius);
        ctx.bezierCurveTo(
          Math.sin(b.wobbleOffset) * 8,
          b.radius + 15,
          -Math.sin(b.wobbleOffset) * 8,
          b.radius + 25,
          0,
          b.radius + 35
        );
        ctx.strokeStyle = "rgba(100, 100, 120, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Balloon body
        ctx.beginPath();
        ctx.ellipse(0, 0, b.radius, b.radius * 1.25, 0, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        // Balloon bottom knot
        ctx.beginPath();
        ctx.moveTo(-4, b.radius * 1.22);
        ctx.lineTo(4, b.radius * 1.22);
        ctx.lineTo(0, b.radius * 1.22 + 6);
        ctx.closePath();
        ctx.fillStyle = b.color;
        ctx.fill();

        // Highlighting gleam
        ctx.beginPath();
        ctx.ellipse(-b.radius * 0.35, -b.radius * 0.4, b.radius * 0.2, b.radius * 0.4, -0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fill();

        // Special icon for spiky or gold
        if (b.type === "spiky") {
          ctx.fillStyle = "#FF7777";
          ctx.font = "bold 16px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("⚠️", 0, 6);
        } else if (b.type === "gold") {
          ctx.fillStyle = "#FFF";
          ctx.font = "bold 16px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("⭐", 0, 6);
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isGameOver, spawnBalloon]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isGameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (let i = balloonsRef.current.length - 1; i >= 0; i--) {
      const b = balloonsRef.current[i];
      if (b.popped) continue;

      const currentX = b.x + Math.sin(b.wobbleOffset) * 20;
      const dist = Math.hypot(currentX - clickX, b.y - clickY);

      if (dist <= b.radius * 1.2) {
        b.popped = true;
        sounds.balloonPop();

        if (b.type === "spiky") {
          // Penalty
          setLives((l) => Math.max(0, l - 1));
          setScore((s) => Math.max(0, s - 20));
        } else if (b.type === "gold") {
          setScore((s) => s + 50);
          confetti({
            particleCount: 20,
            origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
          });
        } else {
          setScore((s) => s + 10);
        }
        break;
      }
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-sky-50/60 via-purple-50/40 to-blue-100/30 dark:from-[#13172E] dark:via-[#16142A] dark:to-[#1B1A38] rounded-3xl border border-sky-100 dark:border-sky-900/40 flex flex-col justify-between p-4 shadow-inner overflow-hidden">
      {/* Top HUD */}
      <div className="z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Score */}
          <div className="px-3.5 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-brand-yellow" />
            <span className="text-sm font-extrabold text-brand-purple dark:text-purple-300">
              {score}
            </span>
          </div>

          {/* Lives */}
          <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-1">
            {[1, 2, 3].map((val) => (
              <Heart
                key={val}
                className={`w-4 h-4 ${
                  val <= lives ? "fill-brand-coral text-brand-coral" : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Timer & High Score */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-1.5 text-xs font-extrabold text-brand-text-dark dark:text-white">
            <Clock className="w-3.5 h-3.5 text-brand-sky" />
            <span>{timeLeft}s</span>
          </div>

          <div className="hidden sm:flex px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 text-xs font-bold text-gray-500 dark:text-gray-400">
            Best: {highScore}
          </div>
        </div>
      </div>

      {/* Interactive Balloon Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        className="absolute inset-0 w-full h-full cursor-crosshair game-viewport"
      />

      {/* Bottom Hint */}
      <div className="z-10 text-center pointer-events-none">
        <span className="text-[11px] font-semibold text-brand-text-muted dark:text-gray-400 bg-white/70 dark:bg-[#121124]/70 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-100/60 dark:border-purple-900/40">
          💡 Tap balloons before they escape! Golden ⭐ = bonus, Spiky ⚠️ = danger
        </span>
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1B33] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-purple-100 dark:border-purple-800/50 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-4xl">🎈</span>
            <h3 className="font-extrabold text-xl text-brand-text-dark dark:text-white mt-2">
              Game Over!
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-1">
              {score >= highScore && score > 0 ? "🎉 New High Score!" : "Good attempt!"}
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
