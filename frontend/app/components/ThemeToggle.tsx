// frontend/app/components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // ブラウザでの描画準備が完了したことを検知する
  useEffect(() => {
    setMounted(true);
  }, []);

  // 準備ができるまでは、レイアウトが崩れないように空の枠（プレースホルダー）を返す
  if (!mounted) {
    return <div className="w-[36px] h-[36px]"></div>;
  }

  return (
    <button 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors w-[36px] h-[36px] flex items-center justify-center"
      title="テーマ切り替え"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}