import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { GameCard } from "@/components/ui/GameCard";
import { GAMES } from "@/data/gamesData";

export function RecentSection() {
  const recentGames = GAMES.filter((g) => g.isRecent).slice(0, 4);

  return (
    <section className="py-12 lg:py-16 bg-purple-50/40 dark:bg-[#151426]/40 border-y border-purple-100/50 dark:border-purple-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-50 dark:bg-mint-950/60 text-mint-700 dark:text-mint-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Fresh Additions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text-dark dark:text-white tracking-tight">
              Recently Added Games
            </h2>
          </div>

          <Link
            href="/games?sort=recent"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-mint-700 dark:text-mint-400 hover:text-brand-purple transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}
