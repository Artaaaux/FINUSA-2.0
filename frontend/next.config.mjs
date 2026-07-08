/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/FINUSA-2.0',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
