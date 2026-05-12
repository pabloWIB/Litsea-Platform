'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { MapPin, CheckCircle2 } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1] as const

const TERAPEUTAS = [
  {
    id: '1',
    nombre: 'Ana Lucía Méndez',
    ubicacion: 'Playa del Carmen',
    especialidades: ['Sueco', 'Hot Stone', 'Drenaje Linfático'],
    initials: 'AL',
  },
  {
    id: '2',
    nombre: 'Daniela Ríos',
    ubicacion: 'Tulum',
    especialidades: ['Hidrafacial', 'Radiofrecuencia', 'Limpieza Profunda'],
    initials: 'DR',
  },
  {
    id: '3',
    nombre: 'Karla Villanueva',
    ubicacion: 'Playa del Carmen',
    especialidades: ['Aromaterapia', 'Reflexología', 'Deep Tissue'],
    initials: 'KV',
  },
  {
    id: '4',
    nombre: 'Sofía Castillo',
    ubicacion: 'Cancún',
    especialidades: ['Sueco', 'Shiatsu', 'Prenatal'],
    initials: 'SC',
  },
  {
    id: '5',
    nombre: 'Valentina Torres',
    ubicacion: 'Playa del Carmen',
    especialidades: ['Hatha Yoga', 'Meditación', 'Respiración'],
    initials: 'VT',
  },
  {
    id: '6',
    nombre: 'Mariana López',
    ubicacion: 'Tulum',
    especialidades: ['Hot Stone', 'Deep Tissue', 'Sueco'],
    initials: 'ML',
  },
]

export default function TerapeutasDestacados() {
  const t = useTranslations('terapeutasDestacados')

  return (
    <section className="bg-[#071210] py-20 md:py-28 px-4">
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 md:mb-16 flex items-end justify-between"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-4">
              {t('label')}
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-[0.95]">
              {t('title1')}<br />
              <span className="text-[#2FB7A3]">{t('title2')}</span>
            </h2>
          </div>
          <Link
            href="/terapeutas"
            className="hidden md:inline-flex text-sm text-white/40 hover:text-[#2FB7A3] transition-colors font-medium"
          >
            {t('verDirectorio')}
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-white/6 rounded-2xl overflow-hidden">
          {TERAPEUTAS.map((t2, i) => (
            <motion.div
              key={t2.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
              className="bg-[#071210] p-7 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#2FB7A3]/12 border border-[#2FB7A3]/18 flex items-center justify-center shrink-0">
                  <span className="text-[#2FB7A3] font-bold text-sm">{t2.initials}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-white truncate">{t2.nombre}</p>
                    <CheckCircle2 className="size-3.5 text-[#2FB7A3] shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3 text-white/28 shrink-0" />
                    <p className="text-[11px] text-white/38">{t2.ubicacion}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {t2.especialidades.map((e) => (
                  <span
                    key={e}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/48 border border-white/8"
                  >
                    {e}
                  </span>
                ))}
              </div>

              <Link
                href={`/terapeutas/${t2.id}`}
                className="text-[12px] text-white/32 hover:text-[#2FB7A3] transition-colors mt-auto"
              >
                {t('verPerfil')}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-center md:hidden"
        >
          <Link href="/terapeutas" className="text-sm text-white/40 hover:text-[#2FB7A3] transition-colors font-medium">
            {t('verDirectorio')}
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
