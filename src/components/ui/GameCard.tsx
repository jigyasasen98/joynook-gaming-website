"use client";

import Link from "next/link";
import { Play, Heart, Zap, Sparkles } from "lucide-react";
import { GameItem } from "@/data/gamesData";
import { useFavorites } from "@/hooks/useFavorites";
import { sounds } from "@/lib/soundEffects";

interface GameCardProps {
  game: GameItem;
  priority?: boolean;
}

export function GameCard({ game }: GameCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(game.slug);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sounds.uiClick();
    toggleFavorite(game.slug);
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-[#1C1B33] rounded-3xl p-3.5 border border-purple-100/70 dark:border-purple-950/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
      {/* Top Media / Thumbnail Area */}
      <Link
        href={`/games/${game.slug}`}
        className="relative block aspect-[16/10] w-full rounded-2xl overflow-hidden mb-3.5 focus:outline-none"
      >
        {/* Colorful Gradient Backdrop with Emoji Icon */}
        <div
          className={`w-full h-full bg-gradient-to-br ${game.thumbnailBg} flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-105`}
        >
          {/* Subtle decorative circles */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/20 blur-md pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-black/10 blur-sm pointer-events-none" />

          {/* Central Emoji / Hero Icon */}
          <span className="text-5xl sm:text-6xl select-none filter drop-shadow-md transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            {game.thumbnailEmoji}
          </span>

          {/* Hover Overlay with Big Play Icon */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-13 h-13 rounded-full bg-white text-brand-purple flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            </div>
          </div>
        </div>

        {/* Badge (e.g. Trending, Editor's Pick, New) */}
        {game.badge && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm bg-white/90 dark:bg-[#121124]/90 backdrop-blur-md text-brand-purple dark:text-purple-300 border border-purple-100/40">
            {game.badge}
          </span>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-[#121124]/90 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-brand-coral transition-all duration-200 shadow-sm hover:scale-110 active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorited ? "fill-brand-coral text-brand-coral scale-110" : ""
            }`}
          />
        </button>
      </Link>

      {/* Content Area */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Attributes */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-brand-purple dark:text-purple-400 uppercase tracking-wider text-[11px]">
              {game.categoryName}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-brand-purple dark:text-purple-300 border border-purple-100/60 dark:border-purple-800/40">
              {game.difficulty}
            </span>
          </div>

          {/* Title */}
          <Link href={`/games/${game.slug}`}>
            <h3 className="font-bold text-lg text-brand-text-dark dark:text-white group-hover:text-brand-purple transition-colors line-clamp-1">
              {game.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-brand-text-muted dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
            {game.shortDescription}
          </p>
        </div>

        {/* Bottom Bar: Mode & Action Button */}
        <div className="mt-4 pt-3 border-t border-purple-50 dark:border-purple-950/40 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-mint-600 dark:text-mint-400">
            <Zap className="w-3 h-3 fill-current" />
            <span>Instant Play</span>
          </span>

          <Link
            href={`/games/${game.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-50 hover:bg-brand-purple text-brand-purple hover:text-white dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-brand-purple dark:hover:text-white transition-all duration-200"
          >
            <Play className="w-3 h-3 fill-current" />
            Play
          </Link>
        </div>
      </div>
    </div>
  );
}
