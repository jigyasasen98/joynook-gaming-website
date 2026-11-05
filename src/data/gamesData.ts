export interface GameItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  secondaryCategories: string[];
  shortDescription: string;
  fullDescription: string;
  instructions: string[];
  howToPlay: string;
  features: string[];
  controls: {
    desktop: string;
    mobile: string;
  };
  rating: number;
  playsCount: number;
  isFeatured: boolean;
  isPopular: boolean;
  isRecent: boolean;
  themeColor: string;
  thumbnailBg: string;
  thumbnailEmoji: string;
  badge?: string;
}

export const GAMES: GameItem[] = [
  // 1. Bubble Pop
  {
    id: "bubble-pop",
    slug: "bubble-pop",
    title: "Bubble Pop",
    category: "relaxing",
    categoryName: "Satisfying Games",
    secondaryCategories: ["arcade", "fidget-toys"],
    shortDescription: "Float, hover, and pop colorful pastel bubbles with satisfying physics and sound effects.",
    fullDescription: "Immerse yourself in a soothing ocean of colorful floating bubbles. Gently glide your cursor or tap your screen to pop bubbles with realistic acoustic pops, cheerful particle bursts, and rewarding combos. Choose between a calming Zen Freeplay or a timed Bubble Rush challenge.",
    instructions: [
      "Click or tap on any floating bubble to pop it instantly.",
      "Pop consecutive bubbles quickly to build up your Pop Streak combo multiplier.",
      "Watch out for shimmering Golden Bubbles for bonus score!",
      "Toggle Zen mode for endless popping without timers or pressure.",
    ],
    howToPlay: "Use your mouse or finger to tap and pop as many floating bubbles as you can. No rush, no stress—just pure popping satisfaction.",
    features: [
      "Procedural acoustic pop sound synthesis",
      "Dynamic bubble physics and floating particles",
      "Zen Freeplay and Timed Rush modes",
      "Streak combo multiplier with celebration confetti",
      "Full touch & mouse support",
    ],
    controls: {
      desktop: "Click or drag mouse over bubbles",
      mobile: "Tap bubbles with your finger",
    },
    rating: 4.9,
    playsCount: 142300,
    isFeatured: true,
    isPopular: true,
    isRecent: false,
    themeColor: "#7856E8",
    thumbnailBg: "from-purple-400 to-indigo-500",
    thumbnailEmoji: "🫧",
    badge: "Trending",
  },

  // 2. Color Sort
  {
    id: "color-sort",
    slug: "color-sort",
    title: "Color Sort Puzzle",
    category: "puzzle",
    categoryName: "Satisfying Games",
    secondaryCategories: ["relaxing", "brain"],
    shortDescription: "Sort vibrant liquids between glass test tubes until each tube contains a single solid color.",
    fullDescription: "A tranquil yet intellectually stimulating liquid sorting puzzle. Pour colors from tube to tube until all matching shades are unified. Featuring multiple difficulty tiers, fluid pouring animations, unlimited undos, and calming liquid audio.",
    instructions: [
      "Tap a tube to select it, then tap another tube to pour liquid.",
      "You can only pour if the receiving tube has room and the top colors match (or the receiving tube is empty).",
      "Sort all test tubes until every tube holds a single matching hue.",
      "Use the Undo button anytime to take back a move.",
    ],
    howToPlay: "Tap to select a tube and tap another to pour. Group identical colored layers into their own separate vials.",
    features: [
      "10+ hand-crafted puzzle levels with escalating depth",
      "Liquid wave physics and pouring sound effects",
      "Unlimited Undo & Restart options",
      "Victory confetti & level progression save",
    ],
    controls: {
      desktop: "Click tubes to select & pour",
      mobile: "Tap tubes to select & pour",
    },
    rating: 4.8,
    playsCount: 98400,
    isFeatured: true,
    isPopular: true,
    isRecent: false,
    themeColor: "#FF7777",
    thumbnailBg: "from-coral-400 to-pink-500",
    thumbnailEmoji: "🧪",
    badge: "Most Loved",
  },

  // 3. Balloon Pop
  {
    id: "balloon-pop",
    slug: "balloon-pop",
    title: "Balloon Pop",
    category: "arcade",
    categoryName: "Satisfying Games",
    secondaryCategories: ["relaxing"],
    shortDescription: "Catch and pop colorful balloons floating up into the sky before they drift away.",
    fullDescription: "A lively, uplifting arcade challenge where vivid party balloons ascend across a bright sky. Test your reflexes by popping normal, rainbow, and star balloons while avoiding tricky spiky balloons. Great for quick pauses and reflex warmups.",
    instructions: [
      "Tap or click balloons as they rise from the bottom of the screen.",
      "Regular balloons award +10 points.",
      "Golden balloons award +50 points and slow down time temporarily.",
      "Avoid clicking spiky black balloons or you lose a life!",
      "Aim for the highest score within the 60-second round.",
    ],
    howToPlay: "Click or tap ascending balloons before they escape the top edge. Build combos for peak scores.",
    features: [
      "Rapid-fire bursting animations and popping audio",
      "Special balloon types with power-ups (Slow-Mo, Mega-Pop)",
      "High score tracking saved to your browser",
      "Smooth canvas scaling for all screen sizes",
    ],
    controls: {
      desktop: "Click balloons with mouse",
      mobile: "Tap balloons with finger",
    },
    rating: 4.7,
    playsCount: 84100,
    isFeatured: false,
    isPopular: true,
    isRecent: false,
    themeColor: "#FFD66B",
    thumbnailBg: "from-yellow-400 to-amber-500",
    thumbnailEmoji: "🎈",
  },

  // 4. Color Flood
  {
    id: "color-flood",
    slug: "color-flood",
    title: "Color Flood",
    category: "puzzle",
    categoryName: "Satisfying Games",
    secondaryCategories: ["brain"],
    shortDescription: "Flood the entire mosaic grid with a single unified color within limited tactical moves.",
    fullDescription: "An addictive color-conquest puzzle! Starting from the top-left tile, choose colors to flood adjacent matching tiles. Expand your territory strategically across the grid to unite all squares before your turns expire.",
    instructions: [
      "Look at the color palette buttons at the bottom.",
      "Click a color to flood your growing territory from the top-left corner.",
      "All adjoining tiles of the selected color will merge into your domain.",
      "Flood the entire board within the allotted move counter to win!",
    ],
    howToPlay: "Click color buttons below the board to conquer adjacent tiles and flood the grid in fewer moves than the threshold.",
    features: [
      "Three grid sizes: Casual (10x10), Classic (14x14), Expert (18x18)",
      "Move efficiency score calculator & stars rating",
      "Randomized solvable seed boards",
      "Satisfying cascade color-spread animation",
    ],
    controls: {
      desktop: "Click color swatches or press 1-6 keys",
      mobile: "Tap color swatches",
    },
    rating: 4.9,
    playsCount: 112000,
    isFeatured: true,
    isPopular: true,
    isRecent: false,
    themeColor: "#4ECCA3",
    thumbnailBg: "from-mint-400 to-teal-500",
    thumbnailEmoji: "🎨",
    badge: "Editor's Pick",
  },

  // 5. Virtual Bubble Wrap
  {
    id: "virtual-bubble-wrap",
    slug: "virtual-bubble-wrap",
    title: "Virtual Bubble Wrap",
    category: "fidget-toys",
    categoryName: "Fidget Toys",
    secondaryCategories: ["relaxing"],
    shortDescription: "An infinite digital sheet of bubble wrap you can pop with realistic tactile clicks and haptics.",
    fullDescription: "Experience the timeless joy of popping bubble wrap without wasting plastic. Click single bubbles or drag across rows for satisfying continuous rapid-fire snaps. Features realistic bubble depression physics, endless sheets, and pop counters.",
    instructions: [
      "Click or press any bubble to depress and pop it.",
      "Hold down and drag across multiple bubbles for rapid multi-pop satisfaction.",
      "Track your total lifetime pops on the counter.",
      "Hit 'New Sheet' to roll out fresh, un-popped bubbles.",
    ],
    howToPlay: "Click or swipe across the bubbles to pop them. Unroll a fresh sheet anytime you need more.",
    features: [
      "Multi-pop drag interaction (mouse drag & touch swipe)",
      "Realistic visual depression and tactile snap audio",
      "Persistent lifetime pop counter",
      "Endless unroll mode",
    ],
    controls: {
      desktop: "Click or hold & drag across bubbles",
      mobile: "Tap or swipe across bubbles",
    },
    rating: 4.9,
    playsCount: 220500,
    isFeatured: true,
    isPopular: true,
    isRecent: false,
    themeColor: "#5BC0EB",
    thumbnailBg: "from-sky-400 to-blue-500",
    thumbnailEmoji: "🔘",
    badge: "Top Fidget",
  },

  // 6. ASMR Tap
  {
    id: "asmr-tap",
    slug: "asmr-tap",
    title: "ASMR Tap Sanctuary",
    category: "fidget-toys",
    categoryName: "Fidget Toys",
    secondaryCategories: ["sound-relaxation"],
    shortDescription: "Tap interactive surfaces crafted with realistic mechanical, wooden, water, and metal acoustic textures.",
    fullDescription: "A soothing sound-tactile playground designed to trigger tingling ASMR relaxation. Tap between mechanical keyboard switches, smooth polished hardwood, tranquil raindrops, and singing metallic chimes.",
    instructions: [
      "Select an acoustic material tab: Mechanical, Wood, Water, Metal, or Pop.",
      "Tap anywhere on the pads to trigger soothing sound textures and visual ripples.",
      "Experiment with rhythmic tapping or rapid patterns.",
      "Adjust reverb and resonance sliders to customize your acoustic sanctuary.",
    ],
    howToPlay: "Tap buttons and tactile pads to listen to crisp ASMR acoustics. Switch pads to explore diverse textures.",
    features: [
      "5 distinct procedural acoustic materials (Mechanical, Wood, Water, Metal, Pop-It)",
      "Fluid ripple animations and pressure dynamics",
      "Acoustic pitch randomized per tap for organic realism",
      "Headphone-optimized stereo spatialization",
    ],
    controls: {
      desktop: "Click pads or use keys A, S, D, F, Space",
      mobile: "Tap pads with one or multiple fingers",
    },
    rating: 4.8,
    playsCount: 93400,
    isFeatured: false,
    isPopular: true,
    isRecent: true,
    themeColor: "#FF7777",
    thumbnailBg: "from-coral-400 to-rose-500",
    thumbnailEmoji: "🎧",
    badge: "New",
  },

  // 7. Digital Squishy Toy
  {
    id: "digital-squishy-toy",
    slug: "digital-squishy-toy",
    title: "Digital Squishy Toy",
    category: "fidget-toys",
    categoryName: "Fidget Toys",
    secondaryCategories: ["relaxing"],
    shortDescription: "Poke, squeeze, drag, and squish an adorable jelly creature with elastic spring physics.",
    fullDescription: "Meet 'Bloop'—a friendly digital jelly squishy toy who loves being pinched, stretched, dragged, and squeezed! Built with a real-time soft-body physics engine, Bloop stretches elastically, jiggles upon release, and blinks with expressive cartoon eyes that track your cursor.",
    instructions: [
      "Click/tap and drag on Bloop to stretch and deform its soft jelly body.",
      "Release your mouse or finger to watch Bloop snap back with a bouncy jiggle.",
      "Rapidly tap or poke Bloop to hear squishy sounds.",
      "Change Bloop's color and expressions using the customization bar.",
    ],
    howToPlay: "Click and drag Bloop to stretch and squish. Let go to see the satisfying elastic bounce.",
    features: [
      "Real-time soft-body spring deformation physics",
      "Interactive eyes that gaze towards your pointer",
      "Satisfying cartoon squish and boing sound effects",
      "Customizable jelly colors and cute face expressions",
    ],
    controls: {
      desktop: "Click & drag with mouse to stretch",
      mobile: "Touch & drag with finger to squish",
    },
    rating: 4.9,
    playsCount: 165000,
    isFeatured: true,
    isPopular: true,
    isRecent: false,
    themeColor: "#7856E8",
    thumbnailBg: "from-purple-400 to-pink-500",
    thumbnailEmoji: "🍮",
    badge: "Viral Hit",
  },

  // 8. Peel the Tape
  {
    id: "peel-the-tape",
    slug: "peel-the-tape",
    title: "Peel the Tape",
    category: "fidget-toys",
    categoryName: "Fidget Toys",
    secondaryCategories: ["relaxing"],
    shortDescription: "Slowly drag and peel layers of sticky decorative washi tape with crisp tactile peeling sounds.",
    fullDescription: "Nothing soothes an anxious mind quite like peeling off sticky tape in one smooth, uninterrupted motion. Grip tape tabs, pull along the angle of adhesion, and listen to the crisp crinkle of adhesive lifting from the surface.",
    instructions: [
      "Click and hold the loose edge or tab of a tape strip.",
      "Slowly drag backwards along the strip to peel it off the board.",
      "Maintain a steady pace for the most satisfying acoustic tear.",
      "Peel all layered strips and cute stickers to complete each board.",
    ],
    howToPlay: "Drag the edge of each tape strip to smoothly peel it away from the surface.",
    features: [
      "Procedural sticky adhesive friction sound synthesis",
      "Realistic mesh deformation and peeling curl",
      "Vibrant washi tape patterns and cute sticker designs",
      "Multi-layered peeling challenges with unlimited replay",
    ],
    controls: {
      desktop: "Click edge & drag backwards",
      mobile: "Touch tab & drag backwards",
    },
    rating: 4.8,
    playsCount: 88200,
    isFeatured: false,
    isPopular: false,
    isRecent: true,
    themeColor: "#FFD66B",
    thumbnailBg: "from-amber-400 to-yellow-500",
    thumbnailEmoji: "🩹",
    badge: "Satisfying",
  },

  // 9. Sliding Puzzle
  {
    id: "sliding-puzzle",
    slug: "sliding-puzzle",
    title: "Classic Sliding Puzzle",
    category: "puzzle",
    categoryName: "Puzzle Games",
    secondaryCategories: ["brain"],
    shortDescription: "Slide numbered tiles into numerical order across 3x3, 4x4, and 5x5 grids.",
    fullDescription: "The legendary 15-puzzle reimagined with sleek modern aesthetics. Slide tiles into the empty space to arrange numbers in ascending sequence. Every generated shuffle is mathematically proven solvable.",
    instructions: [
      "Click or tap any tile adjacent to the empty slot to slide it into that space.",
      "Reorder the numbers from 1 to 8 (in 3x3) or 1 to 15 (in 4x4).",
      "Watch your moves and elapsed timer in the top bar.",
      "Switch grid dimensions between 3x3 (Quick), 4x4 (Classic), and 5x5 (Master).",
    ],
    howToPlay: "Tap tiles next to the blank space to slide them into sequential order.",
    features: [
      "Multiple grid dimensions: 3x3, 4x4, and 5x5",
      "Guaranteed mathematically solvable shuffle algorithm",
      "Move counter and high score stopwatch",
      "Number and pastel gradient tile modes",
    ],
    controls: {
      desktop: "Click tiles or use Arrow keys",
      mobile: "Tap tiles adjacent to empty space",
    },
    rating: 4.8,
    playsCount: 104200,
    isFeatured: false,
    isPopular: true,
    isRecent: false,
    themeColor: "#4ECCA3",
    thumbnailBg: "from-teal-400 to-mint-500",
    thumbnailEmoji: "🔢",
  },

  // 10. Memory Match
  {
    id: "memory-match",
    slug: "memory-match",
    title: "Memory Match Quest",
    category: "puzzle",
    categoryName: "Puzzle Games",
    secondaryCategories: ["brain"],
    shortDescription: "Flip over cards and discover matching pairs in this delightful visual memory trainer.",
    fullDescription: "Exercise your concentration, working memory, and focus with adorable icon cards. Flip two cards at a time to find twin symbols. Features three difficulty sizes and multiple charming icon sets.",
    instructions: [
      "Click any card to flip it over and reveal its icon.",
      "Click a second card to see if it matches the first.",
      "If they match, they remain open. If not, they flip back down.",
      "Match all card pairs in the fewest flips and shortest time possible.",
    ],
    howToPlay: "Tap cards to flip them and uncover matching pairs. Remember positions to clear the board quickly.",
    features: [
      "Three difficulty modes: Easy (12 cards), Medium (16 cards), Hard (24 cards)",
      "Three visual themes: Nature, Space, and Sweet Treats",
      "Flip counter, timer, and star ratings",
      "Card flip acoustic effects and victory celebration",
    ],
    controls: {
      desktop: "Click cards to flip",
      mobile: "Tap cards to flip",
    },
    rating: 4.9,
    playsCount: 135000,
    isFeatured: true,
    isPopular: true,
    isRecent: false,
    themeColor: "#7856E8",
    thumbnailBg: "from-purple-400 to-violet-500",
    thumbnailEmoji: "🃏",
  },

  // 11. 2048 Game
  {
    id: "2048",
    slug: "2048",
    title: "2048 Classic",
    category: "puzzle",
    categoryName: "Puzzle Games",
    secondaryCategories: ["brain", "arcade"],
    shortDescription: "Merge matching numbered tiles to reach the legendary 2048 tile and beyond.",
    fullDescription: "The world-famous number merging puzzle built with buttery-smooth sliding animations and full responsive touch swipe support. Slide matching tiles together to double their values—2 merges into 4, 4 into 8, until you create 2048!",
    instructions: [
      "Swipe or use arrow keys to slide all tiles in that direction.",
      "When two tiles with the same number touch, they merge into one!",
      "A new tile (2 or 4) spawns after every valid move.",
      "Create the 2048 tile to win, and keep playing to chase the highest score!",
    ],
    howToPlay: "Use arrow keys or swipe to move tiles. Combine matching numbers to reach 2048.",
    features: [
      "Responsive keyboard arrows & touch swipe gestures",
      "Smooth tile merge and spawn animations",
      "Live score & persistent Best Score tracking",
      "Undo move option & Keep Playing after 2048",
    ],
    controls: {
      desktop: "Arrow keys (Up, Down, Left, Right) or W, A, S, D",
      mobile: "Swipe in any direction",
    },
    rating: 4.9,
    playsCount: 295000,
    isFeatured: true,
    isPopular: true,
    isRecent: false,
    themeColor: "#FFD66B",
    thumbnailBg: "from-amber-400 to-orange-500",
    thumbnailEmoji: "✨",
    badge: "All-Time Best",
  },

  // 12. Tic Tac Toe
  {
    id: "tic-tac-toe",
    slug: "tic-tac-toe",
    title: "Tic Tac Toe Pro",
    category: "puzzle",
    categoryName: "Puzzle Games",
    secondaryCategories: ["arcade"],
    shortDescription: "Play the timeless X and O strategy game against a smart AI or challenge a friend locally.",
    fullDescription: "A stylish, beautifully animated rendition of the classic 3x3 grid battle. Play solo against an AI with multiple intelligence levels (Casual, Balanced, and Unbeatable Minimax) or share the screen for two-player pass-and-play.",
    instructions: [
      "Choose your game mode: 1 Player (vs Computer) or 2 Players (Local).",
      "Player 1 marks X, Player 2 or Computer marks O.",
      "First to connect 3 marks in a horizontal, vertical, or diagonal line wins!",
      "If all 9 squares fill up with no winner, the game is a draw.",
    ],
    howToPlay: "Click any open cell to place your mark. Connect 3 in a line to triumph.",
    features: [
      "Smart AI with Easy, Medium, and Unbeatable (Minimax) settings",
      "2-Player Pass & Play mode for friends",
      "Animated winning line highlight and win streaks",
      "Sound effects and instant rematch button",
    ],
    controls: {
      desktop: "Click any empty square",
      mobile: "Tap any empty square",
    },
    rating: 4.7,
    playsCount: 91000,
    isFeatured: false,
    isPopular: true,
    isRecent: false,
    themeColor: "#FF7777",
    thumbnailBg: "from-coral-400 to-red-400",
    thumbnailEmoji: "⭕",
  },

  // 13. Digital Mandala Creator
  {
    id: "mandala-creator",
    slug: "mandala-creator",
    title: "Digital Mandala Creator",
    category: "creative",
    categoryName: "Creative Games",
    secondaryCategories: ["drawing", "relaxing"],
    shortDescription: "Draw mesmerizing radial kaleidoscope mandalas with symmetrical reflections and export to PNG.",
    fullDescription: "Unleash your inner artist with meditative kaleidoscope symmetry. Every stroke you draw is automatically mirrored across 4, 6, 8, 12, or 16 radial axes simultaneously. Pick neon and pastel colors, adjust line weights, and export your masterpiece in crisp high-resolution PNG.",
    instructions: [
      "Select your desired symmetry count (4, 6, 8, 12, or 16 axes).",
      "Pick a color from the palette or use the Rainbow auto-cycle brush.",
      "Click and drag across the canvas to draw intricate radial patterns.",
      "Use Undo to step back, or click 'Export PNG' to save your artwork to your device.",
    ],
    howToPlay: "Draw on the canvas and watch your strokes mirror around the center in hypnotic symmetry.",
    features: [
      "Customizable radial axes (4, 6, 8, 12, 16 segments) + Mirror mode",
      "Rainbow dynamic gradient brush mode",
      "Brush stroke size and opacity controls",
      "Multi-step Undo & Clear Canvas",
      "Instant 1-click HD PNG Artwork Download",
    ],
    controls: {
      desktop: "Click & drag with mouse to draw",
      mobile: "Touch & drag with finger to draw",
    },
    rating: 4.9,
    playsCount: 118400,
    isFeatured: true,
    isPopular: true,
    isRecent: false,
    themeColor: "#987AEE",
    thumbnailBg: "from-indigo-400 to-purple-600",
    thumbnailEmoji: "☸️",
    badge: "Creative",
  },

  // 14. Zen Sand Art
  {
    id: "zen-sand-art",
    slug: "zen-sand-art",
    title: "Zen Sand Garden",
    category: "creative",
    categoryName: "Creative Games",
    secondaryCategories: ["relaxing", "drawing"],
    shortDescription: "Rake tranquil wave patterns in digital Japanese zen garden sand and place soothing pebbles.",
    fullDescription: "Recreate the peaceful contemplation of a Kyoto Zen temple dry rock garden (karesansui). Rake delicate grooves, water ripples, and concentric rings into textured sand. Place river stones and smooth pebbles to create your personal oasis of serenity.",
    instructions: [
      "Choose a rake tool: Fine Comb, Wide Rake, or Concentric Ripple.",
      "Drag across the sand bed to carve gentle meditative grooves.",
      "Select 'Place Stone' to drop natural river pebbles onto your sand garden.",
      "Switch sand tones between Golden Beach, White Quartz, and Volcanic Ash.",
    ],
    howToPlay: "Rake through the sand with your mouse or finger to craft peaceful ripple patterns.",
    features: [
      "Realistic sand groove shading and texture rendering",
      "Multi-tine wooden rake brushes (3, 5, and 7 prongs)",
      "Interactive river stones and pebbles you can position",
      "Soft sandy raking sound synthesis",
      "Reset & smooth sand feature",
    ],
    controls: {
      desktop: "Click & drag to rake sand",
      mobile: "Touch & drag to rake sand",
    },
    rating: 4.8,
    playsCount: 77900,
    isFeatured: false,
    isPopular: false,
    isRecent: true,
    themeColor: "#FFD66B",
    thumbnailBg: "from-yellow-300 to-amber-400",
    thumbnailEmoji: "🏜️",
    badge: "Zen",
  },

  // 15. Zen Doodle
  {
    id: "zen-doodle",
    slug: "zen-doodle",
    title: "Zen Doodle Pad",
    category: "creative",
    categoryName: "Creative Games",
    secondaryCategories: ["drawing", "relaxing"],
    shortDescription: "A minimalist, distraction-free sketchbook with luminous neon, pastel, and ink brushes.",
    fullDescription: "Let your mind wander freely on an expansive, velvety sketchbook. Featuring smooth pressure-sensitive calligraphy lines, glowing neon pens, soothing pastel watercolors, full undo history, and instant image export.",
    instructions: [
      "Select your favorite brush: Smooth Ink, Neon Glow, or Pastel Watercolor.",
      "Choose from curated relaxing color palettes or custom color picker.",
      "Adjust stroke size with the thickness slider.",
      "Draw freely without rules, guidelines, or judgment.",
      "Export your doodle to PNG or clear the canvas to start fresh.",
    ],
    howToPlay: "Select a brush and sketch freely. Download your drawings anytime.",
    features: [
      "Smooth bezier curve smoothing for clean strokes",
      "Neon Glow, Ink Pen, and Soft Watercolor brushes",
      "Full Undo / Redo history stack",
      "High-resolution PNG image download",
    ],
    controls: {
      desktop: "Click & drag with mouse or stylus",
      mobile: "Touch & draw with finger",
    },
    rating: 4.8,
    playsCount: 82000,
    isFeatured: false,
    isPopular: false,
    isRecent: false,
    themeColor: "#4ECCA3",
    thumbnailBg: "from-mint-400 to-emerald-500",
    thumbnailEmoji: "🖌️",
  },

  // 16. Breathing Exercise
  {
    id: "breathing-exercise",
    slug: "breathing-exercise",
    title: "Mindful Breathing Sanctuary",
    category: "sound-relaxation",
    categoryName: "Relaxation Tools",
    secondaryCategories: ["relaxing"],
    shortDescription: "Calm your nervous system with guided visual breathwork, gentle chimes, and pacing timers.",
    fullDescription: "Take a science-backed mindful pause. Follow an expanding and contracting glowing lotus circle with gentle text cues to synchronize your breath. Choose from Box Breathing (4-4-4-4 for focus), 4-7-8 Relaxation (for sleep and stress relief), and Deep Calm (4-6 pacing).",
    instructions: [
      "Choose your preferred breathwork protocol: Box Breathing, 4-7-8, or Deep Calm.",
      "Set your session length (1, 2, 5, or 10 minutes).",
      "Press Start and synchronize your breath with the expanding/contracting ring.",
      "Inhale through your nose as the circle grows, hold, and gently exhale as it shrinks.",
    ],
    howToPlay: "Breathe in as the circle expands, hold when indicated, and exhale smoothly as it contracts.",
    features: [
      "3 scientifically supported breathing patterns (Box, 4-7-8, Deep Calm)",
      "Soothing Tibetan singing bowl audio cues for phase transitions",
      "Completed breath cycles counter & session timer",
      "Minimalist dark / light visual aesthetic",
    ],
    controls: {
      desktop: "Click Start / Pause / Mode buttons",
      mobile: "Tap controls with your finger",
    },
    rating: 5.0,
    playsCount: 178000,
    isFeatured: true,
    isPopular: true,
    isRecent: false,
    themeColor: "#5BC0EB",
    thumbnailBg: "from-cyan-400 to-blue-500",
    thumbnailEmoji: "🧘",
    badge: "Mindful",
  },

  // 17. Rain Sound
  {
    id: "rain-sound",
    slug: "rain-sound",
    title: "Rain & Storm Ambience",
    category: "sound-relaxation",
    categoryName: "Relaxation Tools",
    secondaryCategories: ["relaxing"],
    shortDescription: "Customizable procedural ambient weather generator with rain, thunder, wind, and campfire.",
    fullDescription: "Your personal cozy rainy window. Mix and blend continuous procedural soundscapes including gentle rainfall, distant rumbling thunder, whispering wind, and crackling campfire. Accompanied by a realistic canvas of raindrops trickling down glass.",
    instructions: [
      "Click the Master Play button to activate the soundscape.",
      "Adjust individual volume sliders for Rain, Thunder, Wind, and Campfire.",
      "Click the 'Trigger Thunder' button anytime for an immediate realistic rumble.",
      "Toggle Raindrop Window animation or full Zen minimalism.",
    ],
    howToPlay: "Press Play and customize the volume sliders to sculpt your dream cozy weather ambience.",
    features: [
      "100% procedural Web Audio generator (no looping audio seams)",
      "Independent volume faders for Rain, Wind, Thunder, and Fire",
      "Dynamic interactive raindrops canvas on window glass",
      "Lightning flash visual effect synchronized with thunder",
      "Sleep timer (15, 30, 45, 60 minutes)",
    ],
    controls: {
      desktop: "Click sliders & buttons with mouse",
      mobile: "Tap and drag sliders with finger",
    },
    rating: 4.9,
    playsCount: 147500,
    isFeatured: true,
    isPopular: true,
    isRecent: false,
    themeColor: "#7856E8",
    thumbnailBg: "from-blue-500 to-indigo-700",
    thumbnailEmoji: "🌧️",
    badge: "Cozy",
  },

  // 18. Magic 8 Ball
  {
    id: "magic-8-ball",
    slug: "magic-8-ball",
    title: "Mystic 8-Ball",
    category: "sound-relaxation",
    categoryName: "Relaxation Tools",
    secondaryCategories: ["arcade"],
    shortDescription: "Ask any question, shake the mystical 3D ball, and reveal randomized cosmic answers.",
    fullDescription: "Seek whimsical guidance from the cosmos! Think of a yes-or-no question, click or shake your device, and watch the liquid swirl inside the window until a glowing blue triangle reveals your destiny. Complete with 20 classic and uplifting responses.",
    instructions: [
      "Think of a question that can be answered with Yes or No.",
      "Type your question in the box or simply hold it in your mind.",
      "Click the ball, press the 'Shake' button, or physically shake your mobile phone.",
      "Watch the fluid swirl and reveal your fate!",
    ],
    howToPlay: "Type a question or ask aloud, then shake the 8-ball to reveal the answer.",
    features: [
      "Realistic 3D sphere depth and liquid swirling animations",
      "20+ authentic and encouraging answers",
      "Device motion shake detection on mobile",
      "Mystical reveal sound effects",
      "History log of recent questions and answers",
    ],
    controls: {
      desktop: "Click 8-ball or click Shake button",
      mobile: "Tap 8-ball or shake device",
    },
    rating: 4.7,
    playsCount: 69200,
    isFeatured: false,
    isPopular: false,
    isRecent: true,
    themeColor: "#987AEE",
    thumbnailBg: "from-purple-900 to-slate-900",
    thumbnailEmoji: "🎱",
    badge: "Fun",
  },
];

export function getGameBySlug(slug: string): GameItem | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function getGamesByCategory(categorySlug: string): GameItem[] {
  return GAMES.filter(
    (g) => g.category === categorySlug || g.secondaryCategories.includes(categorySlug)
  );
}

export function getRelatedGames(currentSlug: string, count: number = 4): GameItem[] {
  const current = getGameBySlug(currentSlug);
  if (!current) return GAMES.slice(0, count);

  const sameCategory = GAMES.filter(
    (g) => g.slug !== currentSlug && (g.category === current.category || g.secondaryCategories.includes(current.category))
  );

  if (sameCategory.length >= count) {
    return sameCategory.slice(0, count);
  }

  const others = GAMES.filter(
    (g) => g.slug !== currentSlug && !sameCategory.some((sc) => sc.slug === g.slug)
  );

  return [...sameCategory, ...others].slice(0, count);
}
