'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const EASE = [0.22, 1, 0.36, 1] as const

const VACANTES = [
  {
    id: '1',
    titulo: 'Masajista Terapéutico',
    hotel: 'Grand Velas Riviera Maya',
    ubicacion: 'Playa del Carmen',
    especialidades: ['Sueco', 'Deep Tissue', 'Drenaje Linfático'],
  },
  {
    id: '2',
    titulo: 'Especialista en Tratamientos Faciales',
    hotel: 'Rosewood Mayakoba',
    ubicacion: 'Playa del Carmen',
    especialidades: ['Hidrafacial', 'Radiofrecuencia', 'Limpieza Profunda'],
  },
  {
    id: '3',
    titulo: 'Terapeuta Corporal Senior',
    hotel: 'Banyan Tree Mayakoba',
    ubicacion: 'Playa del Carmen',
    especialidades: ['Hot Stones', 'Aromaterapia', 'Reflexología'],
  },
  {
    id: '4',
    titulo: 'Instructora de Yoga & Bienestar',
    hotel: 'Hotel Xcaret Arte',
    ubicacion: 'Playa del Carmen',
    especialidades: ['Hatha Yoga', 'Meditación', 'Respiración'],
  },
]

export default function VacantesDestacadas() {
  const t = useTranslations('vacantesDestacadas')

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
            href="/vacantes"
            className="hidden md:inline-flex text-sm text-white/40 hover:text-[#2FB7A3] transition-colors font-medium"
          >
            {t('verTodas')}
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-px bg-white/6 rounded-2xl overflow-hidden">
          {VACANTES.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.09 }}
              className="bg-[#071210] p-7 flex flex-col gap-4"
            >
              <div>
                <p className="text-[11px] text-[#2FB7A3] font-semibold uppercase tracking-wide mb-1.5">
                  {v.hotel}
                </p>
                <h3 className="text-lg font-bold text-white leading-snug">{v.titulo}</h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <MapPin className="size-3.5 text-white/28 shrink-0" />
                  <span className="text-[12px] text-white/38">{v.ubicacion}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {v.especialidades.map((e) => (
                  <span
                    key={e}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 text-white/50 border border-white/8"
                  >
                    {e}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-2">
                <Link href={`/vacantes/${v.id}`}>
                  <HoverBorderGradient
                    as="div"
                    containerClassName="cursor-pointer border-white/15 w-fit"
                    backdropClassName="bg-white/5"
                    className="px-5 py-2 text-xs font-semibold text-white/65 hover:text-white"
                  >
                    {t('verVacante')}
                  </HoverBorderGradient>
                </Link>
              </div>
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
          <Link href="/vacantes" className="text-sm text-white/40 hover:text-[#2FB7A3] transition-colors font-medium">
            {t('verTodas')}
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
