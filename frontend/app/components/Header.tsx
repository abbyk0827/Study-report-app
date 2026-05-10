// frontend/app/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  const [userIcon, setUserIcon] = useState("🔒");
  const [userId, setUserId] = useState<string | null>(null);

  // 🔽 モーダル（ポップアップ）用のState
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");

  useEffect(() => {
    const storedId = localStorage.getItem("focusflow_user_id");
    if (storedId) {
      setUserId(storedId);
      fetch(`http://localhost:8000/users/me?user_id=${storedId}`)
        .then(res => res.json())
        .then(data => { if(data.icon_emoji) setUserIcon(data.icon_emoji); })
        .catch(err => console.error(err));
    } else {
      setUserIcon("🔒");
    }
  }, []);

  // 🔽 ログイン処理
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginId, password: loginPass })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("focusflow_user_id", data.user_id);
        window.location.reload(); // 画面を更新してログイン状態を反映
      } else {
        alert("IDまたはパスワードが違います");
      }
    } catch (err) { console.error(err); }
  };

  // 🔽 ゲストログイン処理
  const handleGuestLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/users/guest", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("focusflow_user_id", data.user_id);
        window.location.reload();
      }
    } catch (err) { console.error(err); }
  };

  // 🔽 ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("focusflow_user_id");
    window.location.reload();
  };

  const getLinkStyle = (path: string) => pathname === path ? "text-[var(--accent-primary)] font-bold border-b-2 border-[var(--accent-primary)] pb-1" : "text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors pb-1";
  const getMobileLinkStyle = (path: string) => pathname === path ? "text-[var(--accent-primary)] font-bold flex flex-col items-center p-2" : "text-[var(--text-muted)] hover:text-[var(--text-main)] flex flex-col items-center p-2 transition-colors";

  return (
    <>
      <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between px-6 sm:px-12 transition-colors duration-300 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold flex items-center gap-2"><span className="text-[var(--accent-primary)]">⚡</span> FocusFlow</div>
          <nav className="hidden sm:flex gap-6 font-medium mt-1">
            <Link href="/" className={getLinkStyle("/")}>Home</Link>
            <Link href="/statistics" className={getLinkStyle("/statistics")}>Statistics</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* 🔽 アイコンをクリック可能にする */}
          <div 
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-xl shadow-sm cursor-pointer hover:ring-2 hover:ring-[var(--accent-primary)] transition-all"
          >
            {userIcon}
          </div>
        </div>
      </header>

      {/* 📱 スマホ専用ボトムナビ */}
      <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-[var(--bg-card)] border-t border-[var(--border-color)] flex justify-around items-center h-16 z-40 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] pb-safe">
        <Link href="/" className={getMobileLinkStyle("/")}><span className="text-xl mb-1">🏠</span><span className="text-xs">Home</span></Link>
        <Link href="/statistics" className={getMobileLinkStyle("/statistics")}><span className="text-xl mb-1">📊</span><span className="text-xs">Stats</span></Link>
      </nav>

      {/* 🌟 ログイン用モーダル（ポップアップ） */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm px-4 transition-opacity">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-3xl w-full max-w-sm shadow-2xl relative flex flex-col items-center">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-2xl text-[var(--text-muted)] hover:text-[var(--text-main)]">✕</button>

            <div className="text-4xl mb-2">⚡</div>
            <h2 className="text-xl font-bold mb-6 text-[var(--text-main)]">FocusFlow アカウント</h2>

            {!userId ? (
              <div className="w-full space-y-4">
                <div><input type="text" placeholder="ログインID (例: kenta)" className="input-field w-full" value={loginId} onChange={e => setLoginId(e.target.value)} /></div>
                <div><input type="password" placeholder="パスワード" className="input-field w-full" value={loginPass} onChange={e => setLoginPass(e.target.value)} /></div>
                <button onClick={handleLogin} className="btn-primary w-full py-3 rounded-xl shadow-md">ログイン</button>

                <div className="flex items-center my-4 opacity-50">
                  <div className="flex-grow border-t border-[var(--border-color)]"></div>
                  <span className="mx-4 text-xs font-bold text-[var(--text-main)]">OR</span>
                  <div className="flex-grow border-t border-[var(--border-color)]"></div>
                </div>

                <button onClick={handleGuestLogin} className="w-full py-3 rounded-xl font-bold border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all duration-300">
                  ゲストとして利用
                </button>
              </div>
            ) : (
              <div className="w-full space-y-4 text-center">
                <p className="text-[var(--text-muted)] mb-4">現在ログイン中です</p>
                <button onClick={handleLogout} className="w-full py-3 rounded-xl font-bold border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300">
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}