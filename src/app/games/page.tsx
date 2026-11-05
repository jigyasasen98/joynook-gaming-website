"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Heart, Sparkles, Filter, SlidersHorizontal } from "lucide-react";
import { GAMES, GameItem } from "@/data/gamesData";
import { CATEGORIES } from "@/data/categoriesData";
import { GameCard } from "@/components/ui/GameCard";
import { useFavorites } from "@/hooks/useFavorites";

function GamesDirectoryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialSort = searchParams.get("sort") || "popular";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "az" | "recent">(
    (initialSort as "popular" | "rating" | "az" | "recent") || "popular"
  );
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const { favorites, isFavorite } = useFavorites();

  // Sync state if query params change
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setSearchQuery(q);
    const cat = searchParams.get("category");
    if (cat !== null) setSelectedCategory(cat);
    const s = searchParams.get("sort");
    if (s !== null) setSortBy(s as "popular" | "rating" | "az" | "recent");
  }, [searchParams]);

  // Filter & Sort games
  const filteredGames = useMemo(() => {
    let result = [...GAMES];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.shortDescription.toLowerCase().includes(q) ||
          g.categoryName.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (g) => g.category === selectedCategory || g.secondaryCategories.includes(selectedCategory)
      );
    }

    // Only Favorites filter
    if (onlyFavorites) {
      result = result.filter((g) => isFavorite(g.slug));
    }

    // Sorting
    if (sortBy === "popular") {
      result.sort((a, b) => b.playsCount - a.playsCount);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "recent") {
      result.sort((a, b) => (b.isRecent ? 1 : 0) - (a.isRecent ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedCategory, onlyFavorites, sortBy, isFavorite]);

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title & Intro */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-brand-purple dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Full Arcade Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text-dark dark:text-white tracking-tight">
            All Free Browser Games
          </h1>
          <p className="text-sm text-brand-text-muted dark:text-gray-400 mt-2">
            Explore our collection of 18 satisfying games, fidget toys, brain teasers, and mindfulness tools.
          </p>
        </div>

        {/* Filter and Search Controls Bar */}
        <div className="bg-white dark:bg-[#1C1B33] rounded-3xl p-4 sm:p-5 border border-purple-100 dark:border-purple-950/60 shadow-card mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search by game name or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-brand-text-dark dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort & Favorites Controls */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 w-full md:w-auto">
              {/* Only Favorites toggle */}
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
                  onlyFavorites
                    ? "bg-coral-50 border-coral-200 text-brand-coral dark:bg-coral-950/40 dark:border-coral-800"
                    : "bg-purple-50/70 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/40 text-gray-600 dark:text-gray-300 hover:text-brand-coral"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? "fill-current" : ""}`} />
                <span>Favorites only ({favorites.length})</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-xs font-bold text-gray-600 dark:text-gray-300">
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-purple" />
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "popular" | "rating" | "az" | "recent")}
                  className="bg-transparent text-brand-text-dark dark:text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="az">Alphabetical (A-Z)</option>
                  <option value="recent">Recently Added</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedCategory === "all"
                  ? "bg-brand-purple text-white shadow-sm"
                  : "bg-purple-50 dark:bg-purple-950/40 text-gray-600 dark:text-gray-300 hover:bg-purple-100"
              }`}
            >
              All Categories ({GAMES.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat.slug
                    ? "bg-brand-purple text-white shadow-sm"
                    : "bg-purple-50 dark:bg-purple-950/40 text-gray-600 dark:text-gray-300 hover:bg-purple-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-semibold text-brand-text-muted dark:text-gray-400 mb-6 px-1">
          <span>
            Showing <strong className="text-brand-text-dark dark:text-white">{filteredGames.length}</strong> games
          </span>
          {(searchQuery || selectedCategory !== "all" || onlyFavorites) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setOnlyFavorites(false);
              }}
              className="text-brand-purple dark:text-purple-300 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white dark:bg-[#1C1B33] rounded-3xl border border-purple-100 dark:border-purple-950/60 p-8 shadow-card">
            <span className="text-5xl">🔍</span>
            <h3 className="font-extrabold text-xl text-brand-text-dark dark:text-white mt-3">
              No Games Found
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any games matching your current filters. Try searching for something else or reset your filters!
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setOnlyFavorites(false);
              }}
              className="mt-5 px-5 py-2.5 rounded-2xl bg-brand-purple text-white text-xs font-bold shadow-md hover:bg-brand-purple/90 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GamesDirectoryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold">Loading Games...</div>}>
      <GamesDirectoryContent />
    </Suspense>
  );
}
