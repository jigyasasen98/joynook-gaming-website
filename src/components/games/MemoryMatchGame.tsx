"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { RotateCcw, Clock, Sparkles } from "lucide-react";
import { sounds } from "@/lib/soundEffects";
import { formatTime, shuffleArray } from "@/lib/utils";

const THEMES: Record<string, { name: string; emojis: string[] }> = {
  nature: {
    name: "Nature & Animals",
    emojis: ["🦊", "🐼", "🐨", "🐸", "🦋", "🌸", "🍄", "🥑", "🍓", "🍉", "🐬", "🦄"],
  },
  space: {
    name: "Space Quest",
    emojis: ["🚀", "🪐", "🛸", "🌙", "⭐", "☄️", "👾", "🛰️", "🌍", "☀️", "🔭", "✨"],
  },
  sweets: {
    name: "Sweet Bakery",
    emojis: ["🧁", "🍩", "🍦", "🍪", "🍰", "🍫", "🍭", "🥞", "🧇", "🍮", "🍬", "🍒"],
  },
};

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryMatchGame() {
  const [themeKey, setThemeKey] = useState<"nature" | "space" | "sweets">("nature");
  const [pairCount, setPairCount] = useState<6 | 8>(6);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const initGame = useCallback(
    (pairs: 6 | 8, theme: "nature" | "space" | "sweets") => {
      const selectedEmojis = THEMES[theme].emojis.slice(0, pairs);
      const deck: Card[] = [];

      selectedEmojis.forEach((emoji, idx) => {
        deck.push({ id: idx * 2, emoji, isFlipped: false, isMatched: false });
        deck.push({ id: idx * 2 + 1, emoji, isFlipped: false, isMatched: false });
      });

      setCards(shuffleArray(deck));
      setFlippedIndices([]);
      setMoves(0);
      setTimer(0);
      setIsRunning(false);
      setIsWon(false);
    },
    []
  );

  useEffect(() => {
    initGame(pairCount, themeKey);
  }, [pairCount, themeKey, initGame]);

  // Timer
  useEffect(() => {
    if (!isRunning || isWon) return;
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isWon]);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2 || isWon) {
      return;
    }

    if (!isRunning) setIsRunning(true);

    sounds.cardFlip();

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    // Update card flipped state
    setCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, isFlipped: true } : c))
    );

    // If 2 cards are now open, compare them
    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;

      if (cards[firstIdx].emoji === cards[secondIdx].emoji) {
        // MATCH!
        setTimeout(() => {
          sounds.matchSuccess();
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);

          // Check Win
          setCards((latest) => {
            const allMatched = latest.every(
              (c, i) => c.isMatched || i === firstIdx || i === secondIdx
            );
            if (allMatched) {
              setIsWon(true);
              setIsRunning(false);
              sounds.victoryFanfare();
              confetti({ particleCount: 75, spread: 80 });
            }
            return latest;
          });
        }, 350);
      } else {
        // No match -> flip back after brief pause
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleRestart = () => {
    sounds.uiClick();
    initGame(pairCount, themeKey);
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-purple-50/60 via-white to-purple-100/30 dark:from-[#18172E] dark:via-[#131226] dark:to-[#1C1B33] rounded-3xl border border-purple-100 dark:border-purple-900/50 flex flex-col justify-between p-4 sm:p-6 shadow-inner overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          {/* Moves */}
          <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>Flips:</span>
            <span className="font-extrabold text-brand-purple dark:text-purple-300">{moves}</span>
          </div>

          {/* Timer */}
          <div className="px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">
            <Clock className="w-3.5 h-3.5 text-brand-sky" />
            <span className="font-mono font-extrabold text-brand-text-dark dark:text-white">
              {formatTime(timer)}
            </span>
          </div>

          {/* Difficulty (Pairs) */}
          <div className="p-1 rounded-xl bg-purple-100/70 dark:bg-purple-950/60 flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setPairCount(6)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                pairCount === 6
                  ? "bg-white dark:bg-[#1E1D36] text-brand-purple dark:text-purple-300 shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              12 Cards
            </button>
            <button
              onClick={() => setPairCount(8)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                pairCount === 8
                  ? "bg-white dark:bg-[#1E1D36] text-brand-purple dark:text-purple-300 shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              16 Cards
            </button>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1E1D36] text-brand-text-dark dark:text-white shadow-sm hover:text-brand-purple border border-purple-100 dark:border-purple-800/40 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>
      </div>

      {/* Main Card Grid */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div
          className="grid gap-2 sm:gap-3 p-2 max-w-xl w-full"
          style={{
            gridTemplateColumns: `repeat(${pairCount === 6 ? 4 : 4}, minmax(0, 1fr))`,
          }}
        >
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`aspect-[4/5] rounded-2xl border-2 transition-all duration-300 transform flex items-center justify-center ${
                card.isMatched
                  ? "bg-mint-100/60 dark:bg-mint-950/40 border-mint-400 opacity-60 scale-95 pointer-events-none"
                  : card.isFlipped
                  ? "bg-white dark:bg-[#1E1D36] border-brand-purple shadow-md scale-100"
                  : "bg-gradient-to-tr from-brand-purple to-purple-600 border-white/60 shadow-sm hover:scale-105 active:scale-95"
              }`}
            >
              {card.isFlipped || card.isMatched ? (
                <span className="text-3xl sm:text-4xl filter drop-shadow select-none animate-in zoom-in-75 duration-150">
                  {card.emoji}
                </span>
              ) : (
                <span className="text-xl sm:text-2xl text-white/50 select-none">✨</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-center z-10">
        <span className="text-[11px] font-semibold text-brand-text-muted dark:text-gray-400 bg-white/70 dark:bg-[#121124]/70 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-100/60 dark:border-purple-900/40">
          💡 Flip two cards to find matching twin symbols
        </span>
      </div>

      {/* Win Modal */}
      {isWon && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C1B33] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-purple-100 dark:border-purple-800/50 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-4xl">🌟</span>
            <h3 className="font-extrabold text-xl text-brand-text-dark dark:text-white mt-2">
              All Pairs Matched!
            </h3>
            <p className="text-xs text-brand-text-muted dark:text-gray-400 mt-1">
              You cleared the board in {moves} moves and {formatTime(timer)}!
            </p>
            <button
              onClick={handleRestart}
              className="mt-4 w-full py-2.5 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
