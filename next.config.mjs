/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
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