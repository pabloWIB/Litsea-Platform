import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/login/', '/reset-password/'],
      },
    ],
    sitemap: [
      'https://glampingreservadelruiz.website/sitemap.xml',
      'https://glampingreservadelruiz.website/llms.txt',
      'https://glampingreservadelruiz.website/llms-full.txt',
    ],
    host: 'https://glampingreservadelruiz.website',
  }
}
