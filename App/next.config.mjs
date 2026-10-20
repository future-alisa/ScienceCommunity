import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

// Keep a running development server from overwriting production build manifests.
export default function nextConfig(phase) {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  };
}
