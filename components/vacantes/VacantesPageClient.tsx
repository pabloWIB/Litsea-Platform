'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MapPin, Briefcase, ChevronDown, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const EASE = [0.22, 1, 0.36, 1] as const

const VACANTES = [
  {
    id: '1',
    titulo: 'Masajista Terapéutico',
    hotel: 'Grand Velas Riviera Maya',
    ubicacion: 'Playa del Carmen',
    contrato: 'Tiempo completo',
    especialidades: ['Sueco', 'Deep Tissue', 'Drenaje Linfático'],
    fechaPublicacion: 'Hace 2 días',
  },
  {
    id: '2',
    titulo: 'Especialista en Tratamientos Faciales',
    hotel: 'Rosewood Mayakoba',
    ubicacion: 'Playa del Carmen',
    contrato: 'Por temporada',
    especialidades: ['Hidrafacial', 'Radiofrecuencia', 'Limpieza Profunda'],
    fechaPublicacion: 'Hace 3 días',
  },
  {
    id: '3',
    titulo: 'Terapeuta Corporal Senior',
    hotel: 'Banyan Tree Mayakoba',
    ubicacion: 'Playa del Carmen',
    contrato: 'Tiempo completo',
    especialidades: ['Hot Stones', 'Aromaterapia', 'Reflexología'],
    fechaPublicacion: 'Hace 5 días',
  },
  {
    id: '4',
    titulo: 'Instructora de Yoga & Bienestar',
    hotel: 'Hotel Xcaret Arte',
    ubicacion: 'Playa del Carmen',
    contrato: 'Medio tiempo',
    especialidades: ['Hatha Yoga', 'Meditación', 'Respiración'],
    fechaPublicacion: 'Hace 1 semana',
  },
  {
    id: '5',
    titulo: 'Terapeuta de Masajes Deportivos',
    hotel: 'Hyatt Ziva Cancún',
    ubicacion: 'Cancún',
    contrato: 'Tiempo completo',
    especialidades: ['Deportivo', 'Deep Tissue', 'Vendaje'],
    fechaPublicacion: 'Hace 1 semana',
  },
  {
    id: '6',
    titulo: 'Especialista en Belleza y Spa',
    hotel: 'Andaz Mayakoba',
    ubicacion: 'Playa del Carmen',
    contrato: 'Por temporada',
    especialidades: ['Manicura', 'Pedicura', 'Tratamientos capilares'],
    fechaPublicacion: 'Hace 2 semanas',
  },
  {
    id: '7',
    titulo: 'Terapeuta de Bienestar',
    hotel: 'Be Tulum',
    ubicacion: 'Tulum',
    contrato: 'Tiempo completo',
    especialidades: ['Sueco', 'Aromaterapia', 'Reiki'],
    fechaPublicacion: 'Hace 2 semanas',
  },
  {
    id: '8',
    titulo: 'Masajista en Spa de Lujo',
    hotel: 'Azulik Resort',
    ubicacion: 'Tulum',
    contrato: 'Por temporada',
    especialidades: ['Sueco', 'Piedras calientes', 'Reflexología'],
    fechaPublicacion: 'Hace 3 semanas',
  },
]

const ZONAS    = ['Todas las zonas', 'Cancún', 'Playa del Carmen', 'Tulum']
const CONTRATOS = ['Cualquier contrato', 'Tiempo completo', 'Por temporada', 'Medio tiempo']

