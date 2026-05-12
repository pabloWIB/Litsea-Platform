"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"
import Image from "next/image"
import { useTranslations } from 'next-intl'
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

const ease = [0.0, 0.0, 0.2, 1] as const

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

const inputClass =
  "w-full rounded-xl border border-[#2A1F0E]/15 bg-white px-4 py-3 text-sm text-[#2A1F0E] placeholder:text-[#2A1F0E]/40 outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-200"

const labelClass =
  "block text-xs font-semibold uppercase tracking-wide text-[#2A1F0E]/60 mb-1.5 select-none"

const PLANES = [
  "Plan Pareja Semana",
  "Plan Pareja Fin de semana",
  "Plan Pareja Pasadía",
  "Plan Familiar 3 personas",
  "Plan Familiar 4 personas",
  "Plan Familiar Pasadía",
]

interface FormData {
  nombre: string
  telefono: string
  fechaIngreso: string
  plan: string
}

export default function GlampingContactForm() {
  const t = useTranslations('contact')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const [form, setForm] = useState<FormData>({
    nombre: "", telefono: "", fechaIngreso: "", plan: "",
  })

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? t('errorMsg'))
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorMsg'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-[#FDFAF5] px-4 py-20 lg:px-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          className="grid grid-cols-1 gap-12 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="flex flex-col justify-center">
            <motion.p variants={itemVariants} className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
              {t('reserveKicker')}
            </motion.p>
            <motion.h2 variants={itemVariants} className="text-3xl font-black text-[#2A1F0E] tracking-tight md:text-4xl">
              {t('titleShort')}
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-3 text-sm text-[#2A1F0E]/60 leading-relaxed max-w-sm">
              {t('descShort')}
            </motion.p>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  variants={itemVariants}
                  onSubmit={handleSubmit}
                  className="mt-8 flex flex-col gap-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} htmlFor="nombre">{t('nameLabel')}</label>
                      <input id="nombre" type="text" className={inputClass} placeholder={t('nameLabel')} value={form.nombre} onChange={set("nombre")} required />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="telefono">{t('phoneLabel')}</label>
                      <input id="telefono" type="tel" className={inputClass} placeholder="+57 300 000 0000" value={form.telefono} onChange={set("telefono")} required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} htmlFor="plan">{t('planLabel')}</label>
                      <select id="plan" className={inputClass + " cursor-pointer"} value={form.plan} onChange={set("plan")} required>
                        <option value="">{t('planPlaceholder')}</option>
                        {PLANES.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="fechaIngreso">{t('dateLabel')}</label>
                      <input id="fechaIngreso" type="date" className={inputClass} value={form.fechaIngreso} onChange={set("fechaIngreso")} />
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600">{error}</p>
                  )}

                  <HoverBorderGradient
                    as="button"
                    type="submit"
                    disabled={loading}
                    containerClassName="border-orange-400 cursor-pointer w-full disabled:opacity-60"
                    className="bg-orange-500 text-white text-sm font-semibold px-7 py-3 w-full flex items-center justify-center"
                  >
                    {loading ? t('sending') : t('submit')}
                  </HoverBorderGradient>

                  <p className="text-center text-xs text-[#2A1F0E]/40">
                    {t('privacyPrefix')}{" "}
                    <a href="/privacidad" className="underline underline-offset-2 hover:text-[#2A1F0E]/70 transition-colors">{t('privacyLink')}</a>.
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-8 text-center"
                >
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-orange-500">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#2A1F0E]">{t('receivedTitle')}</h3>
                  <p className="mt-2 text-sm text-[#2A1F0E]/60">{t('receivedDesc')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative flex flex-col overflow-hidden rounded-3xl min-h-[480px]"
          >
            <div className="absolute inset-0">
              <Image
                src="/ilustracion-pareja-glamping.webp"
                alt="Glamping Reserva del Ruiz"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/[0.65]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#FCE0C0]/8 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-8 md:p-10 justify-end">
              <h3 className="text-2xl font-black text-white leading-tight">
                {t('mainImage')}
              </h3>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
