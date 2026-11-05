"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RotateCcw, Undo2, Eraser, Pen, Sparkles } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

const DOODLE_COLORS = [
  "#202039", // classic dark ink
  "#7856E8", // purple
  "#FF7777", // coral
  "#FFD66B", // yellow
  "#4ECCA3", // mint
  "#5BC0EB", // sky
  "#FF9E9E", // pink
  "#FFFFFF", // white
];

export function ZenDoodleGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [brushType, setBrushType] = useState<"pen" | "neon" | "watercolor" | "eraser">("pen");
  const [color, setColor] = useState("#7856E8");
  const [brushSize, setBrushSize] = useState(4);
  const [history, setHistory] = useState<ImageData[]>([]);

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

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

      // Clean off-white paper background
      ctx.fillStyle = "#FAF9FF";
      ctx.fillRect(0, 0, rect.width, rect.height);
      saveState();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), data]);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    isDrawingRef.current = true;
    lastPointRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
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

    ctx.save();

    if (brushType === "eraser") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "#FAF9FF";
      ctx.lineWidth = brushSize * 4;
      ctx.shadowBlur = 0;
    } else if (brushType === "neon") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
    } else if (brushType === "watercolor") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = brushSize * 3;
      ctx.shadowBlur = 0;
    } else {
      // Classic smooth pen
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.shadowBlur = 0;
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    ctx.restore();

    lastPointRef.current = { x: currentX, y: currentY };
  };

  const handlePointerUp = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      saveState();
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    sounds.uiClick();
    const prevHistory = [...history];
    prevHistory.pop();
    const prevState = prevHistory[prevHistory.length - 1];
    if (prevState) {
      ctx.putImageData(prevState, 0, 0);
      setHistory(prevHistory);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    sounds.uiClick();
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#FAF9FF";
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveState();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sounds.matchSuccess();
    const link = document.createElement("a");
    link.download = `joynook-doodle-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#FAF9FF] rounded-3xl border border-purple-100 dark:border-purple-900/50 flex flex-col justify-between p-4 shadow-inner overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          {/* Brush types */}
          <div className="p-1 rounded-xl bg-white/90 shadow-sm border border-purple-100 flex items-center gap-1 text-xs font-bold text-gray-700">
            <button
              onClick={() => setBrushType("pen")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                brushType === "pen" ? "bg-brand-purple text-white shadow-sm" : "hover:text-purple-600"
              }`}
            >
              <Pen className="w-3 h-3" />
              <span>Pen</span>
            </button>
            <button
              onClick={() => setBrushType("neon")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                brushType === "neon" ? "bg-brand-purple text-white shadow-sm" : "hover:text-purple-600"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Neon</span>
            </button>
            <button
              onClick={() => setBrushType("watercolor")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                brushType === "watercolor" ? "bg-brand-purple text-white shadow-sm" : "hover:text-purple-600"
              }`}
            >
              Pastel
            </button>
            <button
              onClick={() => setBrushType("eraser")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                brushType === "eraser" ? "bg-brand-purple text-white shadow-sm" : "hover:text-purple-600"
              }`}
            >
              <Eraser className="w-3 h-3" />
              <span>Eraser</span>
            </button>
          </div>

          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            className={`p-1.5 rounded-xl border border-purple-100 bg-white shadow-sm text-gray-700 ${
              history.length > 1 ? "hover:text-brand-purple" : "opacity-40 cursor-not-allowed"
            }`}
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            className="p-1.5 rounded-xl bg-white shadow-sm border border-purple-100 text-gray-700 hover:text-brand-purple"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Download */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-purple hover:bg-brand-purple/90 text-white shadow-md active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save PNG</span>
        </button>
      </div>

      {/* Main Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-crosshair game-viewport"
      />

      {/* Bottom Swatches & Size Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 z-10 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-purple-100 shadow-sm max-w-lg mx-auto w-full">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {DOODLE_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                if (brushType === "eraser") setBrushType("pen");
              }}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                color === c && brushType !== "eraser" ? "scale-125 border-brand-purple shadow-sm" : "border-transparent hover:scale-110"
              }`}
            />
          ))}
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2 text-xs text-gray-600 font-bold">
          <span>Width:</span>
          <input
            type="range"
            min={1}
            max={18}
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
            className="w-20 accent-brand-purple cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
