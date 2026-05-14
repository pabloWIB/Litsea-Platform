import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const handleI18n = createMiddleware(routing)

const PROTECTED_PREFIXES = ['/terapeuta', '/empleador', '/admin']
const AUTH_PATHS = ['/login', '/registro-terapeuta', '/registro-empleador']

function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(en|fr)(\/|$)/)
  return match ? pathname.slice(match[1].length + 1) || '/' : pathname
}

export async function proxy(request: NextRequest) {
  // i18n routing first — handles locale redirects and rewrites
  const intlResponse = handleI18n(request)

  // If next-intl issued a redirect, return it immediately
  if (intlResponse.status === 301 || intlResponse.status === 302) {
    return intlResponse
  }

  // Skip Supabase auth if env vars not set (local dev without .env)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return intlResponse
  }

  const pathname = stripLocale(request.nextUrl.pathname)
  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
  const isAuthPage = AUTH_PATHS.includes(pathname)

  if (!isProtected && !isAuthPage) return intlResponse

  let response = intlResponse
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Malformed or expired auth cookie — treat as unauthenticated
  }

  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon|api/|auth/callback|auth/signout|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|mp3|webm|woff2?|ttf|pdf|txt|xml|json)).*)',
  ],
}
