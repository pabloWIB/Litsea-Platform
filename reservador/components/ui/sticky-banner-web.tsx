"use client"
import React, { SVGProps } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export const StickyBanner = ({
  className,
  children,
  onClose,
  open = true,
}: {
  className?: string
  children: React.ReactNode
  onClose?: () => void
  open?: boolean
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: -56 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -56 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[200] grid h-14 w-full grid-cols-[1fr_auto_1fr] items-center px-4",
          className,
        )}
      >
        <div aria-hidden />

        <div className="flex justify-center">
          {children}
        </div>

        <div className="flex justify-end pr-2">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex items-center justify-center size-7 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <CloseIcon className="h-4 w-4 text-white" />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </svg>
)
