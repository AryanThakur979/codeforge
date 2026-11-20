/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    // Prevent Windows concurrent filesystem cache lock collisions
    config.cache = false;
    return config;
  },
};

export default nextConfig;
