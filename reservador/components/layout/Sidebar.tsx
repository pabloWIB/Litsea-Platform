"use client";

import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { usePathname, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  CalendarDays,
  FolderKanban,
  Package,
  ContactRound,
  LogOut,
  Languages,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

type UserRole = "admin" | "manager" | "employee";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

interface NavSection {
  label?: string;
  items: NavItem[];
  roles?: UserRole[];
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

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
  <div className="flex">
    <DesktopSidebar {...props} />
    <MobileSidebar {...(props as React.ComponentProps<"div">)} />
  </div>
);

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-2 py-4 hidden md:flex md:flex-col shrink-0 bg-[#0A0A0A]",
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

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();

  return (
    <div
      className="h-14 px-4 flex flex-row md:hidden items-center justify-between w-full bg-[#0A0A0A]"
      {...props}
    >
      <div className="flex items-center gap-2">
        <Image
          src="/web-app-manifest-512x512.png"
          alt="BMCoreCut"
          width={24}
          height={24}
          className="rounded-[6px]"
          priority
        />
        <span className="text-white font-bold text-sm tracking-tight">BMCoreCut</span>
      </div>
      <button
        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
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
              "fixed inset-0 h-full w-full z-[9999] flex flex-col bg-[#0A0A0A] px-2 py-4",
              className
            )}
          >
            <button
              className="absolute right-4 top-4 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
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

export const SidebarLink = ({
  link,
  className,
}: {
  link: NavItem;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  const isActive =
    link.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(link.href);

  return (
    <Link
      href={link.href}
      className={cn(
        "relative flex items-center gap-3 rounded-md px-2.5 py-2 text-[14px] transition-colors duration-100",
        isActive
          ? "text-white font-medium bg-white/8"
          : "text-white/60 hover:text-white hover:bg-white/6",
        className
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#E8950A]" />
      )}
      <span className="shrink-0 w-[20px] h-[20px] flex items-center justify-center">
        {link.icon}
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
    </Link>
  );
};

function SectionLabel({ label }: { label: string }) {
  const { open, animate } = useSidebar();
  return (
    <motion.p
      animate={{
        display: animate ? (open ? "block" : "none") : "block",
        opacity: animate ? (open ? 1 : 0) : 1,
      }}
      className="px-2.5 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30 select-none"
    >
      {label}
    </motion.p>
  );
}

function SidebarBrand() {
  const { open, animate } = useSidebar();
  return (
    <div className="px-2.5 mb-5 flex items-center gap-2.5 h-9">
      <Image
        src="/web-app-manifest-512x512.png"
        alt="BMCoreCut"
        width={28}
        height={28}
        className="rounded-[8px] shrink-0"
        priority
      />
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-white font-bold text-[15px] tracking-tight whitespace-nowrap"
      >
        BMCoreCut
      </motion.span>
    </div>
  );
}

function SidebarContent({
  onLogout,
  role,
  userName,
  userEmail,
}: {
  onLogout?: () => void;
  role?: UserRole;
  userName?: string;
  userEmail?: string;
}) {
  const { open, animate } = useSidebar();
  const t = useTranslations("sidebar");

  const navSections: NavSection[] = [
    {
      items: [
        { label: t("dashboard"), href: "/dashboard", icon: <LayoutDashboard size={17} /> },
      ],
    },
    {
      label: t("people"),
      items: [
        { label: t("employees"), href: "/employees", icon: <Users size={17} />, roles: ["admin", "manager"] },
        { label: t("leave"), href: "/leave", icon: <CalendarDays size={17} /> },
      ],
    },
    {
      label: t("work"),
      items: [
        { label: t("timeLogging"), href: "/time-logging", icon: <Clock size={17} /> },
        { label: t("dailyReports"), href: "/daily-reports", icon: <FileText size={17} /> },
        { label: t("projects"), href: "/projects", icon: <FolderKanban size={17} /> },
      ],
    },
    {
      label: t("operations"),
      items: [
        { label: t("assets"), href: "/assets", icon: <Package size={17} /> },
        { label: t("crm"), href: "/crm", icon: <ContactRound size={17} /> },
      ],
      roles: ["admin", "manager"],
    },
  ];

  const visibleSections = navSections
    .filter((s) => !s.roles || !role || s.roles.includes(role))
    .map((s) => ({
      ...s,
      items: s.items.filter((item) => !item.roles || !role || item.roles.includes(role)),
    }))
    .filter((s) => s.items.length > 0);

  return (
    <div className="flex flex-col h-full">
      <SidebarBrand />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-px">
        {visibleSections.map((section, i) => (
          <div key={i}>
            {section.label && <SectionLabel label={section.label} />}
            {section.items.map((item) => (
              <SidebarLink key={item.href} link={item} />
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-3 border-t border-white/10 space-y-px">
        {(userName || userEmail) && (
          <div className="px-2.5 py-2 mb-1">
            <motion.div
              animate={{
                display: animate ? (open ? "block" : "none") : "block",
                opacity: animate ? (open ? 1 : 0) : 1,
              }}
            >
              <p className="text-[13px] font-medium text-white truncate">{userName}</p>
              <p className="text-[11px] text-white/40 truncate">{userEmail}</p>
              {role && (
                <span className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide text-[#E8950A]">
                  {role}
                </span>
              )}
            </motion.div>
          </div>
        )}

        <div className="md:hidden flex items-center gap-3 rounded-md px-2.5 py-2">
          <span className="shrink-0 w-[20px] h-[20px] flex items-center justify-center text-white/50">
            <Languages size={17} />
          </span>
          <LanguageSwitcher variant="dark" />
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-3 rounded-md px-2.5 py-2 text-[14px] w-full transition-colors duration-100 text-white/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <span className="shrink-0 w-[20px] h-[20px] flex items-center justify-center">
              <LogOut size={17} />
            </span>
            <motion.span
              animate={{
                display: animate ? (open ? "inline-block" : "none") : "inline-block",
                opacity: animate ? (open ? 1 : 0) : 1,
              }}
              className="truncate !p-0 !m-0 leading-none whitespace-nowrap"
            >
              {t("signOut")}
            </motion.span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function SidebarNavigation({
  onLogout,
  role,
  userName,
  userEmail,
}: {
  onLogout?: () => void;
  role?: UserRole;
  userName?: string;
  userEmail?: string;
}) {
  return (
    <Sidebar animate>
      <SidebarBody>
        <SidebarContent
          onLogout={onLogout}
          role={role}
          userName={userName}
          userEmail={userEmail}
        />
      </SidebarBody>
    </Sidebar>
  );
}
