import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  Star,
  Sparkles,
  HelpCircle,
  Gamepad2,
  Smartphone,
  Monitor,
} from "lucide-react";
import { GAMES, getGameBySlug, getRelatedGames } from "@/data/gamesData";
import { GameCard } from "@/components/ui/GameCard";
import { GameControls } from "@/components/ui/GameControls";
import { GameRenderer } from "@/components/games/GameRenderer";

interface GamePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return GAMES.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const game = getGameBySlug(params.slug);
  if (!game) return { title: "Game Not Found | JoyNook" };

  return {
    title: `${game.title} - Play Free Online`,
    description: game.shortDescription,
    openGraph: {
      title: `${game.title} - Play Free Online | JoyNook`,
      description: game.shortDescription,
      url: `https://joynook.com/games/${game.slug}`,
      type: "website",
    },
  };
}

export default function GamePage({ params }: GamePageProps) {
  const game = getGameBySlug(params.slug);

  if (!game) {
    notFound();
  }

  const relatedGames = getRelatedGames(game.slug, 4);

  // Schema.org structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: game.title,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: game.rating,
      ratingCount: Math.round(game.playsCount / 10),
    },
    description: game.fullDescription,
  };

  return (
    <div className="py-6 sm:py-8">
      {/* Structured Data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-brand-text-muted dark:text-gray-400 mb-5 overflow-x-auto whitespace-nowrap"
        >
          <Link href="/" className="hover:text-brand-purple dark:hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/games" className="hover:text-brand-purple dark:hover:text-white transition-colors">
            Games
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link
            href={`/category/${game.category}`}
            className="hover:text-brand-purple dark:hover:text-white transition-colors"
          >
            {game.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-bold text-brand-purple dark:text-purple-300 truncate">
            {game.title}
          </span>
        </nav>

        {/* Game Title & Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-brand-purple dark:text-purple-300 border border-purple-200/50">
                {game.categoryName}
              </span>
              {game.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-coral-50 dark:bg-coral-950/60 text-brand-coral border border-coral-200/50">
                  {game.badge}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-text-dark dark:text-white tracking-tight">
              {game.title}
            </h1>
            <p className="text-sm text-brand-text-muted dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
              {game.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold self-start sm:self-center">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-900/60 shadow-sm">
              <Star className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
              <span className="font-extrabold text-brand-text-dark dark:text-white">
                {game.rating.toFixed(1)}
              </span>
              <span className="text-gray-400">/ 5.0</span>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-900/60 shadow-sm text-brand-text-muted dark:text-gray-400">
              {(game.playsCount / 1000).toFixed(0)}k plays
            </div>
          </div>
        </div>

        {/* Large Playable Game Box */}
        <div className="relative mb-4">
          <GameRenderer slug={game.slug} />
        </div>

        {/* Game Controls Toolbar */}
        <div className="mb-10">
          <GameControls gameSlug={game.slug} gameTitle={game.title} />
        </div>

        {/* Two-Column Information & Instructions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column: About & How to Play */}
          <div className="lg:col-span-8 space-y-6">
            {/* About / Full Description */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-900/50 shadow-card">
              <h2 className="text-lg sm:text-xl font-extrabold text-brand-text-dark dark:text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-purple" />
                <span>About {game.title}</span>
              </h2>
              <p className="text-sm text-brand-text-muted dark:text-gray-300 leading-relaxed">
                {game.fullDescription}
              </p>
            </div>

            {/* How to Play & Instructions */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-900/50 shadow-card">
              <h2 className="text-lg sm:text-xl font-extrabold text-brand-text-dark dark:text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-coral" />
                <span>How to Play</span>
              </h2>

              <p className="text-sm font-semibold text-brand-text-dark dark:text-gray-200 mb-4 p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30">
                👉 {game.howToPlay}
              </p>

              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Key Instructions:
              </h3>
              <ul className="space-y-2.5">
                {game.instructions.map((inst, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-xs sm:text-sm text-brand-text-muted dark:text-gray-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 text-brand-purple dark:text-purple-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Controls & Game Features */}
          <div className="lg:col-span-4 space-y-6">
            {/* Device Controls Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-900/50 shadow-card space-y-4">
              <h3 className="font-extrabold text-base text-brand-text-dark dark:text-white flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-brand-purple" />
                <span>Controls Guide</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100/60 dark:border-purple-900/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-purple dark:text-purple-300 mb-1">
                    <Monitor className="w-3.5 h-3.5" /> Desktop / Laptop
                  </div>
                  <p className="text-xs text-brand-text-muted dark:text-gray-400">
                    {game.controls.desktop}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-coral-50/70 dark:bg-coral-950/30 border border-coral-100/60 dark:border-coral-900/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-coral dark:text-coral-300 mb-1">
                    <Smartphone className="w-3.5 h-3.5" /> Mobile / Touch
                  </div>
                  <p className="text-xs text-brand-text-muted dark:text-gray-400">
                    {game.controls.mobile}
                  </p>
                </div>
              </div>
            </div>

            {/* Game Features List */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-900/50 shadow-card">
              <h3 className="font-extrabold text-base text-brand-text-dark dark:text-white mb-3">
                Game Features
              </h3>
              <ul className="space-y-2">
                {game.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-xs text-brand-text-muted dark:text-gray-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-mint-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Games Recommendation */}
        <div className="pt-8 border-t border-purple-100 dark:border-purple-950/60">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-text-dark dark:text-white tracking-tight">
              You Might Also Enjoy
            </h2>
            <Link
              href="/games"
              className="text-xs font-bold text-brand-purple dark:text-purple-300 hover:text-brand-coral transition-colors"
            >
              View All ➔
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedGames.map((relGame) => (
              <GameCard key={relGame.id} game={relGame} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
