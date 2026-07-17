import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "Gamified-Bookkeeping-Course";

const nextConfig: NextConfig = {
  // GitHub Pages serves static files only.
  output: "export",
  images: { unoptimized: true },
  // Helps GitHub Pages resolve nested routes reliably.
  trailingSlash: true,
  ...(isGithubPages
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
};

export default nextConfig;
