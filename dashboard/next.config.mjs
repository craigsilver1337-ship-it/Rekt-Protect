/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Only use rewrites for local development (when no NEXT_PUBLIC_API_URL is set)
    if (process.env.NEXT_PUBLIC_API_URL) return [];
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
