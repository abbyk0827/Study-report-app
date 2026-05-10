// frontend/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/app/config";
import PomodoroTimer from "@/app/components/PomodoroTimer";
import TodoList from "@/app/components/TodoList";
import { useTimer } from "@/app/context/TimerContext";

type Task = { id: number; title: string; target_minutes: number; sort_order: number };
type User = { name: string; icon_emoji: string; focus_message: string; };

const EMOJI_LIST = ["👨‍💻", "👩‍💻", "🚀", "🎯", "🌟", "🔥", "⚡", "💡", "🎮", "📚", "🎨", "☕"];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // 🔽 修正1：ここで定義していた selectedTaskId を削除し、useTimer から取得する
  const { selectedTaskId, setSelectedTaskId } = useTimer();

  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUser, setEditUser] = useState<User>({ name: "", icon_emoji: "👨‍💻", focus_message: "" });

  // 起動時にログイン状態を確認
  useEffect(() => {
    const storedId = localStorage.getItem("focusflow_user_id");
    if (storedId) {
      setUserId(storedId);
      fetchData(storedId);
    }
  }, []);

  // 取得先をログイン中のユーザーID（id）に限定する
const fetchData = (id: string) => {
    const ts = new Date().getTime();
    Promise.all([
      fetch(`${API_URL}/tasks/user/${id}?t=${ts}`, { cache: "no-store" }).then(res => res.json()),
      fetch(`${API_URL}/users/me?user_id=${id}&t=${ts}`, { cache: "no-store" }).then(res => res.json())
    ]).then(([tasksData, userData]) => {
      
      // 🛡️ 追加：安全装置（データが配列じゃない＝エラーだった場合は、空の配列にする）
      const validTasks = Array.isArray(tasksData) ? tasksData : [];
      
      setTasks(validTasks);
      setUser(userData);
      setEditUser({ 
        name: userData?.name || "", 
        icon_emoji: userData?.icon_emoji || "👨‍💻", 
        focus_message: userData?.focus_message || "" 
      });
      if (validTasks.length > 0 && !selectedTaskId) setSelectedTaskId(validTasks[0].id);
    }).catch(err => console.error("APIエラー:", err));
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    try {
      const payload = { name: editUser.name, icon_emoji: editUser.icon_emoji, focus_message: editUser.focus_message };
      const res = await fetch(`${API_URL}/users/me?user_id=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) { alert("保存に失敗しました。"); return; }
      
      setIsEditingProfile(false);
      fetchData(userId);
      window.location.reload(); 
    } catch (err) { console.error(err); }
  };

  // 🛑 ログインしていない場合はロック画面を表示
  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 px-4">
        <div className="text-8xl animate-pulse">🔒</div>
        <h2 className="text-3xl font-bold text-[var(--text-main)]">FocusFlowへようこそ</h2>
        <p className="text-[var(--text-muted)] max-w-md leading-relaxed">
          右上のアイコンをクリックして、<br />
          テストアカウントでログインするか、<br />
          ゲストとして体験を開始してください。
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 font-sans max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="custom-card relative">
            {!isEditingProfile ? (
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-3xl shadow-sm">{user?.icon_emoji || "👨‍💻"}</div>
                <div className="flex-1">
                  <h2 className="text-xl text-[var(--text-muted)]">Name: <span className="text-[var(--text-main)] font-bold">{user?.name || "Loading..."}</span></h2>
                  <p className="text-[var(--text-muted)]">Focus: <span className="text-[var(--text-main)]">{user?.focus_message || "..."}</span></p>
                </div>
                <button onClick={() => setIsEditingProfile(true)} className="absolute top-4 right-4 text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] font-bold">編集</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[var(--text-muted)] font-bold mb-2 block">アイコン選択</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_LIST.map((emoji) => (
                      <button key={emoji} onClick={() => setEditUser({ ...editUser, icon_emoji: emoji })} className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all ${editUser.icon_emoji === emoji ? "bg-[var(--accent-primary)] text-white scale-110 shadow-md" : "bg-[var(--bg-main)] border border-[var(--border-color)] hover:bg-gray-200"}`}>{emoji}</button>
                    ))}
                  </div>
                </div>
                <div><label className="text-xs text-[var(--text-muted)] font-bold">名前</label><input className="input-field w-full" value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})} /></div>
                <div><label className="text-xs text-[var(--text-muted)] font-bold">Focus (目標・肩書き)</label><input className="input-field w-full" value={editUser.focus_message} onChange={e => setEditUser({...editUser, focus_message: e.target.value})} /></div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setIsEditingProfile(false)} className="text-[var(--text-muted)] font-bold px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">キャンセル</button>
                  <button onClick={handleSaveProfile} className="btn-primary">保存</button>
                </div>
              </div>
            )}
          </div>
          
          {/* 🔽 修正2：TodoList に userId を渡すように変更 */}
          <TodoList 
            tasks={tasks} 
            onRefresh={() => fetchData(userId)} 
            onReorder={(newTasks) => setTasks(newTasks)} 
            userId={userId} 
          />
        </div>

        <div className="space-y-6">
          <div className="custom-card">
            <h3 className="font-bold mb-4 text-[var(--text-main)]">Target Task</h3>
            <select className="input-field w-full" value={selectedTaskId || ""} onChange={(e) => setSelectedTaskId(Number(e.target.value))}>
              <option value="">タスクを選択してください</option>
              {tasks?.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}
            </select>
          </div>
          
          {/* 🔽 修正3：PomodoroTimer自身が共通記憶を見るようになったので、引数(selectedTaskId)を渡さなくてOKになる */}
          <PomodoroTimer />
        </div>
      </div>
    </div>
  );
}