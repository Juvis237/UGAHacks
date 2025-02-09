import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const gameSessionId = "juv237";
// Mock questions - in a real app, these would come from an API or database
export const questions = [
  {
    id: 1,
    question: "What does a balance sheet show?",
    options: [
      "Revenue and expenses",
      "Assets, liabilities, and equity",
      "Cash flow details",
      "Market trends",
    ],
    correctAnswer: "Assets, liabilities, and equity",
  },
  {
    id: 2,
    question: "What is equity?",
    options: [
      "Total debts of the company",
      "Owners residual interest",
      "Cash available for operations",
      "Expenses incurred",
    ],
    correctAnswer: "Owners residual interest",
  },
  {
    id: 3,
    question: "Which section is not on a balance sheet?",
    options: ["Assets", "Liabilities", "Equity", "Revenue"],
    correctAnswer: "Revenue",
  },
];
