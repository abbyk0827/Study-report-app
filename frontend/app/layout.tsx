// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import Header from "./components/Header"; // 👈 追加

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FocusFlow",
  description: "Manage your tasks and focus time efficiently.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          
          {/* 🔽 コンポーネント化したヘッダーを呼び出す */}
          <Header />

          {/* 🔽 スマホの時だけ、下部のボトムナビゲーションとコンテンツが被らないように pb-20 (余白) を追加 */}
          <main className="flex-1 overflow-y-auto w-full pb-20 sm:pb-0">
            {children}
          </main>
          
        </ThemeProvider>
      </body>
    </html>
  );
}