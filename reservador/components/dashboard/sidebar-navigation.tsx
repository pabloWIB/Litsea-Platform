"use client";

import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  List,
  Plus,
  CalendarDays,
  Users,
  Tent,
  BarChart3,
  Settings,
  LogOut,
  Star,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

// ─── Context ─────────────────────────────────────────────────────

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// ─── Sidebar shell ───────────────────────────────────────────────

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => (
  <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
    {children}
  </SidebarProvider>
);

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => (
  <>
    <DesktopSidebar {...props} />
    <MobileSidebar {...(props as unknown as React.ComponentProps<"div">)} />
  </>
);

// ─── Desktop sidebar ─────────────────────────────────────────────

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-2 py-4 hidden md:flex md:flex-col shrink-0",
        "bg-white border-r border-neutral-200/80",
        className
      )}
      animate={{ width: animate ? (open ? "240px" : "62px") : "240px" }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ─── Mobile sidebar ──────────────────────────────────────────────

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className="h-14 px-4 flex flex-row md:hidden items-center justify-between w-full bg-white border-b border-neutral-200"
      {...props}
    >
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <Image
          src="/web-app-manifest-512x512-color.png"
          alt="Reserva del Ruiz"
          width={30}
          height={30}
          className="size-8 rounded-lg object-contain"
          priority
        />
        <span className="text-sm font-semibold text-neutral-900">Reserva del Ruiz</span>
      </Link>
      <button
        className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-md"
        onClick={() => setOpen(!open)}
      >
        <IconMenu2 size={20} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "fixed inset-0 h-full w-72 z-[9999] flex flex-col",
              "bg-white border-r border-neutral-200 px-2 py-4",
              className
            )}
          >
            <button
              className="absolute right-4 top-4 p-1.5 text-neutral-500 hover:bg-neutral-100 rounded-md"
              onClick={() => setOpen(false)}
            >
              <IconX size={20} />
            </button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Nav link ────────────────────────────────────────────────────

export const SidebarLink = ({
  link,
  className,
  badge,
}: {
  link: NavItem;
  className?: string;
  badge?: number;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();

  const isActive =
    link.href === "/dashboard"
      ? pathname === "/dashboard"
      : link.href === "/reservations"
      ? pathname === "/reservations" || (pathname.startsWith("/reservations/") && !pathname.startsWith("/reservations/new"))
      : pathname.startsWith(link.href);

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-2.5 py-2 text-[14px] transition-colors duration-100",
        isActive
          ? "bg-orange-50 text-orange-600 font-semibold"
          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
        className
      )}
    >
      <span className="shrink-0 w-[20px] h-[20px] flex items-center justify-center relative">
        {link.icon}
        {badge != null && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </span>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="truncate !p-0 !m-0 leading-none flex-1 whitespace-nowrap"
      >
        {link.label}
      </motion.span>
      {badge != null && badge > 0 && (
        <motion.span
          animate={{
            display: animate ? (open ? "inline-flex" : "none") : "inline-flex",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold items-center justify-center leading-none px-1"
        >
          {badge > 99 ? "99+" : badge}
        </motion.span>
      )}
    </Link>
  );
};

// ─── Section label ───────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  const { open, animate } = useSidebar();
  return (
    <motion.p
      animate={{
        display: animate ? (open ? "block" : "none") : "block",
        opacity: animate ? (open ? 1 : 0) : 1,
      }}
      className="px-2.5 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 select-none"
    >
      {label}
    </motion.p>
  );
}

// ─── Brand ───────────────────────────────────────────────────────

function SidebarBrand() {
  const { open, animate } = useSidebar();
  return (
    <div className="px-2.5 mb-4 flex items-center gap-3 h-9">
      <Image
        src="/web-app-manifest-512x512-color.png"
        alt="Reserva del Ruiz"
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-lg object-contain"
        priority
      />
      <motion.div
        animate={{
          display: animate ? (open ? "block" : "none") : "block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="min-w-0"
      >
        <p className="text-sm font-semibold text-neutral-900 leading-tight truncate">
          Reserva del Ruiz
        </p>
        <p className="text-[10px] text-neutral-400 leading-tight">Glamping · Panel</p>
      </motion.div>
    </div>
  );
}

// ─── Nav sections ────────────────────────────────────────────────

const navSections: NavSection[] = [
  {
    items: [
      { label: "Dashboard",       href: "/dashboard",        icon: <LayoutDashboard size={17} /> },
    ],
  },
  {
    label: "Reservas",
    items: [
      { label: "Todas las reservas", href: "/reservations",  icon: <List size={17} /> },
      { label: "Disponibilidad",     href: "/availability",  icon: <CalendarDays size={17} /> },
    ],
  },
  {
    label: "Gestión",
    items: [
      { label: "Clientes",  href: "/clients",  icon: <Users size={17} /> },
      { label: "Planes",    href: "/plans",    icon: <Tent size={17} /> },
      { label: "Reseñas",   href: "/reviews",  icon: <Star size={17} /> },
      { label: "Reportes",  href: "/reports",  icon: <BarChart3 size={17} /> },
    ],
  },
  {
    label: "Sistema",
    items: [
      { label: "Configuración", href: "/settings", icon: <Settings size={17} /> },
    ],
  },
];

// ─── Sidebar content ─────────────────────────────────────────────

function SidebarContent({ onLogout }: { onLogout?: () => void }) {
  const { open, animate } = useSidebar();

  return (
    <div className="flex flex-col h-full">
      <SidebarBrand />

      {/* Nueva reserva CTA */}
      <Link
        href="/reservations/new"
        className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 mb-3 text-[14px] font-semibold transition-colors bg-orange-500 hover:bg-orange-600 text-white"
      >
        <span className="shrink-0 w-[20px] h-[20px] flex items-center justify-center">
          <Plus size={17} />
        </span>
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="truncate !p-0 !m-0 leading-none whitespace-nowrap"
        >
          Nueva reserva
        </motion.span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-px">
        {navSections.map((section, i) => (
          <div key={i}>
            {section.label && <SectionLabel label={section.label} />}
            {section.items.map((item) => (
              <SidebarLink key={item.href} link={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-2 border-t border-neutral-200 space-y-px">
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-3 rounded-md px-2.5 py-2 text-[14px] w-full transition-colors duration-100 text-neutral-500 hover:bg-red-50 hover:text-red-600"
          >
            <span className="shrink-0 w-[20px] h-[20px] flex items-center justify-center">
              <LogOut size={17} />
            </span>
            <motion.span
              animate={{
                display: animate ? (open ? "inline-block" : "none") : "inline-block",
                opacity: animate ? (open ? 1 : 0) : 1,
              }}
              className="truncate !p-0 !m-0 leading-none"
            >
              Cerrar sesión
            </motion.span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Export ──────────────────────────────────────────────────────

export default function SidebarNavigation({
  onLogout,
}: {
  onLogout?: () => void;
}) {
  return (
    <Sidebar animate>
      <SidebarBody className="justify-between gap-10">
        <SidebarContent onLogout={onLogout} />
      </SidebarBody>
    </Sidebar>
  );
}
