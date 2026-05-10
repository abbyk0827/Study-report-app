// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import Header from "./components/Header";
import { TimerProvider } from "./context/TimerContext"; // 👈 追加1：タイマーの記憶領域をインポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FocusFlow",
  description: "Manage your tasks and focus time efficiently.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`} suppressHydrationWarning>
        <ThemeProvider>
          {/* 🔽 追加2：TimerProviderで全体を包むことで、ページを跨いでもタイマーが持続する */}
          <TimerProvider> 
            
            <Header />
            
            <main className="flex-1 overflow-y-auto w-full pb-20 sm:pb-0">
              {children}
            </main>

          </TimerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}