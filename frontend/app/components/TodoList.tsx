// frontend/app/components/TodoList.tsx
"use client";

import { useState } from "react";
import { API_URL } from "@/app/config";

type Task = { id: number; title: string; target_minutes: number; sort_order: number };

// 🔽 修正1：親（page.tsx）から渡される userId を受け取れるように型（Props）を追加
type Props = { 
  tasks: Task[]; 
  onRefresh: () => void; 
  onReorder: (tasks: Task[]) => void; 
  userId: string | null; // 👈 これを追加
};

export default function TodoList({ tasks = [], onRefresh, onReorder, userId }: Props) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  
  const handleAdd = async () => {
    if (!newTaskTitle.trim()) return;
    
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // 🔽 修正2：固定の "1" をやめて、ログイン中のユーザーのID（Number(userId)）を送る
      body: JSON.stringify({ 
        user_id: Number(userId), 
        title: newTaskTitle, 
        target_minutes: 60, 
        sort_order: tasks?.length 
      }),
    });
    
    setNewTaskTitle("");
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const handleSaveEdit = async (id: number) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    });
    setEditingTaskId(null);
    onRefresh();
  };

  // ドラッグ＆ドロップ処理
  const handleDragStart = (e: React.DragEvent, index: number) => e.dataTransfer.setData("dragIndex", index.toString());
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    const dragIndex = Number(e.dataTransfer.getData("dragIndex"));
    if (dragIndex === dropIndex) return;

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(dragIndex, 1);
    newTasks.splice(dropIndex, 0, draggedTask);
    onReorder(newTasks);

    const reorderPayload = newTasks.map((task, index) => ({ id: task.id, sort_order: index }));
    await fetch(`${API_URL}/tasks/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reorderPayload),
    });
  };

  return (
    <div className="custom-card">
      <h3 className="font-bold mb-4 text-[var(--text-main)]">TODO List</h3>
      <div className="flex gap-2 mb-6">
        <input 
          className="input-field flex-1"
          value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} 
          placeholder="新しいタスクを入力..."
        />
        <button className="btn-primary" onClick={handleAdd}>Add</button>
      </div>

      <ul className="space-y-3">
        {tasks?.map((task, index) => (
          <li 
            key={task.id} draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="flex justify-between items-center bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-color)] cursor-move hover:border-[var(--accent-primary)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-[var(--text-muted)]">≡</span>
              {editingTaskId === task.id ? (
                <input 
                  className="input-field py-1"
                  value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus
                />
              ) : (
                <span className="font-medium text-[var(--text-main)]">{task.title}</span>
              )}
            </div>
            <div className="flex gap-2">
              {editingTaskId === task.id ? (
                <button onClick={() => handleSaveEdit(task.id)} className="text-green-500 font-bold text-sm">保存</button>
              ) : (
                <>
                  <button onClick={() => { setEditingTaskId(task.id); setEditTitle(task.title); }} className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm">編集</button>
                  <button onClick={() => handleDelete(task.id)} className="text-[var(--text-muted)] hover:text-red-500 text-sm">削除</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}