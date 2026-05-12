'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Trash2, Star } from 'lucide-react'

type Review = {
  id: string
  name: string
  location: string
  body: string
  status: 'pending' | 'approved'
  created_at: string
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function ReviewsModerationList({ reviews: initial }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState(initial)
  const [tab, setTab]         = useState<'pending' | 'approved'>('pending')
  const [busy, setBusy]       = useState<string | null>(null)

  const pending  = reviews.filter((r) => r.status === 'pending')
  const approved = reviews.filter((r) => r.status === 'approved')
  const visible  = tab === 'pending' ? pending : approved

  const approve = async (id: string) => {
    setBusy(id)
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'PATCH' })
      if (res.ok) setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: 'approved' } : r))
    } finally {
      setBusy(null)
    }
  }

  const remove = async (id: string) => {
    setBusy(id)
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== id))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 rounded-xl p-1 w-fit mb-6">
        {([
          ['pending',  'Pendientes', pending.length,  'text-orange-600 bg-orange-100'],
          ['approved', 'Aprobadas',  approved.length, 'text-green-700 bg-green-100' ],
        ] as const).map(([value, label, count, badgeClass]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === value ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {label}
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
              tab === value ? badgeClass : 'bg-neutral-200 text-neutral-500'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <Star size={28} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-sm">
            {tab === 'pending' ? 'No hay opiniones pendientes.' : 'No hay opiniones aprobadas aún.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {visible.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 24, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-neutral-100 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1.5">
                      <p className="font-semibold text-neutral-900 text-sm">{r.name}</p>
                      {r.location && (
                        <span className="text-neutral-400 text-xs">· {r.location}</span>
                      )}
                      <span className="text-neutral-300 text-xs">{fmtDate(r.created_at)}</span>
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed">"{r.body}"</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {r.status === 'pending' && (
                      <button
                        onClick={() => approve(r.id)}
                        disabled={busy === r.id}
                        className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Check size={13} />
                        Aprobar
                      </button>
                    )}
                    <button
                      onClick={() => remove(r.id)}
                      disabled={busy === r.id}
                      className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
