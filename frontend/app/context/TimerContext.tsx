// frontend/app/context/TimerContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

type TimerContextType = {
  timeLeft: number;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  resetTimer: () => void;
  selectedTaskId: number | null;
  setSelectedTaskId: (id: number | null) => void;
  formatTime: (seconds: number) => string;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timeLeft, setTimeLeft] = useState(1500); // 25分
  const [isActive, setIsActive] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert("Time is up! Let's log your focus time.");
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(1500);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <TimerContext.Provider value={{ timeLeft, isActive, setIsActive, resetTimer, selectedTaskId, setSelectedTaskId, formatTime }}>
      {children}
    </TimerContext.Provider>
  );
}

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within a TimerProvider");
  return context;
};