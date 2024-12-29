/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  distDir: '.next',
  dir: 'src',
}

module.exports = nextConfig 
