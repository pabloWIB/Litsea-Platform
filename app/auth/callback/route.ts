import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const signupRole = searchParams.get('signup_role')

  if (code) {
    const supabase = await getSupabaseServer()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Password reset flow — redirect to the confirm page
      if (next) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Get user to determine where to redirect
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // If this is a Google OAuth signup with a specific role, update it
        if (signupRole && ['therapist', 'employer'].includes(signupRole)) {
          try {
            const serviceClient = createServiceClient()
            await serviceClient
              .from('profiles')
              .update({ role: signupRole })
              .eq('id', user.id)
          } catch {
            // Non-fatal: DB might not be set up yet in dev
          }
        }

        // Read the role from profiles for the redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const role = profile?.role ?? signupRole ?? 'therapist'

        if (role === 'admin') return NextResponse.redirect(`${origin}/admin`)
        if (role === 'employer') return NextResponse.redirect(`${origin}/empleador/dashboard`)
        return NextResponse.redirect(`${origin}/terapeuta/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/reset-password/confirm?error=link_expired`)
}
