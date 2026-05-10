// frontend/app/components/StudyLogManager.tsx
"use client";
import { useState, useEffect } from "react";

type StudyLog = { id: number; task_id: number; actual_minutes: number; log_type: string; memo: string; };
type Task = { id: number; title: string; };

export default function StudyLogManager({ onLogChange }: { onLogChange: () => void }) {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [newTask, setNewTask] = useState<number | "">("");
  const [newMinutes, setNewMinutes] = useState<number | "">("");
  
  // 🔽 修正用のStateを復活
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMinutes, setEditMinutes] = useState<number | "">("");

  const fetchData = async () => {
    const ts = new Date().getTime();
    const [logsRes, tasksRes] = await Promise.all([
      fetch(`http://localhost:8000/users/1/study_logs?t=${ts}`, { cache: "no-store" }),
      fetch(`http://localhost:8000/tasks/user/1?t=${ts}`, { cache: "no-store" })
    ]);
    setLogs(await logsRes.json());
    setTasks(await tasksRes.json());
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!newTask || !newMinutes) return;
    await fetch("http://localhost:8000/study_logs", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id: newTask, actual_minutes: newMinutes, log_type: "manual" }),
    });
    setNewTask(""); setNewMinutes(""); 
    fetchData(); 
    onLogChange(); // Statisticsのグラフと合計時間を更新
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/study_logs/${id}`, { method: "DELETE" });
    fetchData(); 
    onLogChange();
  };

  // 🔽 修正の保存処理を復活
  const handleSaveEdit = async (id: number) => {
    await fetch(`http://localhost:8000/study_logs/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actual_minutes: editMinutes }),
    });
    setEditingId(null);
    fetchData();
    onLogChange();
  };

  return (
    <div className="custom-card mt-8">
      <h3 className="font-bold mb-6">📝 学習記録マネージャー</h3>
      
      <div className="flex flex-wrap gap-3 mb-8 bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-color)]">
        <select className="input-field flex-1" value={newTask} onChange={(e) => setNewTask(Number(e.target.value))}>
          <option value="">タスクを選択...</option>
          {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
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
          {logs.map(log => (
            <tr key={log.id} className="border-b border-[var(--border-color)]">
              <td className="py-3">{tasks.find(t => t.id === log.task_id)?.title}</td>
              <td className="py-3 font-bold text-[var(--accent-primary)]">
                {/* 🔽 修正モードの切り替え */}
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
                    <button onClick={() => { setEditingId(log.id); setEditMinutes(log.actual_minutes); }} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] text-sm font-bold">修正</button>
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