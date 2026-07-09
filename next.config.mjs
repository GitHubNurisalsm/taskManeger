/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/taskManager",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;