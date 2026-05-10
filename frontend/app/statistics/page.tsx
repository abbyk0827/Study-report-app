// frontend/app/statistics/page.tsx
"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StudyLogManager from "@/app/components/StudyLogManager";

type StatData = { title: string; total_minutes: number; };

export default function Statistics() {
  const [stats, setStats] = useState<StatData[]>([]);

  const fetchStats = () => {
    fetch(`http://localhost:8000/users/1/stats?t=${new Date().getTime()}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("APIエラー:", err));
  };

  useEffect(() => { fetchStats(); }, []);

  // 🔽 合計時間は stats のデータから常にリアルタイム計算される
  const totalStudyTime = stats.reduce((sum, item) => sum + item.total_minutes, 0);

  return (
    <div className="p-4 sm:p-8 font-sans max-w-5xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側：合計時間だけを大きく表示 */}
        <div className="lg:col-span-1 custom-card flex flex-col justify-center items-center text-center">
          <h3 className="text-[var(--text-muted)] font-bold mb-4">Total Focus Time</h3>
          <div className="text-5xl font-bold flex items-baseline gap-2 text-[var(--accent-primary)]">
            {Math.floor(totalStudyTime / 60)} <span className="text-2xl text-[var(--text-muted)]">h</span> 
            {totalStudyTime % 60} <span className="text-2xl text-[var(--text-muted)]">m</span>
          </div>
        </div>

        {/* 右側：グラフ */}
        <div className="custom-card lg:col-span-2">
          <h3 className="font-bold mb-6">Task Performance (Minutes)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="title" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip cursor={{ fill: 'var(--border-color)' }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }} />
                <Bar dataKey="total_minutes" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* マネージャーが更新されたら、fetchStatsを呼んでグラフと合計時間を再計算させる */}
      <StudyLogManager onLogChange={fetchStats} />
    </div>
  );
}