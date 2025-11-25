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
  // Explicitly use webpack for PWA support
  turbo: {},
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GROQ_API_KEY_INSIGHTS: process.env.GROQ_API_KEY_INSIGHTS,
  },
};

export default withSerwist(nextConfig);
