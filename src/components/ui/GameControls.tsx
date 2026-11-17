"use client";

import { useState, useEffect } from "react";
import {
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  RotateCcw,
  Share2,
  Heart,
  Check,
} from "lucide-react";
import { sounds } from "@/lib/soundEffects";
import { useFavorites } from "@/hooks/useFavorites";
import { triggerHaptic } from "@/lib/haptics";
import { shareContent } from "@/lib/nativeBridge";

interface GameControlsProps {
  gameSlug: string;
  gameTitle: string;
  onRestart?: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export function GameControls({
  gameSlug,
  gameTitle,
  onRestart,
  containerRef,
}: GameControlsProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(gameSlug);

  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMuted(sounds.getMuted());

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleToggleSound = () => {
    triggerHaptic("selection");
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sounds.bubblePop();
    }
  };

  const handleToggleFullscreen = () => {
    triggerHaptic("medium");
    sounds.uiClick();
    if (!document.fullscreenElement) {
      const target = containerRef?.current || document.documentElement;
      if (target.requestFullscreen) {
        target.requestFullscreen().catch((err) => {
          console.warn("Fullscreen error", err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleRestart = () => {
    triggerHaptic("medium");
    sounds.uiClick();
    if (onRestart) {
      onRestart();
    }
  };

  const handleFavorite = () => {
    triggerHaptic("light");
    sounds.uiClick();
    toggleFavorite(gameSlug);
  };

  const handleShare = async () => {
    triggerHaptic("selection");
    sounds.uiClick();
    const shared = await shareContent({
      title: `${gameTitle} - Play Free on JoyNook`,
      text: `Play ${gameTitle} instantly in your browser on JoyNook. No download needed!`,
      url: window.location.href,
    });

    if (shared) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/80 dark:bg-[#1C1B33]/90 rounded-2xl border border-purple-100 dark:border-purple-950/60 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {/* Restart Button */}
        {onRestart && (
          <button
            onClick={handleRestart}
            title="Restart Game"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 hover:bg-brand-purple text-brand-purple hover:text-white dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-brand-purple dark:hover:text-white transition-all shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        )}

        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
          className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
            isMuted
              ? "bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700"
              : "bg-purple-50 dark:bg-purple-950/50 text-brand-purple dark:text-purple-300 border-purple-200 dark:border-purple-900"
          } hover:scale-105 active:scale-95`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          title={favorited ? "Remove from Favorites" : "Add to Favorites"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            favorited
              ? "bg-coral-50 border-coral-200 text-brand-coral dark:bg-coral-950/40 dark:border-coral-800"
              : "bg-white dark:bg-[#1C1B33] border-purple-100 dark:border-purple-900 text-gray-600 dark:text-gray-300 hover:text-brand-coral"
          } active:scale-95`}
        >
          <Heart className={`w-3.5 h-3.5 ${favorited ? "fill-brand-coral" : ""}`} />
          <span>{favorited ? "Saved" : "Favorite"}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          title="Share Game"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-900 text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-purple-300 transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-mint-500" />
              <span className="text-mint-600">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={handleToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="p-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-900 text-gray-600 dark:text-gray-300 hover:text-brand-purple dark:hover:text-purple-300 transition-all hover:scale-105 active:scale-95"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
