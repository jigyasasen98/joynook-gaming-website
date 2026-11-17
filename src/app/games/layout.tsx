import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "All Free Online Games & Relaxing Activities | JoyNook",
  description:
    "Explore the complete catalog of 18+ free browser games, fidget toys, brain puzzles, and relaxing sensory activities. Play instantly with no downloads or login.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/games`,
  },
  openGraph: {
    title: "All Games & Activities | JoyNook",
    description:
      "Instant-play free online browser games, fidget toys, and relaxing puzzles with no sign-ups or downloads.",
    url: `${SITE_CONFIG.url}/games`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "JoyNook Games Collection",
      },
    ],
  },
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
