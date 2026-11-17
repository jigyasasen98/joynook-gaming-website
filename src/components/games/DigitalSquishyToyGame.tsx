"use client";

import { useEffect, useRef, useState } from "react";
import { sounds } from "@/lib/soundEffects";
import { triggerHaptic } from "@/lib/haptics";
import { Palette, RotateCcw } from "lucide-react";

const SQUISHY_COLORS = [
  { name: "Lavender", fill: "#B8A3F3", stroke: "#7856E8", shadow: "rgba(120, 86, 232, 0.3)" },
  { name: "Peach", fill: "#FFAA99", stroke: "#FF7777", shadow: "rgba(255, 119, 119, 0.3)" },
  { name: "Mint", fill: "#70DEB1", stroke: "#2BAE84", shadow: "rgba(78, 204, 163, 0.3)" },
  { name: "Lemon", fill: "#FFE082", stroke: "#F5BE38", shadow: "rgba(255, 214, 107, 0.3)" },
  { name: "Sky", fill: "#86CEEE", stroke: "#2FA4D3", shadow: "rgba(91, 192, 235, 0.3)" },
];

export function DigitalSquishyToyGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);

  // Soft body state: position, stretch/scale, velocity
  const stateRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    scaleX: 1,
    scaleY: 1,
    targetScaleX: 1,
    targetScaleY: 1,
    velScaleX: 0,
    velScaleY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    pointerX: 0,
    pointerY: 0,
    blinkTimer: 0,
    isBlinking: false,
  });

  const animFrameRef = useRef<number | null>(null);

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

      // Center Bloop
      stateRef.current.x = rect.width / 2;
      stateRef.current.y = rect.height / 2;
      stateRef.current.targetX = rect.width / 2;
      stateRef.current.targetY = rect.height / 2;
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const s = stateRef.current;
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, w, h);

      // Spring physics on scale (stiffness & damping)
      const k = 0.12; // stiffness
      const d = 0.82; // damping

      const forceX = (s.targetScaleX - s.scaleX) * k;
      s.velScaleX = (s.velScaleX + forceX) * d;
      s.scaleX += s.velScaleX;

      const forceY = (s.targetScaleY - s.scaleY) * k;
      s.velScaleY = (s.velScaleY + forceY) * d;
      s.scaleY += s.velScaleY;

      // Position follow drag or lerp back to center
      if (s.isDragging) {
        s.x += (s.targetX - s.x) * 0.3;
        s.y += (s.targetY - s.y) * 0.3;
      } else {
        s.x += (w / 2 - s.x) * 0.1;
        s.y += (h / 2 - s.y) * 0.1;
      }

      // Blinking logic
      s.blinkTimer++;
      if (s.blinkTimer > 180) {
        s.isBlinking = true;
        if (s.blinkTimer > 192) {
          s.isBlinking = false;
          s.blinkTimer = 0;
        }
      }

      // Draw soft shadow on ground
      const groundY = h / 2 + 100;
      const shadowW = 120 * s.scaleX;
      const shadowH = 24 / s.scaleY;
      ctx.beginPath();
      ctx.ellipse(w / 2, groundY, Math.max(10, shadowW), Math.max(4, shadowH), 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fill();

      // Draw Bloop Body
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.scale(s.scaleX, s.scaleY);

      const color = SQUISHY_COLORS[selectedColor];

      // Draw smooth deformed droplet/jelly shape
      ctx.beginPath();
      const r = 70;
      // 4 bezier points for natural soft body
      ctx.moveTo(0, -r * 1.05);
      ctx.bezierCurveTo(r * 1.15, -r * 0.9, r * 1.25, r * 0.6, 0, r * 1.05);
      ctx.bezierCurveTo(-r * 1.25, r * 0.6, -r * 1.15, -r * 0.9, 0, -r * 1.05);
      ctx.closePath();

      ctx.fillStyle = color.fill;
      ctx.fill();

      ctx.lineWidth = 4;
      ctx.strokeStyle = color.stroke;
      ctx.stroke();

      // Cute glossy highlight
      ctx.beginPath();
      ctx.ellipse(-r * 0.35, -r * 0.45, r * 0.3, r * 0.18, -0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fill();

      // Cheeks (blush)
      ctx.beginPath();
      ctx.arc(-35, 12, 10, 0, Math.PI * 2);
      ctx.arc(35, 12, 10, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 119, 119, 0.4)";
      ctx.fill();

      // Eyes with tracking
      const angle = Math.atan2(s.pointerY - (s.y + 0), s.pointerX - (s.x + 0));
      const lookDist = Math.min(4, Math.hypot(s.pointerX - s.x, s.pointerY - s.y) * 0.02);
      const pupilX = Math.cos(angle) * lookDist;
      const pupilY = Math.sin(angle) * lookDist;

      if (!s.isBlinking) {
        // Left Eye
        ctx.beginPath();
        ctx.arc(-22, -8, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#202039";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-22 + pupilX, -8 + pupilY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        // Right Eye
        ctx.beginPath();
        ctx.arc(22, -8, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#202039";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(22 + pupilX, -8 + pupilY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      } else {
        // Blinking lines ^ ^
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#202039";
        ctx.beginPath();
        ctx.moveTo(-28, -8);
        ctx.quadraticCurveTo(-22, -14, -16, -8);
        ctx.moveTo(16, -8);
        ctx.quadraticCurveTo(22, -14, 28, -8);
        ctx.stroke();
      }

      // Happy Smile mouth
      ctx.beginPath();
      ctx.arc(0, 6, 9, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#202039";
      ctx.stroke();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedColor]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const s = stateRef.current;
    const dist = Math.hypot(px - s.x, py - s.y);

    if (dist <= 85) {
      s.isDragging = true;
      s.dragStartX = px;
      s.dragStartY = py;
      s.targetScaleX = 1.35;
      s.targetScaleY = 0.7; // squish horizontally
      sounds.squish(1.1);
      triggerHaptic("medium");
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const s = stateRef.current;
    s.pointerX = px;
    s.pointerY = py;

    if (s.isDragging) {
      const dx = px - s.dragStartX;
      const dy = py - s.dragStartY;
      s.targetX = rect.width / 2 + dx * 0.6;
      s.targetY = rect.height / 2 + dy * 0.6;

      // Stretch along drag vector
      const dragDist = Math.hypot(dx, dy);
      s.targetScaleX = Math.max(0.6, 1 + dragDist * 0.003);
      s.targetScaleY = Math.max(0.5, 1 - dragDist * 0.002);
    }
  };

  const handlePointerUp = () => {
    const s = stateRef.current;
    if (s.isDragging) {
      s.isDragging = false;
      s.targetScaleX = 1.0;
      s.targetScaleY = 1.0;
      s.velScaleX = -0.4; // boing bounce
      s.velScaleY = 0.4;
      sounds.squish(0.85);
      triggerHaptic("light");
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-purple-50/60 via-white to-purple-100/30 dark:from-[#18172E] dark:via-[#131226] dark:to-[#1C1B33] rounded-3xl border border-purple-100 dark:border-purple-900/50 flex flex-col justify-between p-4 shadow-inner overflow-hidden select-none">
      {/* Top Controls: Color Picker */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40">
          <Palette className="w-3.5 h-3.5 text-brand-purple" />
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1">Color:</span>
          <div className="flex items-center gap-1.5">
            {SQUISHY_COLORS.map((c, idx) => (
              <button
                key={c.name}
                onClick={() => {
                  setSelectedColor(idx);
                  sounds.uiClick();
                }}
                style={{ backgroundColor: c.fill }}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${
                  selectedColor === idx ? "scale-125 border-brand-purple" : "border-white/80 hover:scale-110"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            sounds.squish(1.0);
            stateRef.current.velScaleY = 0.5;
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1E1D36] text-brand-text-dark dark:text-white shadow-sm border border-purple-100 dark:border-purple-800/40 hover:text-brand-purple active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Poke Bloop</span>
        </button>
      </div>

      {/* Physics Canvas Viewport */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing game-viewport"
      />

      {/* Bottom Hint */}
      <div className="text-center z-10">
        <span className="text-[11px] font-semibold text-brand-text-muted dark:text-gray-400 bg-white/70 dark:bg-[#121124]/70 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-100/60 dark:border-purple-900/40">
          💡 Click, drag, and squish Bloop! Release to watch it bounce elastically
        </span>
      </div>
    </div>
  );
}
