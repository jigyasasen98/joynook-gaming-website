"use client";

import Link from "next/link";
import { Play, Sparkles, Gamepad2, ArrowRight } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

export function HeroSection() {
  const handleBubbleClick = (pitch: number) => {
    sounds.bubblePop(pitch);
  };

  return (
    <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-20 overflow-hidden">
      {/* Decorative ambient gradient blooms */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-purple/15 via-brand-coral/10 to-brand-yellow/15 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-800/50 shadow-sm animate-bounceGentle">
              <Sparkles className="w-4 h-4 text-brand-purple dark:text-purple-300" />
              <span className="text-xs font-bold text-brand-purple dark:text-purple-300 tracking-wide uppercase">
                100% Free • No Sign-Up • Instant Play
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-text-dark dark:text-white leading-[1.15]">
              Play, Relax & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-purple via-brand-coral to-brand-yellow bg-clip-text text-transparent">
                Have Fun!
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-brand-text-muted dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Take a little break with fun, satisfying games and interactive experiences. No downloads, no registration, just play directly in your browser.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/games"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-extrabold text-base shadow-lg shadow-brand-purple/25 hover:shadow-brand-purple/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Explore Games</span>
              </Link>

              <Link
                href="/games/bubble-pop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white dark:bg-[#1C1B33] text-brand-text-dark dark:text-white font-extrabold text-base border border-purple-100 dark:border-purple-900 shadow-card hover:shadow-card-hover hover:text-brand-purple hover:-translate-y-0.5 transition-all duration-200"
              >
                <Play className="w-4 h-4 fill-brand-coral text-brand-coral" />
                <span>Play Now</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-8 text-xs font-semibold text-brand-text-muted dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-mint-400 animate-pulse" />
                <span>18 Playable Games</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-coral" />
                <span>Zero Ads Blocking Play</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Fidget Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white/80 dark:bg-[#1C1B33]/85 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/50 shadow-card backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-coral" />
                  <div className="w-3 h-3 rounded-full bg-brand-yellow" />
                  <div className="w-3 h-3 rounded-full bg-mint-400" />
                </div>
                <span className="text-[11px] font-bold text-brand-purple dark:text-purple-300 uppercase tracking-wider">
                  Interactive Mini Fidget
                </span>
              </div>

              {/* Interactive Fidget Bubbles Pad right on the hero! */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-purple-50/70 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900/40">
                {[
                  { emoji: "🫧", label: "Bubble", pitch: 1.0, color: "from-purple-400 to-indigo-400" },
                  { emoji: "🧪", label: "Potion", pitch: 1.2, color: "from-coral-400 to-pink-400" },
                  { emoji: "🎈", label: "Balloon", pitch: 0.9, color: "from-yellow-400 to-amber-400" },
                  { emoji: "🔘", label: "Wrap", pitch: 1.3, color: "from-sky-400 to-blue-400" },
                  { emoji: "🍮", label: "Squishy", pitch: 1.1, color: "from-mint-400 to-teal-400" },
                  { emoji: "✨", label: "Magic", pitch: 1.4, color: "from-purple-400 to-pink-400" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBubbleClick(item.pitch)}
                    className="group/btn relative aspect-square rounded-2xl bg-white dark:bg-[#1E1D36] border border-purple-100 dark:border-purple-800/40 shadow-sm hover:shadow-md active:scale-90 transition-all flex flex-col items-center justify-center overflow-hidden"
                  >
                    <span className="text-3xl select-none group-hover/btn:scale-110 transition-transform">
                      {item.emoji}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-1">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bottom Quick Card Link */}
              <div className="mt-4 pt-3 border-t border-purple-50 dark:border-purple-900/30 flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-text-muted dark:text-gray-400">
                  Tap buttons for sound!
                </span>
                <Link
                  href="/games/bubble-pop"
                  className="text-xs font-bold text-brand-purple dark:text-purple-300 hover:text-brand-coral flex items-center gap-1 transition-colors"
                >
                  <span>Play Fullscreen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
