/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/is-it-rootable' : '',
  assetPrefix: isProd ? '/is-it-rootable' : '',
};

export default nextConfig;

