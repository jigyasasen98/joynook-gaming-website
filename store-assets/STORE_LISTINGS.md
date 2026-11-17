# JoyNook: App Store & Google Play Store Metadata & Listing Copy

This file provides complete, pre-formatted copy and configurations ready for submission to the **Google Play Console** and **Apple App Store Connect**.

---

## 1. Google Play Console Listing Details

| Field | Content | Character Count / Limit |
|---|---|---|
| **App Name** | `JoyNook: Calming Mini Games` | 27 / 30 chars |
| **Package Name (Application ID)** | `com.joynook.games` | Standard |
| **Short Description** | `Play 18+ free relaxing games, fidget toys, and soothing puzzles with zero ads.` | 79 / 80 chars |
| **Category** | Casual / Puzzle | - |
| **Tags** | Casual, Puzzle, Single Player, Stylized, Offline, Relaxing | - |
| **Content Rating (IARC)** | Everyone 3+ (PEGI 3) | - |

### Full Description (Google Play)
```markdown
Welcome to JoyNook — your tranquil digital sanctuary for mindful pauses, soothing sensory toys, and satisfying mini-games designed to ease stress and bring instant delight.

Whether you have two minutes between tasks or half an hour to unwind before bed, JoyNook lets you jump straight into the fun with zero mandatory sign-ups, zero intrusive full-screen ads, and zero friction.

✨ WHAT MAKES JOYNOOK SPECIAL:
• Instant Play: Tap any game and begin playing immediately.
• 18+ Handcrafted Experiences: From tactile fidget toys to clever logic puzzles.
• Calming Sensory Audio: Soothing procedural chimes, gentle water drops, and crisp bubble pops.
• Offline Ready: Play your favorite fidgets and brain workouts anywhere, even on airplane mode.
• Private by Design: No accounts or passwords. High scores and favorites stay safely on your device.

🎮 FEATURED GAMES & TOYS:
• Tactile & Fidgets: Virtual Bubble Wrap, Digital Squishy Toy, ASMR Tap Pads, Peel the Tape.
• Mindful & Calming: Zen Sand Art, Breathing Meditation Guide, Mandala Creator, Soothing Rain Sounds.
• Clever Puzzles: 2048 Zen Edition, Color Sort Water Tubes, Sliding Tile Puzzle, Color Flood.
• Quick Reflexes & Fun: Bubble Pop, Balloon Popper, Tic-Tac-Toe (vs AI or Friend), Magic 8-Ball.

Take a deep breath, pick a toy, and enjoy your peaceful moment with JoyNook!
```

### Google Play Data Safety Answers
- **Data Collection**: "No user data is collected" (Select "No" for all personal data, financial data, health data, identifiers, photos, audio, files).
- **Data Sharing**: "No user data is shared with third parties".
- **Security Practices**: Data transmitted over HTTPS (Vercel edge encryption).
- **Children's Policy**: Does the app target children? Select "Yes, families and children (Ages 6-8, 9-12, 13+)". Does not serve ads or collect personal info.

---

## 2. Apple App Store Connect Listing Details

| Field | Content | Character Count / Limit |
|---|---|---|
| **App Name** | `JoyNook - Relaxing Games` | 24 / 30 chars |
| **Subtitle** | `Calm Fidgets & Zen Puzzles` | 25 / 30 chars |
| **Bundle ID** | `com.joynook.games` | - |
| **SKU** | `JOYNOOK-001` | - |
| **Primary Category** | Games > Casual | - |
| **Secondary Category** | Games > Puzzle | - |
| **Keywords** | `fidget,relax,calm,puzzle,games,stress relief,bubble pop,2048,offline,zen,tap,satisfying,casual,toys` | 98 / 100 chars |
| **Support URL** | `https://joynook-gaming-website.vercel.app/contact` | - |
| **Marketing URL** | `https://joynook-gaming-website.vercel.app` | - |
| **Privacy Policy URL** | `https://joynook-gaming-website.vercel.app/privacy` | - |
| **Age Rating** | 4+ (No unrestricted web access, no user-generated content, no violence) | - |

### Promotional Text (App Store)
```text
Instant relaxation at your fingertips. Enjoy 18+ free tactile fidgets, mindful puzzles, and satisfying mini-games designed to ease stress anytime.
```

### Description (App Store)
```text
Step into JoyNook — an uplifting collection of mindful browser games, tactile fidget toys, and soothing sensory experiences crafted to help you unwind, recharge, and play whenever you need a mental break.

Designed with soft pastel visuals, relaxing procedural sound effects, and responsive haptic feedback, JoyNook is completely free with no mandatory account creation or intrusive popups.

EXPERIENCES INCLUDED:

TACTILE FIDGETS & ASMR
• Virtual Bubble Wrap: Satisfying snap pops with realistic audio and gentle haptics.
• Digital Squishy Toy: Elastic, squishy Bloop with bouncy physics and customizable hues.
• ASMR Tap Board: Crisp keyboard clacks, wooden blocks, water drops, and resonant bells.
• Peel the Tape: Smooth peeling mechanics designed for tactile decompression.

MINDFUL & RELAXING
• Zen Sand Art: Rake fluid geometric patterns into calming digital sand.
• Mandala Creator: Symmetrical kaleidoscopic drawing with vibrant rainbow palettes.
• Breathing Exercise Guide: Box breathing and 4-7-8 mindful pacing circles.
• Rain Sound Machine: Multi-layer ambient audio (light rain, distant thunder, gentle breeze).

PUZZLE & LOGIC CHALLENGES
• 2048 Zen Edition: Merge pastel number tiles smoothly with score records.
• Color Sort: Mind-bending liquid sorting puzzles with multiple difficulty tiers.
• Color Flood: Flood the board within move limits.
• Sliding Puzzle: Classic 3x3 and 4x4 sliding photo tile challenges.

INSTANT CASUAL FUN
• Balloon Pop: Quick reflex balloon popping with physics drift.
• Bubble Pop: Floating bubbles with golden bonus multipliers.
• Tic-Tac-Toe: Play solo against smart AI or pass-and-play with a friend.
• Magic 8-Ball: Shake for classic whimsical answers.

PRIVACY & SAFETY:
JoyNook does not collect or transmit your personal data. All favorites, preferences, and high scores stay safely on your device in LocalStorage.
```

### Apple App Privacy Nutrition Label
- Select: **"Data Not Collected"** (You do not collect data from this app).

---

## 3. Store Visual Asset Checklist

| Asset | Format | Dimensions | File Location |
|---|---|---|---|
| **Google Play App Icon** | 32-bit PNG, max 1MB | 512 x 512 px | `public/store-assets/google-play-icon-512x512.png` |
| **Google Play Feature Graphic** | JPEG or 24-bit PNG, max 15MB | 1024 x 500 px | `public/store-assets/google-play-feature-graphic-1024x500.png` |
| **Apple App Store Icon** | PNG, no alpha, max 1024px | 1024 x 1024 px | `public/store-assets/app-store-icon-1024x1024.png` |
| **Android Launcher Icons** | PNG (all densities) | mdpi to xxxhdpi | `android/app/src/main/res/mipmap-*/` |
| **iOS AppIcon Catalog** | PNG | 1024 x 1024 px | `ios/App/App/Assets.xcassets/AppIcon.appiconset/` |
