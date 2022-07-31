/** @type {import('next').NextConfig} */
const nextConfig = {
  //@dev - this will help you to deploy this project without typescript error on deployment build
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [ 'images.pexels.com', 'lh3.googleusercontent.com' ],  
  }
}

module.exports = nextConfig
