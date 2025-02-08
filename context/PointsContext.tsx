"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Define the shape of the points data
interface PointsContextType {
  points: number;
  addPoints: (amount: number) => void;
  resetPoints: () => void;
}

// Create the context with an initial undefined value.
const PointsContext = createContext<PointsContextType | undefined>(undefined);

// Provider component that will wrap your app
export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const [points, setPoints] = useState<number>(0);

  // Load points from localStorage when the component mounts
  useEffect(() => {
    const stored = localStorage.getItem("points");
    if (stored) {
      setPoints(Number(stored));
    }
  }, []);

  // Whenever points change, update localStorage
  useEffect(() => {
    localStorage.setItem("points", points.toString());
  }, [points]);

  const addPoints = (amount: number) => {
    setPoints((prev) => prev + amount);
  };

  const resetPoints = () => {
    setPoints(0);
  };

  return (
    <PointsContext.Provider value={{ points, addPoints, resetPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

// Custom hook for easy access to the points context
export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return context;
};
