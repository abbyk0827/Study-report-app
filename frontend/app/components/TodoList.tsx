"use client";

import { useState } from "react";

type Task = { id: number; title: string; target_minutes: number; sort_order: number };
type Props = { tasks: Task[]; onRefresh: () => void; onReorder: (tasks: Task[]) => void; };

export default function TodoList({ tasks, onRefresh, onReorder }: Props) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleAdd = async () => {
    if (!newTaskTitle.trim()) return;
    await fetch("http://localhost:8000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: 1, title: newTaskTitle, target_minutes: 60, sort_order: tasks.length }),
    });
    setNewTaskTitle("");
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/tasks/${id}`, { method: "DELETE" });
    onRefresh();
  };

  const handleSaveEdit = async (id: number) => {
    await fetch(`http://localhost:8000/tasks/${id}`, {
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
    await fetch("http://localhost:8000/tasks/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reorderPayload),
    });
  };

  return (
    <div className="custom-card">
      <h3 className="font-bold mb-4 text-gray-300">TODO List</h3>
      <div className="flex gap-2 mb-6">
        <input 
          className="input-field flex-1"
          value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} 
          placeholder="新しいタスクを入力..."
        />
        <button className="btn-primary" onClick={handleAdd}>Add</button>
      </div>

      <ul className="space-y-3">
        {tasks.map((task, index) => (
          <li 
            key={task.id} draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="flex justify-between items-center bg-[#2C2C2E] p-3 rounded-xl border border-gray-700 cursor-move hover:border-gray-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-500">≡</span>
              {editingTaskId === task.id ? (
                <input 
                  className="input-field py-1"
                  value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus
                />
              ) : (
                <span className="font-medium text-gray-200">{task.title}</span>
              )}
            </div>
            <div className="flex gap-2">
              {editingTaskId === task.id ? (
                <button onClick={() => handleSaveEdit(task.id)} className="text-green-400 text-sm">保存</button>
              ) : (
                <>
                  <button onClick={() => { setEditingTaskId(task.id); setEditTitle(task.title); }} className="text-gray-400 hover:text-white text-sm">編集</button>
                  <button onClick={() => handleDelete(task.id)} className="text-gray-400 hover:text-red-400 text-sm">削除</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}