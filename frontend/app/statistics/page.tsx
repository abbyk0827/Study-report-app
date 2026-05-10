// frontend/app/statistics/page.tsx
"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/app/config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StudyLogManager from "@/app/components/StudyLogManager";

type StatData = { title: string; total_minutes: number; };

export default function Statistics() {
  const [stats, setStats] = useState<StatData[]>([]);
  // 🔽 追加：ログイン中のユーザーIDを保持するState
  const [userId, setUserId] = useState<string | null>(null);

  // 🔽 追加：起動時にログイン状態を確認
  useEffect(() => {
    const storedId = localStorage.getItem("focusflow_user_id");
    if (storedId) {
      setUserId(storedId);
      fetchStats(storedId);
    }
  }, []);

  // 🔽 修正：固定の「1」ではなく、引数で受け取った id（ログインユーザー）の統計を取得する
  const fetchStats = (id: string) => {
    fetch(`${API_URL}/users/${id}/stats?t=${new Date().getTime()}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        // 🛡️ 安全装置：データが配列じゃない（エラー等）場合は空にする
        const validStats = Array.isArray(data) ? data : [];
        setStats(validStats);
      })
      .catch(err => console.error("APIエラー:", err));
  };

  // 🛑 ログインしていない場合はロック画面を表示
  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 px-4">
        <div className="text-8xl animate-pulse">🔒</div>
        <h2 className="text-3xl font-bold text-[var(--text-main)]">Statisticsはロックされています</h2>
        <p className="text-[var(--text-muted)] max-w-md leading-relaxed">
          右上のアイコンをクリックしてログインしてください。
        </p>
      </div>
    );
  }

  // 🔽 合計時間は stats のデータから常にリアルタイム計算される（オプショナルチェーンで安全に）
  const totalStudyTime = stats?.reduce((sum, item) => sum + item.total_minutes, 0) || 0;

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
          <h3 className="font-bold mb-6 text-[var(--text-main)]">Task Performance (Minutes)</h3>
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
      
      {/* 🔽 修正：fetchStats に userId を渡すように変更 */}
    <StudyLogManager onLogChange={() => fetchStats(userId)} userId={userId} />
    </div>
  );
}