/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
    webpack: (config) => {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
  
      return config;
    },
  };
  
  export default nextConfig;
  