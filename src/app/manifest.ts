import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/siteConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    start_url: "/",
    id: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    background_color: "#FAF9FF",
    theme_color: "#7856E8",
    orientation: "any",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    shortcuts: [
      {
        name: "Bubble Pop",
        short_name: "Bubble Pop",
        description: "Pop satisfying bubbles with sound",
        url: "/games/bubble-pop",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "2048 Classic",
        short_name: "2048",
        description: "Merge numbers to 2048",
        url: "/games/2048",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Virtual Bubble Wrap",
        short_name: "Bubble Wrap",
        description: "Endless tactile bubble wrap",
        url: "/games/virtual-bubble-wrap",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Mindful Breathing",
        short_name: "Breathing",
        description: "Calm breathing exercise",
        url: "/games/breathing-exercise",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
    categories: ["games", "entertainment", "lifestyle"],
  };
}
