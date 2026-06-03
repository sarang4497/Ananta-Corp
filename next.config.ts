import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Ship the editable knowledge Markdown with the /api/chat serverless function
  // so its runtime fs reads work in production.
  outputFileTracingIncludes: {
    '/api/chat': ['./src/content/knowledge/**/*']
  },
  images: {
    formats: ['image/avif', 'image/webp']
  },
  // Clean URLs for the standalone static demo sites in /public/demos/*.
  // These bypass i18n (also excluded in the proxy matcher).
  async rewrites() {
    return [
      {source: '/demos/dental', destination: '/demos/dental/index.html'},
      {source: '/demos/restaurant', destination: '/demos/restaurant/index.html'}
    ];
  }
};

export default withNextIntl(nextConfig);
