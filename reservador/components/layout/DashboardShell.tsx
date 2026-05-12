'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SidebarNavigation from '@/components/dashboard/sidebar-navigation'

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFAF5]">
      <SidebarNavigation onLogout={handleLogout} />
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
