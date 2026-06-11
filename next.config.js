/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dynamic app on Vercel — image optimization enabled, no static export/basePath.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = nextConfig;
