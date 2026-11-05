import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { GameCard } from "@/components/ui/GameCard";
import { GAMES } from "@/data/gamesData";

export function FeaturedSection() {
  const featuredGames = GAMES.filter((g) => g.isFeatured).slice(0, 6);

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-brand-purple dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Handpicked Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text-dark dark:text-white tracking-tight">
              Featured Games & Experiences
            </h2>
          </div>

          <Link
            href="/games"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-purple dark:text-purple-400 hover:text-brand-coral transition-colors"
          >
            <span>Browse All 18 Games</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}
