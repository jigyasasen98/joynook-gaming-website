export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  bgGradient: string;
  accentColor: string;
  gameCount?: number;
}

export const CATEGORIES: GameCategory[] = [
  {
    id: "relaxing",
    name: "Relaxing Games",
    slug: "relaxing",
    description: "Gentle, calming interactive experiences designed to relieve tension and melt away stress.",
    iconName: "Sparkles",
    color: "#7856E8",
    bgGradient: "from-purple-500/10 via-purple-500/5 to-transparent",
    accentColor: "border-purple-300 text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  },
  {
    id: "fidget-toys",
    name: "Fidget Toys",
    slug: "fidget-toys",
    description: "Satisfying tactile digital toys to keep restless fingers busy and minds focused.",
    iconName: "HandMetal",
    color: "#FF7777",
    bgGradient: "from-coral-500/10 via-coral-500/5 to-transparent",
    accentColor: "border-coral-300 text-coral-600 bg-coral-50 dark:bg-coral-950/40 dark:text-coral-300 dark:border-coral-800",
  },
  {
    id: "puzzle",
    name: "Puzzle Games",
    slug: "puzzle",
    description: "Smart, stimulating brain teasers and spatial logic games with zero stress.",
    iconName: "Puzzle",
    color: "#5BC0EB",
    bgGradient: "from-sky-500/10 via-sky-500/5 to-transparent",
    accentColor: "border-sky-300 text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
  },
  {
    id: "creative",
    name: "Creative Games",
    slug: "creative",
    description: "Expressive sand art, mandalas, and doodle pads to unlock your artistic side.",
    iconName: "Palette",
    color: "#FFD66B",
    bgGradient: "from-yellow-500/10 via-yellow-500/5 to-transparent",
    accentColor: "border-yellow-300 text-yellow-700 bg-yellow-50 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800",
  },
  {
    id: "arcade",
    name: "Arcade Games",
    slug: "arcade",
    description: "Quick, fun, and responsive casual games that anyone can pick up and enjoy immediately.",
    iconName: "Gamepad2",
    color: "#4ECCA3",
    bgGradient: "from-mint-500/10 via-mint-500/5 to-transparent",
    accentColor: "border-mint-300 text-mint-700 bg-mint-50 dark:bg-mint-950/40 dark:text-mint-300 dark:border-mint-800",
  },
  {
    id: "brain",
    name: "Brain Games",
    slug: "brain",
    description: "Memory, sequence, and pattern games crafted to give your memory and brain a healthy workout.",
    iconName: "Brain",
    color: "#987AEE",
    bgGradient: "from-purple-400/10 via-purple-400/5 to-transparent",
    accentColor: "border-purple-300 text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  },
  {
    id: "drawing",
    name: "Drawing & Coloring",
    slug: "drawing",
    description: "Endless digital canvases with vibrant brushes, symmetrical mandalas, and tranquil sand rakes.",
    iconName: "Brush",
    color: "#FF9E9E",
    bgGradient: "from-coral-400/10 via-coral-400/5 to-transparent",
    accentColor: "border-coral-300 text-coral-600 bg-coral-50 dark:bg-coral-950/40 dark:text-coral-300 dark:border-coral-800",
  },
  {
    id: "sound-relaxation",
    name: "Sound & Relaxation",
    slug: "sound-relaxation",
    description: "Mindful breathing guides, soothing ambient weather soundscapes, and calming auditory bliss.",
    iconName: "Headphones",
    color: "#4ECCA3",
    bgGradient: "from-mint-400/10 via-mint-400/5 to-transparent",
    accentColor: "border-mint-300 text-mint-700 bg-mint-50 dark:bg-mint-950/40 dark:text-mint-300 dark:border-mint-800",
  },
];
