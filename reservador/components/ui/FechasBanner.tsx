'use client'

import { StickyBanner } from '@/components/ui/sticky-banner-web'

const FECHAS = [
  { m: 2,  d: 9,  nombre: 'Día del Periodista' },
  { m: 2,  d: 14, nombre: 'Día de San Valentín' },
  { m: 2,  d: 20, nombre: 'Día del Camarógrafo y Fotógrafo' },
  { m: 3,  d: 1,  nombre: 'Día del Contador' },
  { m: 3,  d: 8,  nombre: 'Día Internacional de la Mujer' },
  { m: 3,  d: 12, nombre: 'Día de los Amigos' },
  { m: 3,  d: 14, nombre: 'Día del Trabajador de Construcción' },
  { m: 3,  d: 15, nombre: 'Día Mundial del Consumidor' },
  { m: 3,  d: 19, nombre: 'Día del Hombre' },
  { m: 3,  d: 27, nombre: 'Día Internacional del Teatro' },
  { m: 4,  d: 7,  nombre: 'Día Mundial de la Salud' },
  { m: 4,  d: 10, nombre: 'Día del Florista' },
  { m: 4,  d: 22, nombre: 'Día de la Tierra' },
  { m: 4,  d: 26, nombre: 'Día de la Secretaria' },
  { m: 4,  d: 27, nombre: 'Día del Diseñador Gráfico' },
  { m: 4,  d: 30, nombre: 'Día del Niño' },
  { m: 5,  d: 8,  nombre: 'Día de la Madre' },
  { m: 5,  d: 10, nombre: 'Día del Veterinario' },
  { m: 5,  d: 12, nombre: 'Día de la Enfermera' },
  { m: 5,  d: 15, nombre: 'Día del Maestro' },
  { m: 5,  d: 21, nombre: 'Día de la Afrocolombianidad' },
  { m: 5,  d: 23, nombre: 'Día del Comerciante' },
  { m: 6,  d: 5,  nombre: 'Día del Medio Ambiente' },
  { m: 6,  d: 19, nombre: 'Día del Padre' },
  { m: 6,  d: 22, nombre: 'Día del Abogado' },
  { m: 7,  d: 3,  nombre: 'Día del Economista' },
  { m: 7,  d: 13, nombre: 'Día del Panadero' },
  { m: 7,  d: 16, nombre: 'Día del Transportador' },
  { m: 8,  d: 4,  nombre: 'Día del Periodista y Comunicador' },
  { m: 8,  d: 11, nombre: 'Día del Nutricionista' },
  { m: 8,  d: 17, nombre: 'Día del Ingeniero' },
  { m: 8,  d: 26, nombre: 'Día del Tendero' },
  { m: 8,  d: 28, nombre: 'Día del Adulto Mayor' },
  { m: 9,  d: 17, nombre: 'Día de Amor y Amistad' },
  { m: 9,  d: 27, nombre: 'Día del Turismo' },
  { m: 9,  d: 29, nombre: 'Día Internacional del Café' },
  { m: 10, d: 3,  nombre: 'Día del Odontólogo' },
  { m: 10, d: 4,  nombre: 'Día del Mesero' },
  { m: 10, d: 12, nombre: 'Día de la Raza' },
  { m: 10, d: 20, nombre: 'Día del Cocinero o Chef' },
  { m: 10, d: 22, nombre: 'Día del Trabajador Social' },
  { m: 10, d: 27, nombre: 'Día del Arquitecto' },
  { m: 10, d: 31, nombre: 'Halloween' },
  { m: 11, d: 4,  nombre: 'Día del Administrador' },
  { m: 11, d: 20, nombre: 'Día del Psicólogo' },
  { m: 11, d: 22, nombre: 'Día del Músico' },
  { m: 12, d: 3,  nombre: 'Día Panamericano del Médico' },
  { m: 12, d: 10, nombre: 'Día del Sociólogo' },
  { m: 12, d: 16, nombre: 'Día de Aguinaldo' },
]

const MESES = ['', 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function getClosest() {
  const hoy  = new Date()
  const mes  = hoy.getMonth() + 1
  const dia  = hoy.getDate()

  // Distancia en días dentro del año (número de días desde 1 ene)
  const diaDelAno = (m: number, d: number) =>
    new Date(hoy.getFullYear(), m - 1, d).getTime()

  const hoyCmp = new Date(hoy.getFullYear(), mes - 1, dia).getTime()

  // Diferencia en días — negativa si ya pasó, positiva si viene
  const diff = (f: (typeof FECHAS)[0]) => {
    const ms = diaDelAno(f.m, f.d) - hoyCmp
    return ms / 86_400_000
  }

  // Preferencia: hoy (0) → próximos (+) → más reciente pasado (-)
  const sorted = [...FECHAS].sort((a, b) => {
    const da = diff(a)
    const db = diff(b)
    // Hoy primero, luego futuros ascendentes, luego pasados descendentes
    const score = (d: number) => d >= 0 ? d : 365 + d
    return score(da) - score(db)
  })

  return sorted[0]
}

const WA_HREF =
  'https://wa.me/573152779642?text=Hola!%20Quiero%20reservar%20para%20una%20fecha%20especial%20en%20Glamping%20Reserva%20del%20Ruiz.'

export default function FechasBanner({ onClose, open = true }: { onClose?: () => void; open?: boolean }) {
  const fecha = getClosest()
  if (!fecha) return null

  return (
    <StickyBanner className="bg-[#F97316]" onClose={onClose} open={open}>
      <div className="flex items-center justify-center gap-2 sm:gap-4 text-white">
        <p className="text-sm font-medium leading-none">
          <span className="font-bold">
            {fecha.d} {MESES[fecha.m]}
          </span>
          {' · '}
          {fecha.nombre}
        </p>
        <span className="hidden sm:block text-white/40">—</span>
        <a
          href={WA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-2 hover:text-white/80 transition-colors whitespace-nowrap"
        >
          Celebra con nosotros →
        </a>
      </div>
    </StickyBanner>
  )
}
