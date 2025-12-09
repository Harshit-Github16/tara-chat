import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.js',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV !== 'production',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_API_KEY_INSIGHTS: process.env.GROQ_API_KEY_INSIGHTS,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/dass21',
        destination: '/stress-check',
        permanent: true,
      },
    ];
  },
};

export default withSerwist(nextConfig);
