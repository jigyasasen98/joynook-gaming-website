import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { PopularSection } from "@/components/home/PopularSection";
import { RecentSection } from "@/components/home/RecentSection";
import { ValuePropsSection } from "@/components/home/ValuePropsSection";

export const metadata = {
  title: "JoyNook - Play, Relax & Have Fun! | Free Online Games & Fidget Toys",
  description:
    "Play free satisfying games, fidget toys, relaxing puzzles, and creative tools instantly in your browser. No downloads, no sign-up, 100% free.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedSection />
      <CategoryGrid />
      <PopularSection />
      <RecentSection />
      <ValuePropsSection />
    </div>
  );
}
