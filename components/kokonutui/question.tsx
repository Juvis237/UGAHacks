"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionProps {
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
}

export default function Question({
  question,
  options,
  correctAnswer,
  selectedAnswer,
  onAnswer,
  isAnswered,
}: QuestionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-zinc-900 dark:text-zinc-100">
        {question}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option, index) => {
          const isCorrect = option === correctAnswer;
          const isSelected = option === selectedAnswer;
          let buttonStyle =
            "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100";

          if (isAnswered) {
            if (isCorrect) {
              buttonStyle =
                "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100";
            } else if (isSelected) {
              buttonStyle =
                "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100";
            }
          }

          return (
            <Button
              key={index}
              onClick={() => !isAnswered && onAnswer(option)}
              variant="outline"
              className={cn(
                "w-full text-left justify-start h-auto py-3 px-4",
                "transition-colors duration-200",
                buttonStyle,
                isAnswered && !isSelected && !isCorrect && "opacity-50"
              )}
              disabled={isAnswered}
            >
              {option}
            </Button>
          );
        })}
      </div>
      {isAnswered && (
        <div
          className={cn(
            "mt-4 p-3 rounded-md",
            selectedAnswer === correctAnswer
              ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
              : "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100"
          )}
        >
          {selectedAnswer === correctAnswer
            ? "Correct! Well done."
            : `Incorrect. The correct answer is ${correctAnswer}.`}
        </div>
      )}
    </div>
  );
}
