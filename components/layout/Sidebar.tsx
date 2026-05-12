'use client'

import React, { useState, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  UserCircle,
  Award,
  ClipboardList,
  MessageCircle,
  Briefcase,
  Users,
  Building2,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import type { UserRole } from '@/types/database'

// ─── Types ────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface NavSection {
  label?: string
  items: NavItem[]
}

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
}

// ─── Context ──────────────────────────────────────────

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider')
  return ctx
}

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  const [openState, setOpenState] = useState(false)
  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  )
}

// ─── Sidebar wrapper ──────────────────────────────────

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => (
  <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
    {children}
  </SidebarProvider>
)

// ─── SidebarBody (renders Desktop + Mobile) ───────────

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => (
  <div className="flex">
    <DesktopSidebar {...props} />
    <MobileSidebar {...(props as React.ComponentProps<'div'>)} />
  </div>
)

// ─── Desktop sidebar (hover expand) ──────────────────

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar()
  return (
    <motion.div
      className={cn(
        'h-full px-2 py-4 hidden md:flex md:flex-col shrink-0 bg-[#060e0b] border-r border-white/6',
        className
      )}
      animate={{ width: animate ? (open ? '220px' : '58px') : '220px' }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// ─── Mobile sidebar (slide-in drawer) ─────────────────

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  const { open, setOpen } = useSidebar()
  return (
    <div
      className="h-14 px-4 flex flex-row md:hidden items-center justify-between w-full bg-[#060e0b] border-b border-white/6"
      {...props}
    >
      {/* Mobile brand */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-[#2FB7A3]/15 border border-[#2FB7A3]/25 flex items-center justify-center">
          <span className="text-[#2FB7A3] font-bold text-[10px]">L</span>
        </div>
        <span className="text-white font-semibold text-sm">Litsea Empleos</span>
      </div>

      <button
        className="p-2 text-white/50 hover:text-white hover:bg-white/8 rounded-md transition-colors"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        <Menu size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              'fixed inset-0 h-full w-full z-[9999] flex flex-col bg-[#060e0b] px-2 py-4',
              className
            )}
          >
            <button
              className="absolute right-4 top-4 p-1.5 text-white/50 hover:text-white hover:bg-white/8 rounded-md transition-colors"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── SidebarLink ──────────────────────────────────────

export const SidebarLink = ({
  link,
  className,
}: {
  link: NavItem
  className?: string
}) => {
  const { open, animate } = useSidebar()
  const pathname = usePathname()

  const isActive =
    link.href === '/admin' || link.href.endsWith('/dashboard')
      ? pathname === link.href
      : pathname.startsWith(link.href)

  return (
    <Link
      href={link.href}
      className={cn(
        'relative flex items-center gap-3 rounded-md px-2.5 py-2 text-[13.5px] transition-colors duration-100',
        isActive
          ? 'text-white font-medium bg-white/8'
          : 'text-white/50 hover:text-white hover:bg-white/6',
        className
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#2FB7A3]" />
      )}
      <span className="shrink-0 w-[18px] h-[18px] flex items-center justify-center">
        {link.icon}
      </span>
      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="truncate !p-0 !m-0 leading-none flex-1 whitespace-nowrap"
      >
        {link.label}
      </motion.span>
    </Link>
  )
}

// ─── Section label ────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  const { open, animate } = useSidebar()
  return (
    <motion.p
      animate={{
        display: animate ? (open ? 'block' : 'none') : 'block',
        opacity: animate ? (open ? 1 : 0) : 1,
      }}
      className="px-2.5 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/25 select-none"
    >
      {label}
    </motion.p>
  )
}

// ─── Brand ────────────────────────────────────────────

function SidebarBrand() {
  const { open, animate } = useSidebar()
  return (
    <div className="px-2.5 mb-5 flex items-center gap-2.5 h-9">
      <div className="w-7 h-7 rounded-lg bg-[#2FB7A3]/15 border border-[#2FB7A3]/25 flex items-center justify-center shrink-0">
        <span className="text-[#2FB7A3] font-bold text-xs">L</span>
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-white font-semibold text-[14px] tracking-tight whitespace-nowrap"
      >
        Litsea Empleos
      </motion.span>
    </div>
  )
}

// ─── Nav sections per role ────────────────────────────

function getNavSections(role: UserRole): NavSection[] {
  if (role === 'therapist') {
    return [
      {
        items: [
          { label: 'Dashboard', href: '/terapeuta/dashboard', icon: <LayoutDashboard size={16} /> },
        ],
      },
      {
        label: 'Mi cuenta',
        items: [
          { label: 'Mi perfil', href: '/terapeuta/perfil', icon: <UserCircle size={16} /> },
          { label: 'Mis certificados', href: '/terapeuta/certificados', icon: <Award size={16} /> },
        ],
      },
      {
        label: 'Trabajo',
        items: [
          { label: 'Mis aplicaciones', href: '/terapeuta/aplicaciones', icon: <ClipboardList size={16} /> },
          { label: 'Mensajes', href: '/terapeuta/mensajes', icon: <MessageCircle size={16} /> },
        ],
      },
    ]
  }

  if (role === 'employer') {
    return [
      {
        items: [
          { label: 'Dashboard', href: '/empleador/dashboard', icon: <LayoutDashboard size={16} /> },
        ],
      },
      {
        label: 'Contratación',
        items: [
          { label: 'Mis vacantes', href: '/empleador/vacantes', icon: <Briefcase size={16} /> },
          { label: 'Aplicaciones', href: '/empleador/aplicaciones', icon: <ClipboardList size={16} /> },
        ],
      },
      {
        label: 'Comunicación',
        items: [
          { label: 'Mensajes', href: '/empleador/mensajes', icon: <MessageCircle size={16} /> },
        ],
      },
    ]
  }

  // admin
  return [
    {
      items: [
        { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={16} /> },
      ],
    },
    {
      label: 'Usuarios',
      items: [
        { label: 'Terapeutas', href: '/admin/terapeutas', icon: <Users size={16} /> },
        { label: 'Empleadores', href: '/admin/empleadores', icon: <Building2 size={16} /> },
      ],
    },
    {
      label: 'Plataforma',
      items: [
        { label: 'Vacantes', href: '/admin/vacantes', icon: <Briefcase size={16} /> },
        { label: 'Aplicaciones', href: '/admin/aplicaciones', icon: <ClipboardList size={16} /> },
        { label: 'Certificados', href: '/admin/certificados', icon: <Award size={16} /> },
        { label: 'Mensajes', href: '/admin/mensajes', icon: <MessageCircle size={16} /> },
      ],
    },
    {
      label: 'Sistema',
      items: [
        { label: 'Auditoría', href: '/admin/auditoria', icon: <History size={16} /> },
        { label: 'Configuración', href: '/admin/configuracion', icon: <Settings size={16} /> },
      ],
    },
  ]
}

// ─── SidebarContent ───────────────────────────────────

function SidebarContent({
  role = 'therapist',
  userName,
  userEmail,
  onLogout,
}: {
  role?: UserRole
  userName?: string
  userEmail?: string
  onLogout?: () => void
}) {
  const { open, animate } = useSidebar()
  const sections = getNavSections(role)

  const roleLabel: Record<UserRole, string> = {
    therapist: 'Terapeuta',
    employer:  'Empleador',
    admin:     'Admin',
  }

  return (
    <div className="flex flex-col h-full">
      <SidebarBrand />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-px">
        {sections.map((section, i) => (
          <div key={i}>
            {section.label && <SectionLabel label={section.label} />}
            {section.items.map(item => (
              <SidebarLink key={item.href} link={item} />
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-3 border-t border-white/8 space-y-px">
        {(userName || userEmail) && (
          <div className="px-2.5 py-2 mb-1">
            <motion.div
              animate={{
                display: animate ? (open ? 'block' : 'none') : 'block',
                opacity: animate ? (open ? 1 : 0) : 1,
              }}
            >
              {userName && (
                <p className="text-[13px] font-medium text-white truncate">{userName}</p>
              )}
              {userEmail && (
                <p className="text-[11px] text-white/40 truncate">{userEmail}</p>
              )}
              <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide text-[#2FB7A3]">
                {roleLabel[role]}
              </span>
            </motion.div>
          </div>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-3 rounded-md px-2.5 py-2 text-[13.5px] w-full transition-colors duration-100 text-white/40 hover:bg-red-500/10 hover:text-red-400"
          >
            <span className="shrink-0 w-[18px] h-[18px] flex items-center justify-center">
              <LogOut size={16} />
            </span>
            <motion.span
              animate={{
                display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
                opacity: animate ? (open ? 1 : 0) : 1,
              }}
              className="truncate !p-0 !m-0 leading-none whitespace-nowrap"
            >
              Cerrar sesión
            </motion.span>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Default export ───────────────────────────────────

export default function SidebarNavigation({
  role,
  userName,
  userEmail,
  onLogout,
}: {
  role?: UserRole
  userName?: string
  userEmail?: string
  onLogout?: () => void
}) {
  return (
    <Sidebar animate>
      <SidebarBody>
        <SidebarContent
          role={role}
          userName={userName}
          userEmail={userEmail}
          onLogout={onLogout}
        />
      </SidebarBody>
    </Sidebar>
  )
}
