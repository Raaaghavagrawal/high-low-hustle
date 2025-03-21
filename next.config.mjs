/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'images.pexels.com',
      'plus.unsplash.com'
    ],
    minimumCacheTTL: 3600,
  },
  async redirects() {
    return [
      {
        source: '/landing',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig; 