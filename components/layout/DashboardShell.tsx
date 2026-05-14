'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SidebarNavigation, { MobileTopNav } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import type { UserRole } from '@/types/database'

interface DashboardShellProps {
  children: React.ReactNode
  role: UserRole
  userName: string
  userEmail: string
}

export default function DashboardShell({
  children,
  role,
  userName,
  userEmail,
}: DashboardShellProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Mobile: topnav + full-width content */}
      <div className="flex flex-col h-screen md:hidden">
        <MobileTopNav
          role={role}
          userName={userName}
          userEmail={userEmail}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto bg-[#FAF9F5]">
          {children}
        </main>
      </div>

      {/* Desktop: sidebar + content */}
      <div className="hidden md:flex h-screen overflow-hidden bg-[#071210]">
        <SidebarNavigation
          role={role}
          userName={userName}
          userEmail={userEmail}
          onLogout={handleLogout}
        />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-[#FAF9F5]">
          <Header userEmail={userEmail} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
