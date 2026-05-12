import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardShell from '@/components/layout/DashboardShell'
import type { UserRole } from '@/types/database'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch profile — graceful fallback if DB not set up yet
  let role: UserRole = 'therapist'
  let fullName = ''
  let email = user.email ?? ''

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, email')
      .eq('id', user.id)
      .single()

    if (profile) {
      role = profile.role as UserRole
      fullName = profile.full_name ?? ''
      email = profile.email ?? email
    }
  } catch {
    // DB not available — render with defaults
  }

  return (
    <DashboardShell role={role} userName={fullName} userEmail={email}>
      {children}
    </DashboardShell>
  )
}
