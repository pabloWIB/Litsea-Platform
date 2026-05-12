'use client'

import { usePathname } from 'next/navigation'

function getTitle(pathname: string): string {
  if (pathname === '/terapeuta/dashboard')               return 'Dashboard'
  if (pathname.startsWith('/terapeuta/perfil'))          return 'Mi perfil'
  if (pathname.startsWith('/terapeuta/aplicaciones'))    return 'Mis aplicaciones'
  if (pathname.startsWith('/terapeuta/certificados'))    return 'Mis certificados'
  if (pathname.startsWith('/terapeuta/mensajes'))        return 'Mensajes'

  if (pathname === '/empleador/dashboard')               return 'Dashboard'
  if (pathname.startsWith('/empleador/vacantes/nueva'))  return 'Nueva vacante'
  if (pathname.includes('/editar'))                      return 'Editar vacante'
  if (pathname.startsWith('/empleador/vacantes'))        return 'Mis vacantes'
  if (pathname.startsWith('/empleador/aplicaciones'))    return 'Aplicaciones recibidas'
  if (pathname.startsWith('/empleador/mensajes'))        return 'Mensajes'

  if (pathname === '/admin')                             return 'Dashboard'
  if (pathname.startsWith('/admin/terapeutas'))          return 'Terapeutas'
  if (pathname.startsWith('/admin/empleadores'))         return 'Empleadores'
  if (pathname.startsWith('/admin/vacantes'))            return 'Vacantes'
  if (pathname.startsWith('/admin/aplicaciones'))        return 'Aplicaciones'
  if (pathname.startsWith('/admin/certificados'))        return 'Certificados'
  if (pathname.startsWith('/admin/mensajes'))            return 'Mensajes'
  if (pathname.startsWith('/admin/auditoria'))           return 'Auditoría'
  if (pathname.startsWith('/admin/configuracion'))       return 'Configuración'

  return 'Litsea Empleos'
}

export function Header({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname()

  return (
    <header className="hidden md:flex h-14 px-6 items-center justify-between border-b border-white/6 bg-[#060e0b] shrink-0">
      <h1 className="text-[15px] font-semibold text-white">
        {getTitle(pathname)}
      </h1>
      {userEmail && (
        <span className="text-[13px] text-white/35 truncate max-w-[220px]">
          {userEmail}
        </span>
      )}
    </header>
  )
}