export default function VacantesPageClient() {
  const [zona,     setZona]     = useState('Todas las zonas')
  const [contrato, setContrato] = useState('Cualquier contrato')
  const [query,    setQuery]    = useState('')

  const filtered = useMemo(() => {
    return VACANTES.filter(v => {
      const matchZona     = zona === 'Todas las zonas' || v.ubicacion === zona
      const matchContrato = contrato === 'Cualquier contrato' || v.contrato === contrato
      const matchQuery    = !query || v.titulo.toLowerCase().includes(query.toLowerCase())
        || v.hotel.toLowerCase().includes(query.toLowerCase())
        || v.especialidades.some(e => e.toLowerCase().includes(query.toLowerCase()))
      return matchZona && matchContrato && matchQuery
    })
  }, [zona, contrato, query])

  const hasFilters = zona !== 'Todas las zonas' || contrato !== 'Cualquier contrato' || query

  const clearFilters = () => {
    setZona('Todas las zonas')
    setContrato('Cualquier contrato')
    setQuery('')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-10"
      >
        <p className="text-[11px] uppercase tracking-[0.25em] text-[#2FB7A3] font-bold mb-3">
          Oportunidades
        </p>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#00372c] leading-[0.95]">
          Vacantes<br />
          <span className="text-[#2FB7A3]">disponibles.</span>
        </h1>
        <p className="mt-4 text-sm text-[#00372c]/50 max-w-md">
          Posiciones en hoteles y spas de lujo de la Riviera Maya. Solo terapeutas certificados por Litsea.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
        className="mb-8 flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por puesto, hotel o especialidad..."
            className="w-full rounded-xl border border-[#00372c]/10 bg-white px-4 py-2.5 text-sm text-[#00372c] placeholder:text-[#00372c]/30 outline-none focus:ring-2 focus:ring-[#2FB7A3]/30 focus:border-[#2FB7A3]/50 transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-[#00372c]/30 hover:text-[#00372c]/70 transition-colors">
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <select
            value={zona}
            onChange={e => setZona(e.target.value)}
            className="appearance-none rounded-xl border border-[#00372c]/10 bg-white pl-4 pr-9 py-2.5 text-sm text-[#00372c] outline-none focus:ring-2 focus:ring-[#2FB7A3]/30 focus:border-[#2FB7A3]/50 transition-all cursor-pointer"
          >
            {ZONAS.map(z => <option key={z}>{z}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-[#00372c]/40 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={contrato}
            onChange={e => setContrato(e.target.value)}
            className="appearance-none rounded-xl border border-[#00372c]/10 bg-white pl-4 pr-9 py-2.5 text-sm text-[#00372c] outline-none focus:ring-2 focus:ring-[#2FB7A3]/30 focus:border-[#2FB7A3]/50 transition-all cursor-pointer"
          >
            {CONTRATOS.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-[#00372c]/40 pointer-events-none" />
        </div>
      </motion.div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-[12px] text-[#00372c]/40">
          {filtered.length} {filtered.length === 1 ? 'vacante' : 'vacantes'} encontradas
        </p>
        {hasFilters && (
          <button onClick={clearFilters}
            className="text-[12px] text-[#2FB7A3] hover:text-[#1d9a89] transition-colors flex items-center gap-1">
            <X className="size-3" /> Limpiar filtros
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-[#00372c]/30 text-sm">No se encontraron vacantes con esos filtros.</p>
          <button onClick={clearFilters}
            className="mt-3 text-[#2FB7A3] text-sm hover:text-[#1d9a89] transition-colors underline underline-offset-2">
            Ver todas las vacantes
          </button>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-px bg-[#00372c]/6 rounded-2xl overflow-hidden">
          {filtered.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
              className="bg-[#FDFAF5] p-6 flex flex-col gap-4"
            >
              <div>
                <p className="text-[11px] text-[#2FB7A3] font-semibold uppercase tracking-wide mb-1.5">
                  {v.hotel}
                </p>
                <h2 className="text-base font-bold text-[#00372c] leading-snug">{v.titulo}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[11px] text-[#00372c]/40">
                    <MapPin className="size-3 shrink-0" />{v.ubicacion}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-[#00372c]/40">
                    <Briefcase className="size-3 shrink-0" />{v.contrato}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {v.especialidades.map(e => (
                  <span key={e}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#2FB7A3]/8 text-[#2FB7A3] border border-[#2FB7A3]/15">
                    {e}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-2 flex items-center justify-between">
                <span className="text-[10px] text-[#00372c]/25">{v.fechaPublicacion}</span>
                <Link href={`/vacantes/${v.id}`}>
                  <HoverBorderGradient
                    as="div"
                    containerClassName="cursor-pointer"
                    backdropClassName="bg-[#2FB7A3]"
                    className="px-5 py-2 text-xs font-semibold text-white"
                  >
                    Ver vacante
                  </HoverBorderGradient>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-sm text-[#00372c]/40 mb-4">
          ¿Eres empleador? Publica tus vacantes gratis.
        </p>
        <Link href="/registro-empleador">
          <HoverBorderGradient
            as="div"
            containerClassName="cursor-pointer inline-flex"
            backdropClassName="bg-[#2FB7A3]"
            className="px-7 py-3 text-sm font-semibold text-white"
          >
            Publicar vacante
          </HoverBorderGradient>
        </Link>
      </motion.div>

    </div>
  )
}
