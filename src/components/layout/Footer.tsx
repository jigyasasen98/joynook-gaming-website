import Link from "next/link";
import { Gamepad2, Heart, Shield, FileText, Mail, Info, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/data/categoriesData";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-purple-100 dark:border-purple-950/60 bg-white/70 dark:bg-[#121124] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-coral flex items-center justify-center text-white shadow-md shadow-brand-purple/20">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-brand-text-dark dark:text-white">
                Joy<span className="text-brand-purple">Nook</span>
              </span>
            </Link>
            <p className="text-sm text-brand-text-muted dark:text-gray-400 max-w-sm leading-relaxed">
              Your instant sanctuary for relaxing browser games, tactile fidget toys, satisfying puzzles, and creative tools. Free to play anywhere, anytime—no downloads or logins required.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-brand-text-muted dark:text-gray-400 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-brand-purple dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
                <Sparkles className="w-3.5 h-3.5" /> 100% Free & Safe
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 dark:bg-coral-950/40 text-brand-coral dark:text-coral-300 border border-coral-100 dark:border-coral-900/40">
                <Heart className="w-3.5 h-3.5 fill-current" /> Made for Joy
              </span>
            </div>
          </div>

          {/* Explore Col */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-text-dark dark:text-white mb-4">
              Explore Games
            </h3>
            <ul className="space-y-2.5 text-sm text-brand-text-muted dark:text-gray-400">
              <li>
                <Link href="/games" className="hover:text-brand-purple dark:hover:text-white transition-colors">
                  All 18 Games
                </Link>
              </li>
              <li>
                <Link href="/games?sort=popular" className="hover:text-brand-purple dark:hover:text-white transition-colors">
                  Popular Games
                </Link>
              </li>
              <li>
                <Link href="/games?sort=recent" className="hover:text-brand-purple dark:hover:text-white transition-colors">
                  Recently Added
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-brand-purple dark:hover:text-white transition-colors">
                  My Favorites
                </Link>
              </li>
              <li>
                <Link href="/games/bubble-pop" className="hover:text-brand-purple dark:hover:text-white transition-colors">
                  Bubble Pop
                </Link>
              </li>
              <li>
                <Link href="/games/2048" className="hover:text-brand-purple dark:hover:text-white transition-colors">
                  2048 Classic
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Col */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-text-dark dark:text-white mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-brand-text-muted dark:text-gray-400">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-brand-purple dark:hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Col */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-text-dark dark:text-white mb-4">
              Platform & Legal
            </h3>
            <ul className="space-y-2.5 text-sm text-brand-text-muted dark:text-gray-400">
              <li>
                <Link href="/about" className="hover:text-brand-purple dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-purple dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-purple dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-purple dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-purple-100 dark:border-purple-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-text-muted dark:text-gray-500">
          <p>© {currentYear} JoyNook. All rights reserved. Free browser entertainment platform.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-brand-coral fill-brand-coral" /> for mindful play and relaxation.
          </p>
        </div>
      </div>
    </footer>
  );
}
