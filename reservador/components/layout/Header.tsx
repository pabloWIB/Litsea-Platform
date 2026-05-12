'use client'

import { usePathname } from 'next/navigation'

function getTitle(p: string): string {
  if (p.startsWith('/dashboard'))    return 'Dashboard'
  if (p.startsWith('/reservations')) return 'Reservas'
  if (p.startsWith('/clients'))      return 'Clientes'
  if (p.startsWith('/plans'))        return 'Planes y precios'
  if (p.startsWith('/availability')) return 'Disponibilidad'
  if (p.startsWith('/reports'))      return 'Reportes'
  if (p.startsWith('/settings'))     return 'Configuración'
  if (p.startsWith('/reviews-admin'))return 'Opiniones'
  return 'Glamping Reserva del Ruiz'
}

export function Header({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname()

  return (
    <header className="hidden md:flex h-14 px-6 items-center justify-between border-b border-neutral-200 bg-white shrink-0">
      <h1 className="text-[15px] font-semibold text-neutral-900">
        {getTitle(pathname)}
      </h1>
      {userEmail && (
        <span className="text-sm text-neutral-500 truncate max-w-[200px]">
          {userEmail}
        </span>
      )}
    </header>
  )
}
