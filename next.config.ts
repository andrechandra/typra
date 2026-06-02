/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'vercel.com' }],
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
}

module.exports = nextConfig
