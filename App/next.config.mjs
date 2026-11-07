import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

// Keep a running development server from overwriting production build manifests.
export default function nextConfig(phase) {
  return {
    output: "standalone",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    async rewrites() {
      const target = process.env.COMMUNITY_API_PROXY_TARGET?.trim().replace(/\/+$/, "");
      if (!target) {
        if (process.env.NEXT_PUBLIC_API_BASE_URL === "/community-api") {
          throw new Error("使用 /community-api 时请配置 COMMUNITY_API_PROXY_TARGET");
        }
        return [];
      }
      return [{ source: "/community-api/:path*", destination: `${target}/:path*` }];
    },
  };
}
