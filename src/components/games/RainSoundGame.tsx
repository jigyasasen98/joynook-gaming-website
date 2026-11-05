"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Zap, Volume2, CloudRain, Wind, Flame } from "lucide-react";
import { ambientSynth } from "@/lib/soundSynth";
import { sounds } from "@/lib/soundEffects";

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

export function RainSoundGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rainVol, setRainVol] = useState(0.6);
  const [windVol, setWindVol] = useState(0.2);
  const [fireVol, setFireVol] = useState(0.0);
  const [lightning, setLightning] = useState(false);

  const dropsRef = useRef<Drop[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Canvas Raindrops Animation Loop
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
    };

    resize();
    window.addEventListener("resize", resize);

    // Populate drops
    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;
    dropsRef.current = Array.from({ length: 90 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 10 + 12,
      opacity: Math.random() * 0.4 + 0.2,
    }));

    const render = () => {
      const cw = canvas.getBoundingClientRect().width;
      const ch = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, cw, ch);

      // Draw each falling rain drop
      ctx.lineWidth = 1.5;
      for (const d of dropsRef.current) {
        ctx.strokeStyle = `rgba(180, 210, 240, ${d.opacity})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x -= 1.2;

        if (d.y > ch) {
          d.y = -d.length;
          d.x = Math.random() * cw + 50;
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const togglePlay = () => {
    sounds.uiClick();
    if (!isPlaying) {
      ambientSynth.start();
      ambientSynth.setRainVolume(rainVol);
      ambientSynth.setWindVolume(windVol);
      ambientSynth.setCampfireVolume(fireVol);
      setIsPlaying(true);
    } else {
      ambientSynth.stop();
      setIsPlaying(false);
    }
  };

  const handleRainChange = (val: number) => {
    setRainVol(val);
    ambientSynth.setRainVolume(val);
  };

  const handleWindChange = (val: number) => {
    setWindVol(val);
    ambientSynth.setWindVolume(val);
  };

  const handleFireChange = (val: number) => {
    setFireVol(val);
    ambientSynth.setCampfireVolume(val);
  };

  const triggerThunder = () => {
    if (!isPlaying) {
      togglePlay();
    }
    ambientSynth.triggerThunder();
    setLightning(true);
    setTimeout(() => setLightning(false), 200);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      ambientSynth.stop();
    };
  }, []);

  return (
    <div
      className={`relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl border border-blue-900/40 flex flex-col justify-between p-4 sm:p-6 shadow-inner overflow-hidden select-none transition-colors duration-150 ${
        lightning
          ? "bg-slate-100"
          : "bg-gradient-to-b from-[#0F1426] via-[#12172D] to-[#1C1F38] text-white"
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl font-extrabold text-xs shadow-md transition-all active:scale-95 ${
              isPlaying
                ? "bg-brand-coral text-white"
                : "bg-brand-purple hover:bg-brand-purple/90 text-white"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Soundscape</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Soundscape</span>
              </>
            )}
          </button>
        </div>

        {/* Trigger Thunder Lightning Button */}
        <button
          onClick={triggerThunder}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-700/60 text-brand-yellow font-bold text-xs shadow-sm active:scale-95 transition-all"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Thunder Strike</span>
        </button>
      </div>

      {/* Main Canvas Viewport with Rain animation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Center Cozy Visual */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto pointer-events-none text-center">
        <span className="text-5xl sm:text-6xl filter drop-shadow animate-float">🌧️</span>
        <h3 className="font-extrabold text-xl sm:text-2xl mt-2 text-white drop-shadow">
          Cozy Rain Sanctuary
        </h3>
        <p className="text-xs text-sky-200/70 mt-1 max-w-xs">
          Mix continuous procedural rainfall, mountain wind, and campfire warmth.
        </p>
      </div>

      {/* Bottom Sound Mixer Sliders */}
      <div className="relative z-10 bg-black/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 max-w-xl mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Rain Slider */}
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between text-sky-300 font-bold">
            <span className="flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5" /> Rain
            </span>
            <span>{Math.round(rainVol * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={rainVol}
            onChange={(e) => handleRainChange(parseFloat(e.target.value))}
            className="accent-brand-sky cursor-pointer"
          />
        </div>

        {/* Wind Slider */}
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between text-teal-300 font-bold">
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5" /> Wind
            </span>
            <span>{Math.round(windVol * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={windVol}
            onChange={(e) => handleWindChange(parseFloat(e.target.value))}
            className="accent-teal-400 cursor-pointer"
          />
        </div>

        {/* Fire Slider */}
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between text-amber-300 font-bold">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Campfire
            </span>
            <span>{Math.round(fireVol * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={fireVol}
            onChange={(e) => handleFireChange(parseFloat(e.target.value))}
            className="accent-amber-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
