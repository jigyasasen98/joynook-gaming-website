"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RotateCcw, Undo2, Palette } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

const PALETTE = [
  "#7856E8", // purple
  "#FF7777", // coral
  "#FFD66B", // yellow
  "#4ECCA3", // mint
  "#5BC0EB", // sky
  "#FF9E9E", // pink
  "#FFFFFF", // white
  "#202039", // dark navy
];

export function MandalaCreatorGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [symmetry, setSymmetry] = useState<number>(8);
  const [brushColor, setBrushColor] = useState<string>("#7856E8");
  const [brushSize, setBrushSize] = useState<number>(3);
  const [isRainbow, setIsRainbow] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hueRef = useRef(0);

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

      // Fill rich dark or light backdrop
      ctx.fillStyle = "#16152B";
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
    setHistory((prev) => [...prev.slice(-10), data]); // save up to 10 steps
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

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const startX = lastPointRef.current.x - centerX;
    const startY = lastPointRef.current.y - centerY;
    const endX = currentX - centerX;
    const endY = currentY - centerY;

    let strokeColor = brushColor;
    if (isRainbow) {
      hueRef.current = (hueRef.current + 2) % 360;
      strokeColor = `hsl(${hueRef.current}, 85%, 65%)`;
    }

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = strokeColor;

    // Draw mirrored across symmetry segments
    const angleStep = (Math.PI * 2) / symmetry;

    for (let i = 0; i < symmetry; i++) {
      ctx.save();
      ctx.rotate(angleStep * i);

      // Direct line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Mirrored line
      ctx.beginPath();
      ctx.moveTo(-startX, startY);
      ctx.lineTo(-endX, endY);
      ctx.stroke();

      ctx.restore();
    }

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
    prevHistory.pop(); // remove current
    const previousState = prevHistory[prevHistory.length - 1];

    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
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
    ctx.fillStyle = "#16152B";
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveState();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sounds.matchSuccess();
    const link = document.createElement("a");
    link.download = `joynook-mandala-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#16152B] rounded-3xl border border-purple-900/50 flex flex-col justify-between p-4 shadow-inner overflow-hidden select-none">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          {/* Symmetry selector */}
          <div className="p-1 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center gap-1 text-xs font-bold text-white">
            {[4, 6, 8, 12, 16].map((num) => (
              <button
                key={num}
                onClick={() => setSymmetry(num)}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  symmetry === num ? "bg-brand-purple text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                {num}x
              </button>
            ))}
          </div>

          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            className={`p-1.5 rounded-xl border border-purple-800/40 text-white ${
              history.length > 1 ? "bg-purple-950/80 hover:bg-purple-900" : "opacity-40 cursor-not-allowed"
            }`}
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            className="p-1.5 rounded-xl bg-purple-950/80 border border-purple-800/40 text-white hover:bg-purple-900"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-purple hover:bg-brand-purple/90 text-white shadow-md active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save PNG</span>
        </button>
      </div>

      {/* Main Mandala Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-crosshair game-viewport"
      />

      {/* Bottom Swatches & Thickness Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 z-10 bg-purple-950/80 backdrop-blur-md p-2 rounded-2xl border border-purple-800/40 max-w-lg mx-auto w-full">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => {
                setBrushColor(c);
                setIsRainbow(false);
              }}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                brushColor === c && !isRainbow ? "scale-125 border-white" : "border-transparent hover:scale-110"
              }`}
            />
          ))}

          {/* Rainbow Button */}
          <button
            onClick={() => setIsRainbow(!isRainbow)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
              isRainbow
                ? "bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white border-white scale-105"
                : "bg-purple-900/60 text-gray-300 border-purple-700 hover:text-white"
            }`}
          >
            Rainbow 🌈
          </button>
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
          <span>Size:</span>
          <input
            type="range"
            min={1}
            max={10}
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
            className="w-20 accent-brand-purple cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
