/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@sewanexa/shared-types', '@sewanexa/validation'],
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // In monorepos with symlinks, Webpack filesystem caching fails with:
      // "Caching failed for pack: Error: Unable to snapshot resolve dependencies"
      // Switching to memory cache prevents cache corruption and ensures CSS always compiles cleanly.
      config.cache = {
        type: 'memory',
      };
    }
    return config;
  },
};

module.exports = nextConfig;
