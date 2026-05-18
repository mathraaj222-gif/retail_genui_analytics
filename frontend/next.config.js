/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Silence the Turbopack/Webpack conflict error by providing an empty turbopack config
  turbopack: {
    // Empty object as suggested by Next.js 16 Tip
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  }
};

module.exports = nextConfig;
