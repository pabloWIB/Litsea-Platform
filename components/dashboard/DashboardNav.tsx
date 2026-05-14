'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  CalendarDays,
  Plus,
  List,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Tent,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard',         label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/reservations/new',  label: 'Nueva reserva',  icon: Plus },
  { href: '/reservations',      label: 'Reservas',       icon: List },
  { href: '/availability',      label: 'Calendario',     icon: CalendarDays },
  { href: '/clients',           label: 'Clientes',       icon: Users },
  { href: '/plans',             label: 'Planes',         icon: Tent },
  { href: '/reports',           label: 'Reportes',       icon: BarChart3 },
  { href: '/settings',          label: 'Configuración',  icon: Settings },
]

export default function DashboardNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-56 shrink-0 bg-purple-950 text-white flex flex-col min-h-screen">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-purple-900/60">
        <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center shrink-0">
          <Tent size={15} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-tight truncate">Reserva del Ruiz</p>
          <p className="text-purple-400 text-[10px]">Glamping</p>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-purple-800 text-white font-medium'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/50'
              }`}
            >
              <Icon size={14} className="shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-purple-900/60">
        <p className="text-purple-400 text-[10px] truncate mb-2">{userEmail}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-purple-400 hover:text-white transition-colors"
        >
          <LogOut size={12} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
