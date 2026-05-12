import type { MetadataRoute } from 'next'

const BASE = 'https://glampingreservadelruiz.website'
const LOCALES = ['es', 'en', 'fr'] as const

const PAGES = [
  { path: '',                      priority: 1.0,  changeFreq: 'weekly'  },
  { path: '/paquetes',             priority: 0.9,  changeFreq: 'weekly'  },
  { path: '/disponibilidad',       priority: 0.9,  changeFreq: 'daily'   },
  { path: '/galeria',              priority: 0.7,  changeFreq: 'monthly' },
  { path: '/como-llegar',          priority: 0.7,  changeFreq: 'monthly' },
  { path: '/opiniones',            priority: 0.7,  changeFreq: 'weekly'  },
  { path: '/contacto',             priority: 0.8,  changeFreq: 'monthly' },
  { path: '/politica-cancelacion', priority: 0.3,  changeFreq: 'yearly'  },
  { path: '/terminos',             priority: 0.3,  changeFreq: 'yearly'  },
  { path: '/privacidad',           priority: 0.3,  changeFreq: 'yearly'  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const localeEntries = PAGES.flatMap(({ path, priority, changeFreq }) =>
    LOCALES.map((locale) => ({
      url: locale === 'es' ? `${BASE}${path}` : `${BASE}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: changeFreq as MetadataRoute.Sitemap[number]['changeFrequency'],
      priority,
    }))
  )

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  return [...localeEntries, ...staticEntries]
}
