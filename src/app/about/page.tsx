import { Sparkles, Heart, Shield, Zap, Smile } from "lucide-react";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "About Us - JoyNook",
  description:
    "Learn about JoyNook's mission to provide instant, calming, and delightful browser games and fidget toys with zero barrier to entry.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: "About JoyNook - Free Calming Web Games",
    description: "Learn about JoyNook's mission to provide instant, calming browser games.",
    url: `${SITE_CONFIG.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-brand-purple dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Our Story
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text-dark dark:text-white tracking-tight">
            About JoyNook
          </h1>
          <p className="text-base text-brand-text-muted dark:text-gray-300 mt-3 max-w-xl mx-auto leading-relaxed">
            A peaceful digital sanctuary created to give everyone quick, calming, and satisfying pauses throughout their busy day.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-brand-text-muted dark:text-gray-300">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-950/60 shadow-card space-y-4">
            <h2 className="text-xl font-extrabold text-brand-text-dark dark:text-white flex items-center gap-2">
              <Smile className="w-5 h-5 text-brand-purple" />
              <span>Why We Built JoyNook</span>
            </h2>
            <p>
              In today&apos;s fast-paced digital world, finding a genuine moment to relax can be surprisingly hard. Most mobile apps and web platforms require tedious downloads, mandatory account sign-ups, intrusive personal tracking, or barrage users with disruptive unskippable advertisements.
            </p>
            <p>
              We built <strong>JoyNook</strong> with a simple core philosophy: <strong>instant joy with zero friction</strong>. Whether you have 2 minutes between meetings or 30 minutes to unwind before bed, you can open any browser, tap a game, and experience soothing tactile stimulation, mindful breathing, or clever puzzles immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-950/60 shadow-card">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-brand-purple flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-extrabold text-base text-brand-text-dark dark:text-white mb-1.5">
                Mindful Design
              </h3>
              <p className="text-xs text-brand-text-muted dark:text-gray-400">
                Carefully tuned audio physics, calming pastel aesthetics, and satisfying interactions designed to melt away anxiety.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-950/60 shadow-card">
              <div className="w-10 h-10 rounded-2xl bg-coral-50 dark:bg-coral-950/60 text-brand-coral flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-brand-text-dark dark:text-white mb-1.5">
                Zero Installation
              </h3>
              <p className="text-xs text-brand-text-muted dark:text-gray-400">
                Built with modern Web standards (HTML5 Canvas, Web Audio API, React) for instant loading on any smartphone, tablet, or desktop.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1B33] border border-purple-100 dark:border-purple-950/60 shadow-card">
              <div className="w-10 h-10 rounded-2xl bg-mint-50 dark:bg-mint-950/60 text-mint-700 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-brand-text-dark dark:text-white mb-1.5">
                Private & Secure
              </h3>
              <p className="text-xs text-brand-text-muted dark:text-gray-400">
                No personal accounts or passwords needed. Your high scores and favorites live safely on your device in LocalStorage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
