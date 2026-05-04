// "use client" をつけることで、ブラウザ側で動くReactコンポーネントになります
"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // ページが開かれたときに、FastAPI (ポート8000) にアクセスする
    fetch('http://localhost:8000/')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage('API Connection Error!'));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-24">
      <h1 className="text-4xl font-bold text-blue-400 mb-8">Java Silver Portfolio</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <p className="text-xl">Backend Status:</p>
        {/* ここにFastAPIからのメッセージが表示されます */}
        <p className="text-2xl font-mono text-green-400 mt-4">{message}</p>
      </div>
    </main>
  );
}