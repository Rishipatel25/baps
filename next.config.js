const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  basePath: process.env.NEXT_PUBLIC_BASEPATH,
  // output: 'standalone',
  output: process.env.NEXT_PUBLIC_OUTPUT,
  // trailingSlash: true,
  // skipTrailingSlashRedirect: true,
  // Configuration to use images in next export
  images: {
    unoptimized: true,
  },
  // eslint: {
  // Warning: This allows production builds to successfully complete even if
  // your project has ESLint errors.
  // ignoreDuringBuilds: true,
  // },
};
module.exports = nextConfig;
