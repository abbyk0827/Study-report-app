// frontend/app/components/PomodoroTimer.tsx
"use client";

import { useTimer } from "@/app/context/TimerContext";

export default function PomodoroTimer() {
  // グローバルな記憶（TimerContext）からタイマーの状態を呼び出す
  const { timeLeft, isActive, setIsActive, resetTimer, formatTime } = useTimer();

  return (
    <div className="custom-card flex flex-col items-center justify-center relative overflow-hidden h-[400px]">
      {/* 稼働中と停止中で背景の光る色を変える */}
      <div className={`absolute w-96 h-96 blur-[100px] rounded-full opacity-20 transition-colors duration-1000 ${isActive ? 'bg-red-600' : 'bg-[var(--accent-primary)]'}`}></div>
      
      <h2 className="text-xl font-bold mb-6 z-10 text-[var(--text-main)]">Pomodoro Timer</h2>
      
      <div className="z-10 flex flex-col items-center">
        {/* タイマーの円盤部分 */}
        <div className={`w-64 h-64 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isActive ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-[var(--border-color)]'}`}>
          <span className="text-6xl font-mono text-[var(--text-main)]">{formatTime(timeLeft)}</span>
        </div>
        
        {/* コントロールボタン群 */}
        <div className="flex gap-4 mt-10">
          {isActive ? (
            <button 
              onClick={() => setIsActive(false)} 
              className="w-32 py-3 rounded-full font-bold bg-orange-500 text-white shadow-md hover:bg-orange-600 transition-colors"
            >
              PAUSE
            </button>
          ) : (
            <button 
              onClick={() => setIsActive(true)} 
              className="w-32 py-3 rounded-full font-bold bg-[var(--accent-primary)] text-white shadow-md hover:opacity-90 transition-colors"
            >
              {timeLeft < 1500 ? "RESUME" : "START"}
            </button>
          )}
          
          <button 
            onClick={resetTimer} 
            className="w-32 py-3 rounded-full font-bold bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-color)] hover:text-[var(--text-main)] transition-colors"
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  );
}