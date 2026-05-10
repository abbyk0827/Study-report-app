// frontend/app/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  
  // PC版：現在のページなら下線とアクセントカラーをつける
  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return isActive 
      ? "text-[var(--accent-primary)] font-bold border-b-2 border-[var(--accent-primary)] pb-1" 
      : "text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors pb-1";
  };

  // スマホ版：現在のページなら色を濃くする
  const getMobileLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return isActive 
      ? "text-[var(--accent-primary)] font-bold flex flex-col items-center p-2" 
      : "text-[var(--text-muted)] hover:text-[var(--text-main)] flex flex-col items-center p-2 transition-colors";
  };

  return (
    <>
      {/* 💻 PC・スマホ共通の上部ヘッダー（リンクはPCのみ表示） */}
      <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between px-6 sm:px-12 transition-colors duration-300 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold flex items-center gap-2">
            <span className="text-[var(--accent-primary)]">⚡</span> FocusFlow
          </div>
          
          {/* PC版ナビゲーション */}
          <nav className="hidden sm:flex gap-6 font-medium mt-1">
            <Link href="/" className={getLinkStyle("/")}>Home</Link>
            <Link href="/statistics" className={getLinkStyle("/statistics")}>Statistics</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center font-bold text-sm shadow-md">
            K
          </div>
        </div>
      </header>

      {/* 📱 スマホ専用 下部ボトムナビゲーション（PCでは非表示） */}
      <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-[var(--bg-card)] border-t border-[var(--border-color)] flex justify-around items-center h-16 z-50 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] pb-safe">
        <Link href="/" className={getMobileLinkStyle("/")}>
          <span className="text-xl mb-1">🏠</span>
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/statistics" className={getMobileLinkStyle("/statistics")}>
          <span className="text-xl mb-1">📊</span>
          <span className="text-xs">Stats</span>
        </Link>
      </nav>
    </>
  );
}