'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Photo = { src: string; alt: string; cat: string }

const PHOTOS: Photo[] = [
  { src: '/bienvenida-glamping.webp',          cat: 'domos',        alt: 'Bienvenida Glamping Reserva del Ruiz' },
  { src: '/glamping-domo-exterior.webp',       cat: 'domos',        alt: 'Domo exterior Glamping Reserva del Ruiz' },
  { src: '/glamping-domo-noche.webp',          cat: 'domos',        alt: 'Domo glamping de noche' },
  { src: '/domo-naturaleza-1.webp',            cat: 'domos',        alt: 'Domo en la naturaleza' },
  { src: '/domo-naturaleza-2.webp',            cat: 'domos',        alt: 'Domo con vista a la montaña' },
  { src: '/domo-naturaleza-3.webp',            cat: 'domos',        alt: 'Domo glamping Caldas' },
  { src: '/interior-domo-1.webp',              cat: 'domos',        alt: 'Interior del domo' },
  { src: '/interior-domo-2.webp',              cat: 'domos',        alt: 'Interior domo glamping' },
  { src: '/glamping-interior-domo.webp',       cat: 'domos',        alt: 'Interior domo glamping' },
  { src: '/detalles-glamping-1.webp',          cat: 'domos',        alt: 'Detalles del glamping' },
  { src: '/detalles-glamping-2.webp',          cat: 'domos',        alt: 'Detalles domo interior' },
  { src: '/detalles-glamping-3.webp',          cat: 'domos',        alt: 'Detalles glamping Caldas' },
  { src: '/detalles-glamping-4.webp',          cat: 'domos',        alt: 'Detalles Reserva del Ruiz' },
  { src: '/glamping-jacuzzi-privado.webp',     cat: 'jacuzzi',      alt: 'Jacuzzi privado glamping' },
  { src: '/glamping-naturaleza-vista.webp',    cat: 'naturaleza',   alt: 'Vista naturaleza Villamaría' },
  { src: '/glamping-paisaje-montano.webp',     cat: 'naturaleza',   alt: 'Paisaje montaño Caldas' },
  { src: '/glamping-vista-caldas.webp',        cat: 'naturaleza',   alt: 'Vista Caldas glamping' },
  { src: '/glamping-vista-1.webp',             cat: 'naturaleza',   alt: 'Vista glamping Caldas' },
  { src: '/glamping-vista-2.webp',             cat: 'naturaleza',   alt: 'Vista panorámica glamping' },
  { src: '/glamping-vista-3.webp',             cat: 'naturaleza',   alt: 'Vista montaña glamping' },
  { src: '/naturaleza-confort-1.webp',         cat: 'naturaleza',   alt: 'Naturaleza y confort glamping' },
  { src: '/naturaleza-confort-2.webp',         cat: 'naturaleza',   alt: 'Confort en la naturaleza' },
  { src: '/panorama-glamping-1.webp',          cat: 'naturaleza',   alt: 'Panorama glamping Caldas' },
  { src: '/panorama-glamping-2.webp',          cat: 'naturaleza',   alt: 'Panorama vista montaña' },
  { src: '/glamping-fogata-estrellas.webp',    cat: 'experiencias', alt: 'Fogata bajo las estrellas' },
  { src: '/glamping-malla-catamaran.webp',     cat: 'experiencias', alt: 'Malla catamarán glamping' },
  { src: '/glamping-senderismo-ecologico.webp',cat: 'experiencias', alt: 'Senderismo ecológico Caldas' },
  { src: '/glamping-desayuno-domo.webp',       cat: 'experiencias', alt: 'Desayuno en el domo' },
  { src: '/experiencia-glamping-1.webp',       cat: 'experiencias', alt: 'Experiencia glamping' },
  { src: '/experiencia-glamping-2.webp',       cat: 'experiencias', alt: 'Experiencia en el domo' },
  { src: '/pareja-domo-1.webp',               cat: 'experiencias', alt: 'Pareja en el domo' },
  { src: '/pareja-domo-2.webp',               cat: 'experiencias', alt: 'Pareja glamping romántico' },
  { src: '/pareja-domo-3.webp',               cat: 'experiencias', alt: 'Pareja en la naturaleza' },
  { src: '/glamping-pareja-experiencia.webp',  cat: 'experiencias', alt: 'Experiencia pareja glamping' },
  { src: '/glamping-familiar-reserva.webp',    cat: 'experiencias', alt: 'Plan familiar glamping' },
  { src: '/escapada-montana-2.webp',           cat: 'experiencias', alt: 'Escapada a la montaña' },
  { src: '/escapada-montana-3.webp',           cat: 'experiencias', alt: 'Escapada montaña Caldas' },
  { src: '/escapada-montana-4.webp',           cat: 'experiencias', alt: 'Escapada romántica glamping' },
  { src: '/escapada-montana-5.webp',           cat: 'experiencias', alt: 'Escapada de pareja glamping' },
  { src: '/decoraciones/decoracion-glamping-1.jpg', cat: 'experiencias', alt: 'Decoración romántica domo' },
  { src: '/decoraciones/decoracion-glamping-2.jpg', cat: 'experiencias', alt: 'Decoración cumpleaños glamping' },
  { src: '/decoraciones/decoracion-glamping-3.jpg', cat: 'experiencias', alt: 'Decoración especial glamping' },
  { src: '/colibries-glamping-1.webp',         cat: 'colibries',    alt: 'Colibríes glamping Caldas' },
  { src: '/colibries-glamping-2.webp',         cat: 'colibries',    alt: 'Colibríes en la naturaleza' },
  { src: '/glamping-colibries-aves.webp',      cat: 'colibries',    alt: 'Aves colibríes Villamaría' },
]

export default function GalleryGrid() {
  const t = useTranslations('gallery')
  const [active, setActive]     = useState('todas')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const CATS = [
    { id: 'todas',        label: t('filterAll')    },
    { id: 'domos',        label: t('filterDomes')  },
    { id: 'jacuzzi',      label: t('filterJacuzzi')},
    { id: 'naturaleza',   label: t('filterNature') },
    { id: 'experiencias', label: t('filterExp')    },
    { id: 'colibries',    label: t('filterBirds')  },
  ]

  const filtered = active === 'todas' ? PHOTOS : PHOTOS.filter(p => p.cat === active)

  function prev() {
    if (lightbox === null) return
    setLightbox((lightbox - 1 + filtered.length) % filtered.length)
  }
  function next() {
    if (lightbox === null) return
    setLightbox((lightbox + 1) % filtered.length)
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {CATS.map(c => (
          <button
            key={c.id}
            onClick={() => { setActive(c.id); setLightbox(null) }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              active === c.id
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-orange-300 hover:text-orange-500'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {filtered.map((photo, i) => (
          <div
            key={photo.src}
            onClick={() => setLightbox(i)}
            className="break-inside-avoid cursor-zoom-in group overflow-hidden rounded-xl relative"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={400}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={22} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-3 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <div
            className="max-w-4xl max-h-[90vh] relative"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              width={1200}
              height={800}
              className="max-h-[90vh] w-auto h-auto object-contain rounded-lg"
              priority
            />
            <p className="text-center text-white/50 text-xs mt-2">
              {lightbox + 1} / {filtered.length}
            </p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-3 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </>
  )
}
