/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dynamic app on Vercel — image optimization enabled, no static export/basePath.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
