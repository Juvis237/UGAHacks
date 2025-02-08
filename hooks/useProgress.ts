import { useState, useEffect } from "react";

// Define the shape of the progress data
export interface Progress {
  points: number;
  completedLessons: { [moduleTitle: string]: string[] };
}

// Default progress values
const defaultProgress: Progress = {
  points: 0,
  completedLessons: {},
};

// Custom hook to store progress in localStorage
function useProgress(key: string, initialValue: Progress = defaultProgress) {
  const [progress, setProgress] = useState<Progress>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(progress));
  }, [key, progress]);

  return [progress, setProgress] as const;
}

export default useProgress;
