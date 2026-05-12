'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { useTranslations } from 'next-intl'

const ease = [0.22, 1, 0.36, 1] as const

const inputClass =
  'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-200'
const labelClass =
  'block text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1.5 select-none'

export default function ReviewForm() {
  const t = useTranslations('reviews')
  const [form, setForm] = useState({ name: '', location: '', body: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 sm:p-8">
      <h2 className="text-lg font-bold text-neutral-900 mb-6">{t('formTitle')}</h2>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="rev-name">
                  {t('nameLabel')}
                </label>
                <input
                  id="rev-name"
                  type="text"
                  className={inputClass}
                  placeholder={t('namePlaceholder')}
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="rev-location">
                  {t('locationLabel')}
                </label>
                <input
                  id="rev-location"
                  type="text"
                  className={inputClass}
                  placeholder={t('locationPlaceholder')}
                  value={form.location}
                  onChange={set('location')}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="rev-body">
                {t('textLabel')}
              </label>
              <textarea
                id="rev-body"
                rows={4}
                className={inputClass + ' resize-none'}
                placeholder={t('textPlaceholder')}
                value={form.body}
                onChange={set('body')}
                required
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600">
                {error}
              </p>
            )}

            <HoverBorderGradient
              as="button"
              type="submit"
              disabled={loading}
              containerClassName="border-orange-400 cursor-pointer w-full disabled:opacity-60"
              className="bg-orange-500 text-white text-sm font-semibold px-7 py-3 w-full flex items-center justify-center"
            >
              {loading ? 'Enviando…' : t('submit')}
            </HoverBorderGradient>

            <p className="text-center text-xs text-neutral-400">{t('footerNote')}</p>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="rounded-2xl border border-orange-200 bg-orange-50 p-8 text-center"
          >
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-orange-500">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-900">¡Gracias!</h3>
            <p className="mt-2 text-sm text-neutral-500">{t('successMsg')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
