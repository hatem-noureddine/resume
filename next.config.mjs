import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // No output: 'export' - Vercel handles this automatically
  // No basePath - deploying to root domain
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
})(nextConfig);
