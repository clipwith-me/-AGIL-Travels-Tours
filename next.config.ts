import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't pick up an unrelated
  // lockfile elsewhere on the machine (the home directory has a stray one).
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
