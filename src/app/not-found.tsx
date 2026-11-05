import Link from "next/link";
import { Gamepad2, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-20 sm:py-28 text-center px-4">
      <div className="max-w-md mx-auto bg-white dark:bg-[#1C1B33] rounded-3xl p-8 border border-purple-100 dark:border-purple-950/60 shadow-card">
        <span className="text-6xl animate-bounceGentle inline-block">🕹️</span>
        <h1 className="text-3xl font-extrabold text-brand-text-dark dark:text-white mt-4">
          404 - Level Not Found
        </h1>
        <p className="text-xs sm:text-sm text-brand-text-muted dark:text-gray-400 mt-2 leading-relaxed">
          Looks like this game has drifted off into the cosmos! Don&apos;t worry, there are 18 other awesome games waiting for you.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-brand-purple font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            href="/games"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs shadow-md"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Explore All Games</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
