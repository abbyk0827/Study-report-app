// frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔽 これだけでOKです！Cloudflareに「HTMLとして書き出してね」と伝えます
  output: 'export',
};

export default nextConfig;