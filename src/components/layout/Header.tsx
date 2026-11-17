"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Gamepad2,
  Search,
  Heart,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  Puzzle,
  HandMetal,
  Palette,
  Download,
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { favorites } = useFavorites();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  // Initialize theme & PWA install listener
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("joynook_theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      }

      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);

      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
      return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      alert("To install JoyNook: Click your browser menu (⋮ or ⋯) and choose 'Install JoyNook' or 'Add to Home Screen'.");
    }
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("joynook_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("joynook_theme", "light");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/games?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Games", href: "/games" },
    { label: "Relaxing", href: "/category/relaxing", icon: Sparkles },
    { label: "Fidget Toys", href: "/category/fidget-toys", icon: HandMetal },
    { label: "Puzzles", href: "/category/puzzle", icon: Puzzle },
    { label: "Creative", href: "/category/creative", icon: Palette },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/85 dark:bg-[#121124]/90 backdrop-blur-md shadow-sm border-b border-purple-100/60 dark:border-purple-950/40 py-2.5"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-purple rounded-xl p-1"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-coral flex items-center justify-center text-white shadow-md shadow-brand-purple/20 group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-brand-text-dark dark:text-white flex items-center gap-1">
                Joy<span className="text-brand-purple">Nook</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-coral"></span>
              </span>
              <span className="text-[10px] font-medium text-brand-text-muted dark:text-gray-400 -mt-1 tracking-wider uppercase">
                Play & Relax
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 dark:bg-[#1C1B33]/80 p-1.5 rounded-full border border-purple-100 dark:border-purple-900/40 shadow-sm backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-brand-purple text-white shadow-sm"
                      : "text-brand-text-dark dark:text-gray-300 hover:text-brand-purple dark:hover:text-white hover:bg-purple-50/80 dark:hover:bg-purple-950/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Favorites, Theme Toggle, Install App, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Input (desktop) */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-48 pl-9 pr-3 py-1.5 text-sm rounded-full bg-white/90 dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-900/40 text-brand-text-dark dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Install App Button (Desktop/Tablet) */}
            {!isStandalone && (
              <button
                onClick={handleInstallClick}
                title="Install JoyNook as Web App"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-brand-purple text-brand-purple hover:text-white dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-brand-purple dark:hover:text-white border border-purple-200/60 dark:border-purple-800/40 text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
            )}

            {/* Favorites Icon Button with Counter */}
            <Link
              href="/favorites"
              aria-label="View Favorites"
              className={`relative p-2.5 rounded-full border border-purple-100 dark:border-purple-900/40 transition-colors ${
                pathname === "/favorites"
                  ? "bg-brand-coral/10 text-brand-coral border-brand-coral/30"
                  : "bg-white/80 dark:bg-[#1C1B33] text-brand-text-dark dark:text-gray-300 hover:text-brand-coral hover:bg-coral-50/50 dark:hover:bg-coral-950/20"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${favorites.length > 0 ? "fill-brand-coral text-brand-coral" : ""}`}
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-coral text-white text-[10px] font-bold flex items-center justify-center animate-scale">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2.5 rounded-full bg-white/80 dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-900/40 text-brand-text-dark dark:text-gray-300 hover:text-brand-purple hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-brand-yellow" /> : <Moon className="w-4 h-4 text-brand-purple" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open Navigation Menu"
              className="lg:hidden p-2.5 rounded-full bg-white/80 dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-900/40 text-brand-text-dark dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-white/95 dark:bg-[#121124]/95 backdrop-blur-lg border-b border-purple-100 dark:border-purple-900/40 shadow-xl px-4 py-5 transition-all">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Search all 18 games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-50/70 dark:bg-[#1C1B33] border border-purple-200 dark:border-purple-900/50 text-brand-text-dark dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-brand-purple text-white"
                      : "text-brand-text-dark dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 opacity-75" />}
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/favorites"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-brand-coral bg-coral-50/50 dark:bg-coral-950/20 hover:bg-coral-100/50 mt-1"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 fill-brand-coral" />
                <span>My Favorite Games</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-brand-coral text-white text-xs font-bold">
                {favorites.length}
              </span>
            </Link>

            {!isStandalone && (
              <button
                onClick={handleInstallClick}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-brand-purple text-white shadow-md mt-2"
              >
                <Download className="w-4 h-4" />
                <span>Install JoyNook Web App</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
