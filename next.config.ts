import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  serverExternalPackages: ['lightningcss', 'lightningcss-win32-x64-msvc'],
};

export default withNextIntl(nextConfig);
