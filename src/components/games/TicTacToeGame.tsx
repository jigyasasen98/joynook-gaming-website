"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { RotateCcw, User, Bot, Users } from "lucide-react";
import { sounds } from "@/lib/soundEffects";

type Player = "X" | "O";
type Board = (Player | null)[];

const WINNING_COMBOS = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // cols
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diags
  [2, 4, 6],
];

export function TicTacToeGame() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>("X");
  const [vsAi, setVsAi] = useState(true);
  const [aiDifficulty, setAiDifficulty] = useState<"easy" | "smart">("smart");
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);
  const [winCombo, setWinCombo] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });

  const checkWinner = (b: Board): { winner: Player | "Draw" | null; combo: number[] | null } => {
    for (const combo of WINNING_COMBOS) {
      const [p1, p2, p3] = combo;
      if (b[p1] && b[p1] === b[p2] && b[p1] === b[p3]) {
        return { winner: b[p1], combo };
      }
    }
    if (b.every((cell) => cell !== null)) {
      return { winner: "Draw", combo: null };
    }
    return { winner: null, combo: null };
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    sounds.bubblePop(turn === "X" ? 1.0 : 1.3);

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result.winner) {
      setWinner(result.winner);
      setWinCombo(result.combo);
      if (result.winner === "X" || result.winner === "O") {
        setScores((s) => ({ ...s, [result.winner as Player]: s[result.winner as Player] + 1 }));
        sounds.victoryFanfare();
        confetti({ particleCount: 60, spread: 70 });
      } else {
        setScores((s) => ({ ...s, Draw: s.Draw + 1 }));
      }
      return;
    }

    setTurn(turn === "X" ? "O" : "X");
  };

  // AI Turn (Player O)
  useEffect(() => {
    if (vsAi && turn === "O" && !winner) {
      const timer = setTimeout(() => {
        // Find open cells
        const emptyIndices: number[] = [];
        board.forEach((val, idx) => {
          if (!val) emptyIndices.push(idx);
        });

        if (emptyIndices.length === 0) return;

        let bestIndex = emptyIndices[0];

        if (aiDifficulty === "smart") {
          // Check if AI can win in 1 move
          for (const idx of emptyIndices) {
            const testBoard = [...board];
            testBoard[idx] = "O";
            if (checkWinner(testBoard).winner === "O") {
              bestIndex = idx;
              break;
            }
          }
          // If no immediate win, check if Player X is about to win and block!
          if (bestIndex === emptyIndices[0]) {
            for (const idx of emptyIndices) {
              const testBoard = [...board];
              testBoard[idx] = "X";
              if (checkWinner(testBoard).winner === "X") {
                bestIndex = idx;
                break;
              }
            }
          }
          // Take center if free
          if (bestIndex === emptyIndices[0] && board[4] === null) {
            bestIndex = 4;
          }
        } else {
          // Easy random
          bestIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }

        handleCellClick(bestIndex);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [turn, vsAi, board, winner, aiDifficulty]);

  const restartRound = () => {
    sounds.uiClick();
    setBoard(Array(9).fill(null));
    setTurn("X");
    setWinner(null);
    setWinCombo(null);
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-purple-50/60 via-white to-purple-100/30 dark:from-[#18172E] dark:via-[#131226] dark:to-[#1C1B33] rounded-3xl border border-purple-100 dark:border-purple-900/50 flex flex-col justify-between p-4 sm:p-6 shadow-inner overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 z-10">
        {/* Mode Toggle */}
        <div className="p-1 rounded-xl bg-purple-100/70 dark:bg-purple-950/60 flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => {
              setVsAi(true);
              restartRound();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              vsAi
                ? "bg-white dark:bg-[#1E1D36] text-brand-purple dark:text-purple-300 shadow-sm"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>vs Computer</span>
          </button>
          <button
            onClick={() => {
              setVsAi(false);
              restartRound();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              !vsAi
                ? "bg-white dark:bg-[#1E1D36] text-brand-purple dark:text-purple-300 shadow-sm"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2 Players</span>
          </button>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-2xl bg-white/90 dark:bg-[#1E1D36]/90 backdrop-blur-md shadow-sm border border-purple-100 dark:border-purple-800/40 flex items-center gap-3 text-xs font-bold">
            <span className="text-brand-purple font-extrabold">X: {scores.X}</span>
            <span className="text-gray-400">|</span>
            <span className="text-brand-coral font-extrabold">O: {scores.O}</span>
          </div>

          <button
            onClick={restartRound}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1E1D36] text-brand-text-dark dark:text-white shadow-sm hover:text-brand-purple border border-purple-100 dark:border-purple-800/40 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main 3x3 Grid */}
      <div className="flex-1 flex flex-col items-center justify-center p-2">
        {/* Status text */}
        <div className="mb-3 text-xs font-bold tracking-wide uppercase text-brand-text-muted dark:text-gray-400">
          {!winner ? (
            <span>
              Turn:{" "}
              <strong className={turn === "X" ? "text-brand-purple" : "text-brand-coral"}>
                Player {turn} {vsAi && turn === "O" ? "(Computer)" : ""}
              </strong>
            </span>
          ) : winner === "Draw" ? (
            <span className="text-gray-600 dark:text-gray-300">It&apos;s a Tie Game!</span>
          ) : (
            <span className="text-brand-purple dark:text-purple-300 font-extrabold">
              🎉 Player {winner} Wins!
            </span>
          )}
        </div>

        <div
          className="grid grid-cols-3 gap-2.5 sm:gap-3.5 p-3 bg-purple-100/60 dark:bg-purple-950/40 rounded-3xl shadow-inner border border-purple-200/60 dark:border-purple-900/40 backdrop-blur-sm"
          style={{ width: "min(320px, 70vw)", height: "min(320px, 70vw)" }}
        >
          {board.map((cell, idx) => {
            const isWinningCell = winCombo?.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={!!cell || !!winner || (vsAi && turn === "O")}
                className={`w-full h-full rounded-2xl flex items-center justify-center font-extrabold text-4xl sm:text-5xl transition-all duration-200 shadow-sm ${
                  isWinningCell
                    ? "bg-brand-yellow text-brand-text-dark scale-105 shadow-md"
                    : cell
                    ? "bg-white dark:bg-[#1E1D36] shadow-sm"
                    : "bg-white/60 dark:bg-[#1E1D36]/60 hover:bg-white dark:hover:bg-[#1E1D36] active:scale-95"
                }`}
              >
                {cell === "X" && (
                  <span className="text-brand-purple animate-in zoom-in-75 duration-150">X</span>
                )}
                {cell === "O" && (
                  <span className="text-brand-coral animate-in zoom-in-75 duration-150">O</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-center z-10">
        <span className="text-[11px] font-semibold text-brand-text-muted dark:text-gray-400 bg-white/70 dark:bg-[#121124]/70 px-3 py-1 rounded-full backdrop-blur-sm border border-purple-100/60 dark:border-purple-900/40">
          💡 Connect 3 Xs or Os horizontally, vertically, or diagonally to win
        </span>
      </div>
    </div>
  );
}
