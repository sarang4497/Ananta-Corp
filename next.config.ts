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
  }
};

export default withNextIntl(nextConfig);
