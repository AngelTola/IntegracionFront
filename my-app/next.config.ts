/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '34.69.214.55',
        port: '3001',
        pathname: '/**',
      },
    ],
  },
}
module.exports = nextConfig