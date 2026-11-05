import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { GameCard } from "@/components/ui/GameCard";
import { GAMES } from "@/data/gamesData";

export function PopularSection() {
  const popularGames = GAMES.filter((g) => g.isPopular).slice(0, 4);

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 dark:bg-coral-950/60 text-brand-coral text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5" /> Most Played
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text-dark dark:text-white tracking-tight">
              Community Favorites
            </h2>
          </div>

          <Link
            href="/games?sort=popular"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-coral hover:text-brand-purple transition-colors"
          >
            <span>View All Popular</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}
