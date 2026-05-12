import type { MetadataRoute } from 'next'

const BASE_URL = 'https://empleos.litseacc.edu.mx'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/vacantes`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/terapeutas`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/como-funciona`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/auth/login`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/registro-terapeuta`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/registro-empleador`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Dynamic routes — vacantes and terapeutas from Supabase
  // Only runs when the DB is configured; fails silently otherwise
  let vacantesRoutes: MetadataRoute.Sitemap = []
  let terapeutasRoutes: MetadataRoute.Sitemap = []

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createServiceClient } = await import('@/lib/supabase/service')
      const supabase = createServiceClient()

      const [vacantesRes, terapeutasRes] = await Promise.all([
        supabase
          .from('vacancies')
          .select('id, updated_at')
          .eq('is_active', true)
          .order('updated_at', { ascending: false })
          .limit(500),
        supabase
          .from('therapist_profiles')
          .select('slug, updated_at')
          .eq('is_verified', true)
          .not('slug', 'is', null)
          .order('updated_at', { ascending: false })
          .limit(500),
      ])

      vacantesRoutes = (vacantesRes.data ?? []).map(v => ({
        url: `${BASE_URL}/vacantes/${v.id}`,
        lastModified: new Date(v.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

      terapeutasRoutes = (terapeutasRes.data ?? []).map(t => ({
        url: `${BASE_URL}/terapeutas/${t.slug}`,
        lastModified: new Date(t.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    } catch {
      // DB not available — skip dynamic routes
    }
  }

  return [...staticRoutes, ...vacantesRoutes, ...terapeutasRoutes]
}
