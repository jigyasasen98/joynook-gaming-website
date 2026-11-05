# 🎮 JoyNook — Free Online Games & Relaxation Sanctuary

> **Play, Relax & Have Fun!**  
> A complete, modern, responsive browser gaming platform inspired by mindful, satisfying play. Free to play directly in your browser with **zero mandatory logins, zero downloads, and zero paywalls**.

![JoyNook Banner](https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Key Platform Features

- 🕹️ **18 Playable Games & Tools**: Fully functional HTML5 Canvas and React games, not static mockups.
- 📱 **Every Screen Size Supported**: Native responsive UI across mobile smartphones (iOS & Android), iPads & tablets, laptops, and 4K desktop screens.
- 🎧 **Zero-Asset Procedural Audio Synthesizer**: Uses the Web Audio API to synthesize acoustic bubble pops, wood blocks, keyboard clicks, rain, thunder rumbles, and singing chimes with 0ms latency and 0% risk of missing audio assets.
- 🌙 **Dark & Light Mode**: Seamless theme switcher that respects system preferences and persists user choice.
- 💖 **LocalStorage Favorites & High Scores**: Save favorite games and high scores (2048, Balloon Pop, Bubble Wrap lifetime counter) directly to the browser.
- 🔍 **Real-Time Instant Search & Category Filtering**: Search across games by keyword, sort by popularity, rating, or recently added.
- 🚀 **SEO & Performance Optimized**: SSG pre-rendering for all 38 pages, dynamic `sitemap.xml`, `robots.txt`, OpenGraph metadata, and Schema.org structured data.

---

## 🎲 The 18 Playable Games

### 1. Satisfying Games
1. **Bubble Pop (`/games/bubble-pop`)**: Floating pastel bubbles with physics, golden bubbles, pop streaks, and Zen vs. Timed Rush modes.
2. **Color Sort Puzzle (`/games/color-sort`)**: Fluid sorting puzzle between glass test tubes with multi-levels, realistic pouring animations, and unlimited undo.
3. **Balloon Pop (`/games/balloon-pop`)**: Ascending balloons challenge with score counters, combos, 3 lives, golden bonuses, and spiky hazard balloons.
4. **Color Flood (`/games/color-flood`)**: Flood-it mosaic puzzle in 10x10 and 14x14 grid sizes with move counter and color wave animations.

### 2. Fidget Toys
5. **Virtual Bubble Wrap (`/games/virtual-bubble-wrap`)**: Tactile grid of bubbles with drag multi-popping, lifetime pop counters, and fresh sheet unrolling.
6. **ASMR Tap Sanctuary (`/games/asmr-tap`)**: 5 tactile surfaces (Mechanical Keyboard, Polished Hardwood, Water Droplet, Singing Bell, Pop-It) with keyboard controls (A, S, D, F, Space).
7. **Digital Squishy Toy (`/games/digital-squishy-toy`)**: "Bloop" jelly creature with soft-body spring deformation physics, cursor eye-tracking, and boing bounce.
8. **Peel the Tape (`/games/peel-the-tape`)**: Drag-to-peel decorative washi tape with peeling audio and curling mesh physics.

### 3. Puzzle Games
9. **Classic Sliding Puzzle (`/games/sliding-puzzle`)**: 15-puzzle with 3x3 and 4x4 sizes, solvable shuffle algorithm, move counter, and timer.
10. **Memory Match Quest (`/games/memory-match`)**: Twin-card matching game with 3 themes (Nature, Space, Sweets), card flip sounds, and star ratings.
11. **2048 Classic (`/games/2048`)**: Legendary number merging puzzle with arrow keys, touch swipe gestures, and high score tracking.
12. **Tic Tac Toe Pro (`/games/tic-tac-toe`)**: 1P vs. Smart AI (Easy or Minimax) and 2P Local pass-and-play with win streaks and animated strike lines.

### 4. Creative Games
13. **Digital Mandala Creator (`/games/mandala-creator`)**: Symmetrical radial kaleidoscope drawing (4, 6, 8, 12, 16 axes) with Rainbow brush and 1-click HD PNG export.
14. **Zen Sand Garden (`/games/zen-sand-art`)**: Japanese rock garden with 3-prong & 5-prong wooden rakes, water ripples, natural river stones, and 3 sand tones.
15. **Zen Doodle Pad (`/games/zen-doodle`)**: Sketchbook with Smooth Ink, Neon Glow, and Pastel Watercolor brushes, eraser, undo stack, and PNG export.

### 5. Relaxation Tools
16. **Mindful Breathing Sanctuary (`/games/breathing-exercise`)**: Box Breathing (4-4-4-4), 4-7-8 Relaxation, and Deep Calm (4-6) with expanding lotus ring and Tibetan bowl chimes.
17. **Rain & Storm Ambience (`/games/rain-sound`)**: Procedural weather audio synthesizer (Rain, Wind, Campfire) with raindrops trickling down glass and instant thunder lightning strikes.
18. **Mystic 8-Ball (`/games/magic-8-ball`)**: 3D-styled 8-ball with liquid swirl animation, mystical reveal audio, and 20+ encouraging cosmic answers.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS with custom pastel entertainment palette
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Audio Engine**: Procedural Web Audio API Synthesizer (Zero asset dependencies)
- **State Management**: React Hooks + LocalStorage Event Sync

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Run the production server**:
   ```bash
   npm run start
   ```

---

## 🌐 Public Deployment Guide

JoyNook is optimized for zero-config public deployment on **Vercel** or **Netlify**.

### Option A: Deploy to Vercel (Recommended)
1. Push this repository to your GitHub/GitLab account.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Framework Preset: **Next.js** (detected automatically).
5. Click **"Deploy"**.
6. Once deployed, you receive an instant live public URL (e.g. `https://joynook.vercel.app`).
7. **Custom Domain**: In Vercel Project Settings > Domains, enter your domain (e.g. `joynook.com`) and point DNS CNAME to `cname.vercel-dns.com`.

### Option B: Deploy to Netlify
1. Sign in to [Netlify](https://netlify.com) and click **"Add new site" > "Import an existing project"**.
2. Select your repository.
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Netlify will automatically install `@netlify/plugin-nextjs`.
6. Click **"Deploy"**.

---

## 📁 Project Architecture

```
Gaming website/
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root HTML, Header, Footer, font loading & theme script
│   │   ├── page.tsx                # Homepage (Hero, Featured, Categories, Popular, Recent, Why Us)
│   │   ├── globals.css             # Tailwind base, utilities, game-viewport touch styles
│   │   ├── sitemap.ts              # Dynamic XML Sitemap generator
│   │   ├── robots.ts               # Robots.txt crawler directives
│   │   ├── not-found.tsx           # Custom 404 page
│   │   ├── games/
│   │   │   ├── page.tsx            # All Games Directory (Search, filters, sort, favorites)
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Dedicated game page with controls, instructions, related games
│   │   ├── category/
│   │   │   └── [category]/
│   │   │       └── page.tsx        # Category collection page
│   │   ├── favorites/
│   │   │   └── page.tsx            # Saved favorites view
│   │   ├── about/page.tsx          # About JoyNook
│   │   ├── contact/page.tsx        # Contact form & FAQ
│   │   ├── privacy/page.tsx        # Privacy policy
│   │   └── terms/page.tsx          # Terms and conditions
│   ├── components/
│   │   ├── layout/                 # Header & Footer
│   │   ├── ui/                     # GameCard, GameControls
│   │   ├── home/                   # HeroSection, CategoryGrid, FeaturedSection, etc.
│   │   └── games/                  # 18 fully playable game components & GameRenderer
│   ├── data/
│   │   ├── gamesData.ts            # Single source of truth for 18 games
│   │   └── categoriesData.ts       # 8 game categories
│   ├── hooks/
│   │   ├── useFavorites.ts         # LocalStorage sync for favorites
│   │   └── useRecentGames.ts       # LocalStorage tracking for recently played
│   └── lib/
│       ├── soundEffects.ts         # Web Audio procedural sound synthesis
│       ├── soundSynth.ts           # Continuous ambient weather sound synthesizer
│       └── utils.ts                # General utilities
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📄 License

MIT License. Free to use, play, and expand!
