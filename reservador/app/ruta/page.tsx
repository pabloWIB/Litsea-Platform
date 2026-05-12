export const metadata = { title: 'Cómo llegar — Glamping Reserva del Ruiz', robots: 'noindex' }

const VIDEOS = [
  { src: '/ruta/ruta-glamping-1.mp4', label: 'Parte 1' },
  { src: '/ruta/ruta-glamping-2.mp4', label: 'Parte 2' },
  { src: '/ruta/ruta-glamping-3.mp4', label: 'Parte 3' },
  { src: '/ruta/ruta-glamping-4.mp4', label: 'Parte 4' },
]

export default function RutaPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Cómo llegar</h1>
          <p className="text-neutral-400 text-sm">Glamping Reserva del Ruiz · Vereda Montaño, Villamaría, Caldas</p>
        </div>

        <div className="space-y-6">
          {VIDEOS.map((v) => (
            <div key={v.src} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{v.label}</p>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <video
                  src={v.src}
                  controls
                  playsInline
                  className="absolute inset-0 w-full h-full rounded-xl object-cover bg-neutral-900"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
