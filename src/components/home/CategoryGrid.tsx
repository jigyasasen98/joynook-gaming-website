import Link from "next/link";
import {
  Sparkles,
  HandMetal,
  Puzzle,
  Palette,
  Gamepad2,
  Brain,
  Brush,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { CATEGORIES } from "@/data/categoriesData";
import { GAMES } from "@/data/gamesData";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  HandMetal,
  Puzzle,
  Palette,
  Gamepad2,
  Brain,
  Brush,
  Headphones,
};

export function CategoryGrid() {
  return (
    <section className="py-12 lg:py-16 bg-purple-50/50 dark:bg-[#151426]/50 border-y border-purple-100/60 dark:border-purple-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-purple dark:text-purple-300">
            Endless Variety
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text-dark dark:text-white mt-1">
            Explore by Category
          </h2>
          <p className="text-sm text-brand-text-muted dark:text-gray-400 mt-2">
            Whether you want mindful relaxation, tactile fidgets, smart puzzles, or creative art, we have the perfect nook for you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || Sparkles;
            const count = GAMES.filter(
              (g) => g.category === cat.slug || g.secondaryCategories.includes(cat.slug)
            ).length;

            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100/80 dark:border-purple-950/60 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-base text-brand-text-dark dark:text-white group-hover:text-brand-purple transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-50 dark:border-purple-950/40 flex items-center justify-between text-xs font-bold text-brand-purple dark:text-purple-300">
                  <span>{count} {count === 1 ? "Experience" : "Games"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
