/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  compiler: {
    minify: true
  }
}

module.exports = nextConfig 