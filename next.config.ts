import type { NextConfig } from "next";

// No GitHub Pages o site fica em /<nome-do-repositório>. O workflow de deploy define essa variável.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
