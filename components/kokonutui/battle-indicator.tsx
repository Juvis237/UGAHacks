"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { db, doc, onSnapshot } from "@/lib/firebase";

interface BattleIndicatorProps {
  totalQuestions: number;
  playerProgress: ("correct" | "incorrect" | "unanswered")[];
  opponentProgress: ("correct" | "incorrect" | "unanswered")[];
}

export default function BattleIndicator({
  totalQuestions,
  playerProgress,
  opponentProgress,
}: BattleIndicatorProps) {
  return (
    <div className="mb-6 p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Battle Progress
        </h3>
      </div>
      <div className="flex justify-between gap-4 items-center">
        {/* Player Progress */}
        <div className="flex-1">
          <p className="text-xs mb-1 text-zinc-600 dark:text-zinc-400">You</p>
          <div className="flex gap-1">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <div
                key={`player-${index}`}
                className={cn("h-2 flex-1 rounded-full", {
                  "bg-gray-200 dark:bg-gray-700":
                    playerProgress[index] === "unanswered",
                  "bg-green-500": playerProgress[index] === "correct",
                  "bg-red-500": playerProgress[index] === "incorrect",
                })}
              />
            ))}
          </div>
        </div>

        {/* Opponent Progress */}
        <div className="flex-1">
          <p className="text-xs mb-1 text-zinc-600 dark:text-zinc-400">
            Opponent
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <div
                key={`opponent-${index}`}
                className={cn("h-2 flex-1 rounded-full", {
                  "bg-gray-200 dark:bg-gray-700":
                    opponentProgress[index] === "unanswered",
                  "bg-green-500": opponentProgress[index] === "correct",
                  "bg-red-500": opponentProgress[index] === "incorrect",
                })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
