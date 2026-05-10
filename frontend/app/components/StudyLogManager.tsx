// frontend/app/components/StudyLogManager.tsx
"use client";
import { useState, useEffect } from "react";
import { API_URL } from "@/app/config";

type StudyLog = { id: number; task_id: number; actual_minutes: number; log_type: string; memo: string; };
type Task = { id: number; title: string; };

// 🔽 修正1：親（Statisticsページ）から userId を受け取るように Props を定義
type Props = { 
  onLogChange: () => void; 
  userId: string; 
};

export default function StudyLogManager({ onLogChange, userId }: Props) {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [newTask, setNewTask] = useState<number | "">("");
  const [newMinutes, setNewMinutes] = useState<number | "">("");
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMinutes, setEditMinutes] = useState<number | "">("");
  // 🔽 追加：修正用の「タスクID」を保持するState
  const [editTaskId, setEditTaskId] = useState<number | "">("");

  const fetchData = async () => {
    if (!userId) return; // userIdが無い時は動かさない（安全対策）
    const ts = new Date().getTime();
    try {
      const [logsRes, tasksRes] = await Promise.all([
        // 🔽 修正2：固定の "1" をやめて、引数の userId に変更
        fetch(`${API_URL}/users/${userId}/study_logs?t=${ts}`, { cache: "no-store" }),
        fetch(`${API_URL}/tasks/user/${userId}?t=${ts}`, { cache: "no-store" })
      ]);
      const logsData = await logsRes.json();
      const tasksData = await tasksRes.json();
      
      // 🛡️ 安全装置
      setLogs(Array.isArray(logsData) ? logsData : []);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (err) {
      console.error("APIエラー:", err);
    }
  };

  useEffect(() => { fetchData(); }, [userId]); // userIdが変わった時も再取得する

  const handleAdd = async () => {
    if (!newTask || !newMinutes) return;
    await fetch("${API_URL}/study_logs", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id: newTask, actual_minutes: newMinutes, log_type: "manual" }),
    });
    setNewTask(""); setNewMinutes(""); 
    fetchData(); 
    onLogChange(); 
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/study_logs/${id}`, { method: "DELETE" });
    fetchData(); 
    onLogChange();
  };

const handleSaveEdit = async (id: number) => {
    // 🛡️ 安全装置：確実に数字（Number）に変換して送る
    const payload = {
      actual_minutes: Number(editMinutes),
      task_id: Number(editTaskId)
    };

    try {
      const res = await fetch(`${API_URL}/study_logs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert("保存に失敗しました。");
        return;
      }

      setEditingId(null);
      // ✅ 修正の最重要ポイント：必ず await をつけて最新データの取得を「待つ」
      await fetchData(); 
      onLogChange(); 
    } catch (err) {
      console.error("通信エラー:", err);
    }
  };

  return (
    <div className="custom-card mt-8">
      <h3 className="font-bold mb-6 text-[var(--text-main)]">📝 学習記録マネージャー</h3>
      
      <div className="flex flex-wrap gap-3 mb-8 bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-color)]">
        <select className="input-field flex-1" value={newTask} onChange={(e) => setNewTask(Number(e.target.value))}>
          <option value="">タスクを選択...</option>
          {tasks?.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
        <input type="number" placeholder="分数" className="input-field w-32" value={newMinutes} onChange={(e) => setNewMinutes(Number(e.target.value))} />
        <button onClick={handleAdd} className="btn-primary w-24">追加</button>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[var(--border-color)] text-[var(--text-muted)]">
            <th className="pb-2">タスク</th>
            <th className="pb-2">時間(分)</th>
            <th className="pb-2 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {logs?.map(log => (
            <tr key={log.id} className="border-b border-[var(--border-color)]">
              
              {/* 🔽 修正4：タスク名の表示部分。編集モードの時は「プルダウン（select）」になる */}
              <td className="py-3 pr-4">
                {editingId === log.id ? (
                  <select 
                    className="input-field w-full py-1 text-sm" 
                    value={editTaskId} 
                    onChange={(e) => setEditTaskId(Number(e.target.value))}
                  >
                    {tasks?.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                ) : (
                  <span className="text-[var(--text-main)]">
                    {tasks.find(t => t.id === log.task_id)?.title || "不明なタスク"}
                  </span>
                )}
              </td>

              <td className="py-3 font-bold text-[var(--accent-primary)]">
                {editingId === log.id ? (
                  <input type="number" className="input-field w-20 py-1" value={editMinutes} onChange={(e) => setEditMinutes(Number(e.target.value))} />
                ) : (
                  `${log.actual_minutes}分`
                )}
              </td>
              <td className="py-3 text-right">
                {editingId === log.id ? (
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => handleSaveEdit(log.id)} className="text-green-500 font-bold text-sm">保存</button>
                    <button onClick={() => setEditingId(null)} className="text-[var(--text-muted)] text-sm">取消</button>
                  </div>
                ) : (
                  <div className="flex gap-3 justify-end">
                    {/* 🔽 修正5：編集ボタンを押した時、editTaskId に現在のタスクIDをセットする */}
                    <button 
                      onClick={() => { 
                        setEditingId(log.id); 
                        setEditMinutes(log.actual_minutes); 
                        setEditTaskId(log.task_id); // 👈 これを追加
                      }} 
                      className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] text-sm font-bold"
                    >
                      修正
                    </button>
                    <button onClick={() => handleDelete(log.id)} className="text-red-400 text-sm font-bold">削除</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}