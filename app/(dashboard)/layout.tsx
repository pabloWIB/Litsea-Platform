import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, CalendarDays, Plus, List, LogOut } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-purple-950 text-white flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-purple-900">
          <Image
            src="/img/logo.jpg"
            alt="Reserva del Ruiz"
            width={36}
            height={36}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-sm leading-tight">Reserva del Ruiz</p>
            <p className="text-purple-400 text-[11px]">Glamping</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={15} />}>Dashboard</NavItem>
          <NavItem href="/reservations/new" icon={<Plus size={15} />}>Nueva reserva</NavItem>
          <NavItem href="/reservations" icon={<List size={15} />}>Reservas</NavItem>
          <NavItem href="/dashboard" icon={<CalendarDays size={15} />}>Calendario</NavItem>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-purple-900">
          <p className="text-purple-400 text-[11px] truncate mb-2">{user.email}</p>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 text-xs text-purple-400 hover:text-white transition-colors"
            >
              <LogOut size={13} /> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function NavItem({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-purple-300 hover:text-white hover:bg-purple-900/60 transition-colors"
    >
      {icon}
      {children}
    </Link>
  )
}
