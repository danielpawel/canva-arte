/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'design.canva.ai' },
      { protocol: 'https', hostname: 'media.canva.com' },
    ],
  },
};

export default nextConfig;
