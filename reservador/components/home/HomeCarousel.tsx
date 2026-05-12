'use client'

import { Carousel, Card } from '@/components/ui/apple-cards-carousel'
import { Link } from '@/i18n/navigation'

const CARDS = [
  {
    src: '/glamping-domo-exterior.webp',
    title: 'Domo con jacuzzi privado',
    category: 'Alojamiento',
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-neutral-600 text-sm leading-relaxed">
          Cada domo cuenta con su propio jacuzzi iluminado en la terraza. Solo tú y la naturaleza, toda la noche.
        </p>
        <Link href="/disponibilidad" className="text-orange-500 font-semibold text-sm hover:underline">
          Ver disponibilidad →
        </Link>
      </div>
    ),
  },
  {
    src: '/glamping-fogata-estrellas.webp',
    title: 'Fogata bajo las estrellas',
    category: 'Experiencia',
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-neutral-600 text-sm leading-relaxed">
          Cada reserva incluye fogata. Siéntate, relájate y deja que el cielo de la Vereda Montaño te quite el aliento.
        </p>
        <Link href="/disponibilidad" className="text-orange-500 font-semibold text-sm hover:underline">
          Reservar ahora →
        </Link>
      </div>
    ),
  },
  {
    src: '/glamping-jacuzzi-privado.webp',
    title: 'Jacuzzi iluminado',
    category: 'Confort',
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-neutral-600 text-sm leading-relaxed">
          Agua caliente, luces tenues y vistas a las montañas de Caldas. El jacuzzi es solo tuyo — incluido en todos los planes.
        </p>
        <Link href="/paquetes" className="text-orange-500 font-semibold text-sm hover:underline">
          Ver planes →
        </Link>
      </div>
    ),
  },
  {
    src: '/glamping-desayuno-domo.webp',
    title: 'Desayuno incluido',
    category: 'Gastronomía',
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-neutral-600 text-sm leading-relaxed">
          Desayuno servido directamente en tu domo. Una forma perfecta de empezar el día en medio de la naturaleza.
        </p>
        <Link href="/paquetes" className="text-orange-500 font-semibold text-sm hover:underline">
          Ver qué incluye →
        </Link>
      </div>
    ),
  },
  {
    src: '/glamping-senderismo-ecologico.webp',
    title: 'Senderismo ecológico',
    category: 'Naturaleza',
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-neutral-600 text-sm leading-relaxed">
          Rutas ecológicas entre colibríes, árboles nativos y panoramas que no se olvidan. Incluido en todos los planes.
        </p>
        <Link href="/como-llegar" className="text-orange-500 font-semibold text-sm hover:underline">
          Cómo llegar →
        </Link>
      </div>
    ),
  },
  {
    src: '/glamping-malla-catamaran.webp',
    title: 'Malla catamarán',
    category: 'Relajación',
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-neutral-600 text-sm leading-relaxed">
          Balancéate sobre el vacío con la brisa de la montaña. La malla catamarán está incluida en todos los domos.
        </p>
        <Link href="/disponibilidad" className="text-orange-500 font-semibold text-sm hover:underline">
          Consultar disponibilidad →
        </Link>
      </div>
    ),
  },
  {
    src: '/glamping-naturaleza-vista.webp',
    title: 'Vistas a la montaña',
    category: 'Naturaleza',
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-neutral-600 text-sm leading-relaxed">
          A 30 minutos de Manizales y a un mundo de distancia del ruido. Vistas a la Vereda Montaño y al Parque Los Nevados.
        </p>
        <Link href="/galeria" className="text-orange-500 font-semibold text-sm hover:underline">
          Ver galería →
        </Link>
      </div>
    ),
  },
  {
    src: '/bienvenida-glamping.webp',
    title: 'Reserva del Ruiz',
    category: 'El glamping',
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-neutral-600 text-sm leading-relaxed">
          Glamping Reserva del Ruiz — el glamping de un millón de estrellas. Cuatro domos privados en la Vereda Montaño, Villamaría, Caldas.
        </p>
        <Link href="/disponibilidad" className="text-orange-500 font-semibold text-sm hover:underline">
          Ver disponibilidad →
        </Link>
      </div>
    ),
  },
]

export default function HomeCarousel() {
  const cards = CARDS.map((card, i) => (
    <Card key={card.src} card={card} index={i} hideText />
  ))

  return (
    <section className="bg-[#FDFAF5] py-8">
      <Carousel items={cards} />
    </section>
  )
}
