/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/taskManager",
  assetPrefix: "/taskManager/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;