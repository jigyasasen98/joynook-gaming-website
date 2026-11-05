"use client";

import { BubblePopGame } from "./BubblePopGame";
import { ColorSortGame } from "./ColorSortGame";
import { BalloonPopGame } from "./BalloonPopGame";
import { ColorFloodGame } from "./ColorFloodGame";
import { VirtualBubbleWrapGame } from "./VirtualBubbleWrapGame";
import { AsmrTapGame } from "./AsmrTapGame";
import { DigitalSquishyToyGame } from "./DigitalSquishyToyGame";
import { PeelTheTapeGame } from "./PeelTheTapeGame";
import { SlidingPuzzleGame } from "./SlidingPuzzleGame";
import { MemoryMatchGame } from "./MemoryMatchGame";
import { Game2048 } from "./Game2048";
import { TicTacToeGame } from "./TicTacToeGame";
import { MandalaCreatorGame } from "./MandalaCreatorGame";
import { ZenSandArtGame } from "./ZenSandArtGame";
import { ZenDoodleGame } from "./ZenDoodleGame";
import { BreathingExerciseGame } from "./BreathingExerciseGame";
import { RainSoundGame } from "./RainSoundGame";
import { Magic8BallGame } from "./Magic8BallGame";

interface GameRendererProps {
  slug: string;
}

export function GameRenderer({ slug }: GameRendererProps) {
  switch (slug) {
    case "bubble-pop":
      return <BubblePopGame />;
    case "color-sort":
      return <ColorSortGame />;
    case "balloon-pop":
      return <BalloonPopGame />;
    case "color-flood":
      return <ColorFloodGame />;
    case "virtual-bubble-wrap":
      return <VirtualBubbleWrapGame />;
    case "asmr-tap":
      return <AsmrTapGame />;
    case "digital-squishy-toy":
      return <DigitalSquishyToyGame />;
    case "peel-the-tape":
      return <PeelTheTapeGame />;
    case "sliding-puzzle":
      return <SlidingPuzzleGame />;
    case "memory-match":
      return <MemoryMatchGame />;
    case "2048":
      return <Game2048 />;
    case "tic-tac-toe":
      return <TicTacToeGame />;
    case "mandala-creator":
      return <MandalaCreatorGame />;
    case "zen-sand-art":
      return <ZenSandArtGame />;
    case "zen-doodle":
      return <ZenDoodleGame />;
    case "breathing-exercise":
      return <BreathingExerciseGame />;
    case "rain-sound":
      return <RainSoundGame />;
    case "magic-8-ball":
      return <Magic8BallGame />;
    default:
      return (
        <div className="w-full aspect-[16/10] bg-purple-50 dark:bg-purple-950/40 rounded-3xl flex items-center justify-center p-6 text-center">
          <div>
            <span className="text-4xl">🎮</span>
            <p className="font-bold text-lg text-brand-text-dark dark:text-white mt-2">
              Game Loading...
            </p>
          </div>
        </div>
      );
  }
}
