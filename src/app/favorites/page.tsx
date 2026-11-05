"use client";

import Link from "next/link";
import { Heart, Sparkles, Gamepad2, ArrowRight } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { GAMES } from "@/data/gamesData";
import { GameCard } from "@/components/ui/GameCard";

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();

  const favoriteGames = GAMES.filter((g) => favorites.includes(g.slug));

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-coral-50 dark:bg-coral-950/60 text-brand-coral text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" /> Saved Collection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text-dark dark:text-white tracking-tight">
            My Favorite Games
          </h1>
          <p className="text-sm text-brand-text-muted dark:text-gray-400 mt-2">
            Your personal handpicked arcade. Stored securely on your device for instant 1-click access anytime.
          </p>
        </div>

        {/* Content */}
        {!isLoaded ? (
          <div className="py-20 text-center text-sm font-bold text-gray-400">Loading your favorites...</div>
        ) : favoriteGames.length > 0 ? (
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-brand-text-muted dark:text-gray-400 mb-6">
              <span>
                You have saved <strong className="text-brand-coral">{favoriteGames.length}</strong> {favoriteGames.length === 1 ? "game" : "games"}
              </span>
              <Link
                href="/games"
                className="text-brand-purple dark:text-purple-300 hover:text-brand-coral transition-colors flex items-center gap-1 font-bold"
              >
                <span>Browse more games</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center bg-white dark:bg-[#1C1B33] rounded-3xl border border-purple-100 dark:border-purple-950/60 p-8 shadow-card max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-coral-50 dark:bg-coral-950/60 text-brand-coral flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <h2 className="text-xl font-extrabold text-brand-text-dark dark:text-white">
              No Favorites Saved Yet
            </h2>
            <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-2 leading-relaxed">
              Whenever you enjoy a game, click the little heart icon on its card or toolbar to save it here for quick access!
            </p>
            <Link
              href="/games"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Explore All 18 Games</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
