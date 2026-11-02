import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    // WebP only: on-demand AVIF encoding stalled cold-cache pages (≈150 swatches).
    formats: ['image/webp'],
    // Small widths for swatches / thumbnails / logos.
    imageSizes: [32, 48, 64, 96, 128, 160, 256, 384]
  },
  // Preserve the ORIGINAL site's URLs (anantacorporation.com) when the domain
  // moves to this codebase — product slugs are already identical.
  async redirects() {
    return [
      {source: '/about-us', destination: '/about', permanent: true},
      {source: '/categories', destination: '/products', permanent: true},
      {source: '/privacy-policy', destination: '/privacy', permanent: true},
      {source: '/term-of-use', destination: '/terms', permanent: true},
      {source: '/products/doors', destination: '/products/flush-door', permanent: true}
    ];
  }
};

export default withNextIntl(nextConfig);
