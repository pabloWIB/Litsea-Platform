import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const signupRole = searchParams.get('signup_role')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Password reset flow
      if (next) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Google OAuth signup with explicit role
        if (signupRole && ['therapist', 'employer'].includes(signupRole)) {
          try {
            const service = createServiceClient()
            await service.from('profiles').update({ role: signupRole }).eq('id', user.id)
          } catch { /* non-fatal */ }
        }

        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', user.id).single()

        const role = profile?.role ?? signupRole ?? 'therapist'

        if (role === 'admin')    return NextResponse.redirect(`${origin}/admin`)
        if (role === 'employer') return NextResponse.redirect(`${origin}/empleador/dashboard`)
        return NextResponse.redirect(`${origin}/terapeuta/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/reset-password/confirm?error=link_expired`)
}
