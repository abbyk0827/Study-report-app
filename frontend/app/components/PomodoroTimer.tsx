"use client";
import { useState, useEffect } from "react";

export default function PomodoroTimer({ selectedTaskId }: { selectedTaskId: number | null }) {
  const [timeLeft, setTimeLeft] = useState(1500); // 25分
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((time) => time - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (selectedTaskId) {
        fetch("http://localhost:8000/study_logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task_id: selectedTaskId, actual_minutes: 25, log_type: "pomodoro", memo: "セッション完了" })
        }).then(() => alert("記録を保存しました。"));
      }
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, timeLeft, selectedTaskId]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(1500); };
  const formatTime = (sec: number) => `${Math.floor(sec / 60).toString().padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;

  const mainBtn = isActive ? { text: "PAUSE", color: "bg-red-500/20 text-red-400 border border-red-500" } 
               : timeLeft < 1500 ? { text: "RESUME", color: "bg-green-600 text-white" } 
               : { text: "START", color: "bg-blue-600 text-white" };

return (
    <div className="custom-card flex flex-col items-center justify-center relative overflow-hidden h-[400px]">
      <div className={`absolute w-96 h-96 blur-[100px] rounded-full opacity-20 ${isActive ? 'bg-red-600' : timeLeft < 1500 ? 'bg-green-600' : 'bg-[var(--accent-primary)]'}`}></div>
      <h2 className="text-xl font-bold mb-6 z-10">Pomodoro Timer</h2>
      <div className="z-10 flex flex-col items-center">
        <div className={`w-64 h-64 rounded-full flex items-center justify-center border-4 ${isActive ? 'border-red-500/50' : timeLeft < 1500 ? 'border-green-500/50' : 'border-[var(--border-color)]'}`}>
          <span className="text-6xl font-mono">{formatTime(timeLeft)}</span>
        </div>
        
        {/* 🔽 修正：START, PAUSE, RESUMEを明確に分離 */}
        <div className="flex gap-4 mt-10">
          {isActive ? (
            <button onClick={() => setIsActive(false)} className="w-32 py-3 rounded-full font-bold tracking-wider bg-orange-500 text-white shadow-md hover:bg-orange-400 transition-colors">
              PAUSE
            </button>
          ) : timeLeft < 1500 ? (
            <button onClick={() => setIsActive(true)} className="w-32 py-3 rounded-full font-bold tracking-wider bg-green-600 text-white shadow-md hover:bg-green-500 transition-colors">
              RESUME
            </button>
          ) : (
            <button onClick={() => setIsActive(true)} className="w-32 py-3 rounded-full font-bold tracking-wider bg-[var(--accent-primary)] text-white shadow-md hover:opacity-80 transition-opacity">
              START
            </button>
          )}
          
          <button onClick={resetTimer} className="btn-secondary w-32 rounded-full border-none">
            RESET
          </button>
        </div>
      </div>
    </div>
  );
}