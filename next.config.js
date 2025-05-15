/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true,
      fileName: true,
      meaninglessFileNames: ['index', 'styles'],
    },
  },
  transpilePackages: ['react-icons'],
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      sideEffects: true,
    };
    return config;
  },
};

module.exports = nextConfig;
