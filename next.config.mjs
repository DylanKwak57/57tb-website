import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/57tb-website',
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
