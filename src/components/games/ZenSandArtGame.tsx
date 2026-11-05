"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

interface Stone {
  x: number;
  y: number;
  radius: number;
  color: string;
}

const SAND_THEMES = [
  { name: "Golden Sand", base: "#EADBBD", groove: "#C9BA9B", shadow: "#BAAC8C" },
  { name: "Kyoto Quartz", base: "#EFECE6", groove: "#D2CDC5", shadow: "#C5C0B7" },
  { name: "Volcanic Ash", base: "#42404D", groove: "#31303B", shadow: "#25242E" },
];

export function ZenSandArtGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [themeIdx, setThemeIdx] = useState(0);
  const [tool, setTool] = useState<"rake3" | "rake5" | "ripple" | "stone">("rake3");
  const [stones, setStones] = useState<Stone[]>([]);

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const drawSandBase = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const t = SAND_THEMES[themeIdx];
    ctx.fillStyle = t.base;
    ctx.fillRect(0, 0, w, h);

    // Subtle natural sand grain texture noise
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 12;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      drawSandBase(ctx, rect.width, rect.height);
      drawAllStones(ctx);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [themeIdx]);

  const drawAllStones = (ctx: CanvasRenderingContext2D) => {
    stones.forEach((st) => {
      // Stone shadow
      ctx.beginPath();
      ctx.ellipse(st.x + 3, st.y + 5, st.radius * 1.1, st.radius * 0.9, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fill();

      // Stone body
      ctx.beginPath();
      ctx.ellipse(st.x, st.y, st.radius, st.radius * 0.8, -0.1, 0, Math.PI * 2);
      ctx.fillStyle = st.color;
      ctx.fill();

      // Stone highlight
      ctx.beginPath();
      ctx.ellipse(st.x - st.radius * 0.3, st.y - st.radius * 0.2, st.radius * 0.4, st.radius * 0.25, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fill();
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === "stone") {
      sounds.bubblePop(0.7);
      const newStone: Stone = {
        x,
        y,
        radius: Math.random() * 8 + 18,
        color: Math.random() < 0.5 ? "#56535F" : "#7A7885",
      };
      setStones((prev) => [...prev, newStone]);

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw ripple around stone
        const t = SAND_THEMES[themeIdx];
        ctx.strokeStyle = t.groove;
        ctx.lineWidth = 3;
        for (let r = newStone.radius + 10; r <= newStone.radius + 35; r += 12) {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        drawAllStones(ctx);
      }
      return;
    }

    if (tool === "ripple") {
      sounds.bubblePop(1.1);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const t = SAND_THEMES[themeIdx];
        ctx.strokeStyle = t.groove;
        ctx.lineWidth = 3;
        for (let r = 15; r <= 65; r += 12) {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      return;
    }

    isDrawingRef.current = true;
    lastPointRef.current = { x, y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const t = SAND_THEMES[themeIdx];
    const prongCount = tool === "rake5" ? 5 : 3;
    const spacing = 10;

    // Normal vector perpendicular to move direction
    const dx = currentX - lastPointRef.current.x;
    const dy = currentY - lastPointRef.current.y;
    const len = Math.hypot(dx, dy);
    if (len < 2) return;

    const nx = -dy / len;
    const ny = dx / len;

    ctx.strokeStyle = t.groove;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    // Draw lines for each tine of the rake
    for (let i = 0; i < prongCount; i++) {
      const offset = (i - (prongCount - 1) / 2) * spacing;
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x + nx * offset, lastPointRef.current.y + ny * offset);
      ctx.lineTo(currentX + nx * offset, currentY + ny * offset);
      ctx.stroke();
    }

    lastPointRef.current = { x: currentX, y: currentY };
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const smoothGarden = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    sounds.uiClick();
    setStones([]);
    const rect = canvas.getBoundingClientRect();
    drawSandBase(ctx, rect.width, rect.height);
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#EADBBD] rounded-3xl border border-amber-200 dark:border-purple-900/50 flex flex-col justify-between p-4 shadow-inner overflow-hidden select-none">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          {/* Tool selector */}
          <div className="p-1 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md border border-amber-200 dark:border-gray-700 flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-200">
            <button
              onClick={() => setTool("rake3")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                tool === "rake3" ? "bg-amber-800 text-white shadow-sm" : "hover:text-amber-900"
              }`}
            >
              3-Prong
            </button>
            <button
              onClick={() => setTool("rake5")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                tool === "rake5" ? "bg-amber-800 text-white shadow-sm" : "hover:text-amber-900"
              }`}
            >
              5-Prong
            </button>
            <button
              onClick={() => setTool("ripple")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                tool === "ripple" ? "bg-amber-800 text-white shadow-sm" : "hover:text-amber-900"
              }`}
            >
              Ripples
            </button>
            <button
              onClick={() => setTool("stone")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                tool === "stone" ? "bg-amber-800 text-white shadow-sm" : "hover:text-amber-900"
              }`}
            >
              Pebble 🪨
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sand Theme */}
          <div className="p-1 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md border border-amber-200 dark:border-gray-700 flex items-center gap-1">
            {SAND_THEMES.map((theme, idx) => (
              <button
                key={theme.name}
                onClick={() => setThemeIdx(idx)}
                style={{ backgroundColor: theme.base }}
                title={theme.name}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  themeIdx === idx ? "scale-110 border-amber-800" : "border-transparent"
                }`}
              />
            ))}
          </div>

          {/* Smooth Sand (Reset) */}
          <button
            onClick={smoothGarden}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/90 dark:bg-black/60 text-gray-800 dark:text-white shadow-sm hover:text-amber-800 border border-amber-200 dark:border-gray-700 active:scale-95 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Smooth Sand</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing game-viewport"
      />

      {/* Bottom Hint */}
      <div className="text-center z-10 pointer-events-none">
        <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-amber-200 dark:border-gray-700">
          💡 Drag to carve meditative grooves in the sand or place soothing river pebbles
        </span>
      </div>
    </div>
  );
}
