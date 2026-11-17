import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PwaRegistrar } from "@/components/pwa/PwaRegistrar";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#7856E8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://joynook.com"),
  title: {
    default: "JoyNook - Play, Relax & Have Fun! | Free Online Games",
    template: "%s | JoyNook",
  },
  description:
    "Instant free browser games, fidget toys, relaxing puzzles, and creative art tools. Accessible to everyone, no downloads or registration required.",
  keywords: [
    "free online games",
    "relaxing games",
    "fidget toys",
    "bubble wrap game",
    "puzzle games",
    "2048 game",
    "satisfying games",
    "unwind games",
    "browser games without download",
    "pwa gaming web app",
  ],
  authors: [{ name: "JoyNook Team" }],
  creator: "JoyNook",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JoyNook",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://joynook.com",
    title: "JoyNook - Play, Relax & Have Fun!",
    description:
      "Play free satisfying games, fidget toys, relaxing puzzles, and creative tools instantly in your browser.",
    siteName: "JoyNook",
  },
  twitter: {
    card: "summary_large_image",
    title: "JoyNook - Play, Relax & Have Fun!",
    description:
      "Play free satisfying games, fidget toys, relaxing puzzles, and creative tools instantly in your browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="JoyNook" />
        {/* Prevent theme flicker script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('joynook_theme');
                var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && supportDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-bg-light dark:bg-brand-bg-dark text-brand-text-dark dark:text-brand-text-light transition-colors duration-200">
        <PwaRegistrar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
