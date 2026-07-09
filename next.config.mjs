/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  trailingSlash: true,

  basePath: isProd ? "/taskManager" : "",
  assetPrefix: isProd ? "/taskManager/" : "",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;