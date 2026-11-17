import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Script from "next/script";
import { ChevronRight, ArrowLeft, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/data/categoriesData";
import { getGamesByCategory } from "@/data/gamesData";
import { GameCard } from "@/components/ui/GameCard";
import { SITE_CONFIG } from "@/lib/siteConfig";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const cat = CATEGORIES.find((c) => c.slug === params.category);
  if (!cat) return { title: `Category Not Found | ${SITE_CONFIG.name}` };

  const pageUrl = `${SITE_CONFIG.url}/category/${cat.slug}`;

  return {
    title: `${cat.name} - Free Online Browser Games | ${SITE_CONFIG.name}`,
    description: `Play free online ${cat.name.toLowerCase()} at ${SITE_CONFIG.name}. ${cat.description} Instant play, no download or login required.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${cat.name} - Play Free Online Games | ${SITE_CONFIG.name}`,
      description: cat.description,
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: `${SITE_CONFIG.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${cat.name} on ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.name} - Play Free Online Games | ${SITE_CONFIG.name}`,
      description: cat.description,
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const cat = CATEGORIES.find((c) => c.slug === params.category);

  if (!cat) {
    notFound();
  }

  const games = getGamesByCategory(cat.slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Games",
        item: `${SITE_CONFIG.url}/games`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cat.name,
        item: `${SITE_CONFIG.url}/category/${cat.slug}`,
      },
    ],
  };

  return (
    <div className="py-8 sm:py-12">
      <Script
        id={`breadcrumb-${cat.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-brand-text-muted dark:text-gray-400 mb-6"
        >
          <Link href="/" className="hover:text-brand-purple dark:hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/games" className="hover:text-brand-purple dark:hover:text-white transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-bold text-brand-purple dark:text-purple-300">{cat.name}</span>
        </nav>

        {/* Category Header Banner */}
        <div className="relative rounded-3xl p-6 sm:p-10 mb-10 overflow-hidden bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-950/60 shadow-card">
          <div
            className={`absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br ${cat.bgGradient} blur-3xl pointer-events-none -mr-20 -mt-20`}
          />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-purple-50 dark:bg-purple-950/60 text-brand-purple dark:text-purple-300">
              <Sparkles className="w-3.5 h-3.5" /> Category Collection
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text-dark dark:text-white tracking-tight">
              {cat.name}
            </h1>
            <p className="text-sm sm:text-base text-brand-text-muted dark:text-gray-300 mt-2 leading-relaxed">
              {cat.description}
            </p>
            <div className="mt-4 text-xs font-bold text-brand-purple dark:text-purple-300">
              {games.length} {games.length === 1 ? "Experience" : "Games Available"}
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white dark:bg-[#1C1B33] rounded-3xl border border-purple-100 p-8 shadow-card">
            <p className="text-sm font-bold text-gray-500">More games coming to this category soon!</p>
            <Link
              href="/games"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-purple"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all games</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
