/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  transpilePackages: ['framer-motion']
}

module.exports = nextConfig 