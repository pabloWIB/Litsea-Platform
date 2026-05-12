'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

const WHATSAPP_NUMBER = '573152779642'

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="fill-white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.544 4.07 1.497 5.783L0 24l6.395-1.68A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.795.997 1.013-3.7-.233-.38A9.818 9.818 0 0112 2.182c5.424 0 9.818 4.394 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z" />
  </svg>
)

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('whatsapp')
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('defaultMessage'))}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-72 rounded-2xl border border-neutral-200 bg-white overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-[#25D366] px-4 py-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-white/20">
                <span className="size-5">{WA_ICON}</span>
              </div>
              <p className="flex-1 text-sm font-semibold text-white">{t('name')}</p>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors outline-none"
                aria-label="Cerrar"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Mensaje */}
            <div className="p-4">
              <div className="rounded-xl rounded-tl-sm bg-neutral-100 px-3.5 py-2.5 max-w-[85%]">
                <p className="text-sm text-neutral-800 leading-relaxed">
                  {t('bubble')}
                </p>
                <p className="mt-1 text-[10px] text-neutral-400">ahora</p>
              </div>
            </div>

            {/* CTA */}
            <div className="px-4 pb-4">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#20b858] active:scale-[0.98]"
              >
                <span className="size-4">{WA_ICON}</span>
                {t('startChat')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <motion.button
        onClick={() => setOpen(prev => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center rounded-full bg-[#25D366] p-2.5 outline-none"
        aria-label="WhatsApp"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x"
              initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}
            >
              <X className="size-6 text-white" />
            </motion.span>
          ) : (
            <motion.span key="wa"
              initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }}
              className="size-7"
            >
              {WA_ICON}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

    </div>
  )
}
