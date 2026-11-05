"use client";

import { useState } from "react";
import { Sparkles, RotateCcw, HelpCircle } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

const ANSWERS = [
  // Affirmative
  "It is certain ✨",
  "It is decidedly so 🌟",
  "Without a doubt 👍",
  "Yes definitely 💫",
  "You may rely on it 🔮",
  "As I see it, yes 🌸",
  "Most likely 🌈",
  "Outlook good ☀️",
  "Yes! 🎉",
  "Signs point to yes 🎯",

  // Non-committal / Contemplative
  "Reply hazy, try again 🌫️",
  "Ask again later ⏳",
  "Better not tell you now 🤫",
  "Cannot predict now 🌀",
  "Concentrate and ask again 🧘",

  // Negative
  "Don't count on it 🍂",
  "My reply is no 🛑",
  "My sources say no 🌑",
  "Outlook not so good 🌧️",
  "Very doubtful 🤔",
];

export function Magic8BallGame() {
  const [question, setQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [history, setHistory] = useState<{ q: string; a: string }[]>([]);

  const shakeBall = () => {
    if (isShaking) return;

    sounds.mysticalWhoosh();
    setIsShaking(true);
    setCurrentAnswer(null);

    setTimeout(() => {
      const randomAns = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
      setCurrentAnswer(randomAns);
      setIsShaking(false);

      if (question.trim()) {
        setHistory((prev) => [
          { q: question.trim(), a: randomAns },
          ...prev.slice(0, 4),
        ]);
      }
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      shakeBall();
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-[#16152B] via-[#100F21] to-[#1C1B33] rounded-3xl border border-purple-900/50 flex flex-col justify-between p-4 sm:p-6 shadow-inner overflow-hidden select-none text-white">
      {/* Top Question Input */}
      <div className="z-10 max-w-md mx-auto w-full">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask a Yes/No question and shake..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-purple-950/70 border border-purple-800/50 text-white placeholder:text-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
          <HelpCircle className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main 3D Magic 8-Ball */}
      <div className="flex-1 flex items-center justify-center my-auto relative">
        <div
          onClick={shakeBall}
          className={`cursor-pointer transition-transform duration-300 relative ${
            isShaking ? "animate-wiggle scale-105" : "hover:scale-105 active:scale-95"
          }`}
        >
          {/* Deep Shadow */}
          <div className="absolute -bottom-6 inset-x-4 h-12 bg-black/60 rounded-full blur-xl pointer-events-none" />

          {/* Exterior Glossy 8-Ball Sphere */}
          <div className="relative w-52 sm:w-64 h-52 sm:h-64 rounded-full bg-gradient-to-br from-[#2D2A4A] via-[#151426] to-[#0A0914] shadow-2xl border-4 border-purple-950/80 flex items-center justify-center overflow-hidden">
            {/* Top Gloss Reflection */}
            <div className="absolute top-2 left-10 w-24 sm:w-32 h-12 rounded-full bg-white/10 blur-[3px] transform -rotate-25 pointer-events-none" />

            {/* Inner Liquid Window */}
            <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-[#08071A] border-4 border-[#252442] shadow-inner flex items-center justify-center p-3 relative overflow-hidden">
              {/* Swirling liquid gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-tr from-indigo-950 via-purple-950 to-blue-900 ${
                  isShaking ? "animate-spin" : ""
                }`}
              />

              {/* Glowing Triangle Floating Die Answer */}
              {currentAnswer && !isShaking ? (
                <div className="relative z-10 text-center animate-in zoom-in-75 fade-in duration-300">
                  <span className="text-[11px] sm:text-xs font-extrabold text-sky-200 drop-shadow-md leading-tight block">
                    {currentAnswer}
                  </span>
                </div>
              ) : isShaking ? (
                <div className="relative z-10 text-sky-400 font-mono text-xs animate-pulse">
                  🔮 ...
                </div>
              ) : (
                <div className="relative z-10 text-center text-gray-500 font-extrabold text-2xl sm:text-3xl select-none">
                  8
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls & Shake Button */}
      <div className="flex items-center justify-center gap-3 z-10">
        <button
          onClick={shakeBall}
          disabled={isShaking}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-brand-purple/30 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-brand-yellow" />
          <span>{isShaking ? "Consulting Cosmos..." : "Shake 8-Ball"}</span>
        </button>

        {currentAnswer && (
          <button
            onClick={() => {
              setCurrentAnswer(null);
              setQuestion("");
            }}
            className="p-2.5 rounded-2xl bg-purple-950/80 border border-purple-800/40 text-gray-300 hover:text-white active:scale-95 transition-all"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
