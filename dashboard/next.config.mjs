/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Use backend API URL if set, otherwise fallback to localhost
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
