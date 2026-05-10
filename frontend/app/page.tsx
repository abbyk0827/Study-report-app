"use client";

import { useState, useEffect } from "react";
import PomodoroTimer from "@/app/components/PomodoroTimer";
import TodoList from "@/app/components/TodoList";

type Task = { id: number; title: string; target_minutes: number; sort_order: number };

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const fetchTasks = () => {
    fetch(`http://localhost:8000/tasks/user/1?t=${new Date().getTime()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        if (data.length > 0 && !selectedTaskId) setSelectedTaskId(data[0].id);
      })
      .catch((err) => console.error("APIエラー:", err));
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleReorder = (newTasks: Task[]) => setTasks(newTasks);

  return (
    <div className="p-4 sm:p-8 font-sans max-w-6xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="custom-card flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-3xl">👨‍💻</div>
            <div>
              <h2 className="text-xl text-gray-400">Name: <span className="text-white font-bold">Kenta S.</span></h2>
              <p className="text-gray-400">Focus: <span className="text-white">Lifestyle & Productivity</span></p>
            </div>
          </div>
          <TodoList tasks={tasks} onRefresh={fetchTasks} onReorder={handleReorder} />
        </div>

        <div className="space-y-6">
          <div className="custom-card">
            <h3 className="font-bold mb-4 text-gray-300">Target Task</h3>
            <select 
              className="input-field w-full"
              value={selectedTaskId || ""}
              onChange={(e) => setSelectedTaskId(Number(e.target.value))}
            >
              <option value="">タスクを選択してください</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
          </div>
          <PomodoroTimer selectedTaskId={selectedTaskId} />
        </div>
      </div>
    </div>
  );
}