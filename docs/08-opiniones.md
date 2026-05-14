# 08 · Sistema de Opiniones (Reviews)
**Feature nueva — a implementar**  
**Afecta:** Home · Panel admin · API · Base de datos

---

## Qué es

Un sistema de testimonios/reviews donde cualquier usuario de internet (sin cuenta) puede enviar su opinión sobre Litsea. El admin revisa cada opinión y decide si se publica en el home o no. Solo las opiniones aprobadas aparecen públicamente.

---

## Actores del sistema

| Actor | Qué puede hacer |
|---|---|
| Usuario público (sin cuenta) | Enviar opinión via formulario |
| Admin | Ver, aprobar o rechazar opiniones |
| Visitante del home | Ver opiniones aprobadas |

---

## Flujo completo

```
1. Usuario público visita el home
   → Ve la sección "Lo que dicen de nosotros" con opiniones aprobadas
   → Hace clic en "Comparte tu experiencia"

2. Modal de formulario se abre
   → Usuario llena: nombre, email, cargo (opcional), empresa (opcional)
   → Usuario escribe su opinión (20-300 chars)
   → Usuario selecciona rating (1-5 estrellas)
   → Hace clic en "Enviar opinión"

3. POST /api/opiniones
   → Validaciones server-side (ver sección de validaciones)
   → INSERT en tabla opiniones con status='pending'
   → Respuesta al usuario: "Gracias. Tu opinión será revisada por el equipo Litsea."

4. Admin ve el badge de pendientes en el sidebar
   → Entra a /admin/opiniones
   → Ve la opinión en el tab "Pendientes"
   → Puede: Aprobar · Rechazar · Ver completa

5a. Admin APRUEBA
   → PATCH status='approved', revisado_by, revisado_at
   → logAudit('approve_opinion', 'opiniones', opinionId)
   → La opinión aparece EN TIEMPO REAL en el home (o al próximo reload)

5b. Admin RECHAZA
   → PATCH status='rejected', revisado_by, revisado_at
   → logAudit('reject_opinion', 'opiniones', opinionId)
   → La opinión nunca se publica
   → El usuario que la envió no recibe notificación (privacidad)
```

---

## Base de datos

### Tabla `opiniones` (nueva)
```sql
CREATE TABLE public.opiniones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  email       TEXT NOT NULL,
  cargo       TEXT,
  empresa     TEXT,
  contenido   TEXT NOT NULL CHECK (char_length(contenido) BETWEEN 20 AND 300),
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'rejected')),
  revisado_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  revisado_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.opiniones ENABLE ROW LEVEL SECURITY;
```

### RLS
```sql
-- Cualquiera puede leer las aprobadas
CREATE POLICY "opiniones: lectura pública aprobadas"
  ON public.opiniones FOR SELECT
  USING (status = 'approved');

-- Cualquiera puede enviar una (sin cuenta)
CREATE POLICY "opiniones: inserción pública"
  ON public.opiniones FOR INSERT
  WITH CHECK (true);

-- Admin: acceso total
CREATE POLICY "opiniones: admin acceso total"
  ON public.opiniones FOR ALL
  USING (public.current_user_role() = 'admin');
```

---

## API Routes

### `GET /api/opiniones`
Devuelve opiniones aprobadas para el home. Público, sin auth.

```typescript
// app/api/opiniones/route.ts
export async function GET() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('opiniones')
    .select('id, nombre, cargo, empresa, contenido, rating, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(12)

  return Response.json(data)
}
```

**Nota:** El email NO se incluye en el SELECT — nunca se expone públicamente.

### `POST /api/opiniones`
Recibe nuevas opiniones del formulario público.

```typescript
export async function POST(request: Request) {
  const body = await request.json()

  // Validaciones server-side
  if (!body.nombre?.trim()) return new Response('Nombre requerido', { status: 400 })
  if (!body.email?.includes('@')) return new Response('Email inválido', { status: 400 })
  if (!body.contenido || body.contenido.length < 20) return new Response('Opinión muy corta', { status: 400 })
  if (body.contenido.length > 300) return new Response('Opinión muy larga', { status: 400 })
  if (!body.rating || body.rating < 1 || body.rating > 5) return new Response('Rating inválido', { status: 400 })

  // Rate limiting: 1 opinión por email por 24h
  const supabase = createServiceClient()
  const { count } = await supabase
    .from('opiniones')
    .select('*', { count: 'exact', head: true })
    .eq('email', body.email.toLowerCase())
    .gte('created_at', new Date(Date.now() - 86400000).toISOString())

  if (count && count > 0) {
    return new Response('Ya enviaste una opinión en las últimas 24 horas.', { status: 429 })
  }

  const { error } = await supabase.from('opiniones').insert({
    nombre: body.nombre.trim(),
    email: body.email.toLowerCase().trim(),
    cargo: body.cargo?.trim() || null,
    empresa: body.empresa?.trim() || null,
    contenido: body.contenido.trim(),
    rating: Number(body.rating),
    status: 'pending',
  })

  if (error) return new Response('Error al guardar', { status: 500 })

  return Response.json({ ok: true })
}
```

### `PATCH /api/opiniones/[id]`
Aprobar o rechazar. Solo admin.

```typescript
// app/api/opiniones/[id]/route.ts
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  // 1. Verificar que el usuario es admin
  const supabase = createServiceClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return new Response('Forbidden', { status: 403 })

  // 2. Actualizar status
  const { status } = await request.json()
  if (!['approved', 'rejected'].includes(status)) {
    return new Response('Status inválido', { status: 400 })
  }

  await supabase.from('opiniones').update({
    status,
    revisado_by: user.id,
    revisado_at: new Date().toISOString(),
  }).eq('id', params.id)

  // 3. Auditoría
  await logAudit(user.id, `${status === 'approved' ? 'approve' : 'reject'}_opinion`, 'opiniones', params.id)

  return Response.json({ ok: true })
}
```

---

## Componentes

### `components/opiniones/OpinionesSection.tsx` 🆕
Sección completa del home. Server Component.

```tsx
// Carga opiniones aprobadas desde DB
// Renderiza el grid de OpinionCard
// Incluye el botón "Comparte tu experiencia" → abre OpinionFormModal

export default async function OpinionesSection() {
  const supabase = createServerClient()
  const { data: opiniones } = await supabase
    .from('opiniones')
    .select('id, nombre, cargo, empresa, contenido, rating, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <section id="opiniones">
      <h2>Lo que dicen de nosotros</h2>
      <p>Terapeutas y empleadores que confían en Litsea</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {opiniones?.map(opinion => (
          <OpinionCard key={opinion.id} opinion={opinion} />
        ))}
      </div>

      <OpinionFormModal />   {/* Client Component con el modal */}
    </section>
  )
}
```

---

### `components/opiniones/OpinionCard.tsx` 🆕
Card de una opinión aprobada.

```tsx
interface OpinionCardProps {
  opinion: {
    id: string
    nombre: string
    cargo: string | null
    empresa: string | null
    contenido: string
    rating: number
    created_at: string
  }
}

export function OpinionCard({ opinion }: OpinionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
      {/* Estrellas */}
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < opinion.rating ? 'text-[#2FB7A3]' : 'text-neutral-200'}>
            ★
          </span>
        ))}
      </div>

      {/* Texto */}
      <p className="text-neutral-700 text-sm leading-relaxed mb-4">
        "{opinion.contenido}"
      </p>

      {/* Autor */}
      <div>
        <p className="font-semibold text-neutral-900 text-sm">{opinion.nombre}</p>
        {(opinion.cargo || opinion.empresa) && (
          <p className="text-neutral-400 text-xs">
            {[opinion.cargo, opinion.empresa].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
  )
}
```

---

### `components/opiniones/OpinionFormModal.tsx` 🆕
Modal con el formulario de envío. Client Component.

```tsx
'use client'

// Estado: 'closed' | 'open' | 'submitting' | 'success' | 'error'

// UI del modal:
// ─────────────────────────────────────
// X  Comparte tu experiencia
//
// Nombre completo *          [________________]
// Email *                    [________________]
// Cargo (opcional)           [________________]
// Empresa / Hotel (opcional) [________________]
//
// Tu experiencia *
// [__________________________________________]
// [__________________________________________]
// 0/300 caracteres
//
// Calificación *
// ☆ ☆ ☆ ☆ ☆   ← clickeable
//
// [Cancelar]   [Enviar opinión]
// ─────────────────────────────────────

// Estado éxito:
// ✓ ¡Gracias por compartir!
// Tu opinión será revisada por el equipo Litsea.
// [Cerrar]
```

**Submit handler:**
```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setStatus('submitting')

  const res = await fetch('/api/opiniones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, cargo, empresa, contenido, rating }),
  })

  if (res.ok) {
    setStatus('success')
  } else {
    const msg = await res.text()
    setError(msg)
    setStatus('error')
  }
}
```

---

### `components/opiniones/OpinionAdmin.tsx` 🆕
Panel de moderación. Client Component (para acciones interactivas).

Usado en `/admin/opiniones/page.tsx`.

**Estructura:**
```tsx
// Tabs: Pendientes | Aprobadas | Rechazadas
// Lista de opiniones según tab seleccionado
// Por cada opinión: nombre, rating, contenido preview, fecha, botones
// Botones: Aprobar (verde) | Rechazar (rojo) | Ver completa (modal)
```

---

## Panel Admin `/admin/opiniones`

### Tab: Pendientes
```
[3 pendientes]

Carlos M.                              ⭐⭐⭐⭐⭐
"La plataforma me ayudó a encontrar trabajo en menos de 2 semanas..."
Terapeuta · Cancún · Enviada: 11 mayo 2026

[Aprobar ✓]  [Rechazar ✗]  [Ver completa ↗]

─────────────────────────────────────────────

Spa Director Hotel Azul (anónimo)      ⭐⭐⭐⭐
"Encontramos 3 terapeutas calificados en una semana..."
Director de Spa · Hotel Azul · Enviada: 10 mayo 2026

[Aprobar ✓]  [Rechazar ✗]  [Ver completa ↗]
```

### Tab: Aprobadas
Lista de opiniones ya publicadas. Acción disponible: "Retirar" (cambia status de vuelta a `pending` o a `rejected`).

### Tab: Rechazadas
Lista de opiniones rechazadas. Acción disponible: "Reconsiderar" (cambia status a `approved`).

### Badge en sidebar
El ítem "Opiniones" en el sidebar del admin muestra un badge numérico con el count de opiniones pendientes:
```
Opiniones    [3]
```
Se actualiza al cargar el layout del dashboard.

```typescript
// En (dashboard)/layout.tsx o en el sidebar:
const { count: opinionesPendientes } = await supabase
  .from('opiniones')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'pending')
```

---

## Diseño visual (opiniones en home)

### Sección
```
──────────────────────────────────────────────
  [Label] Comunidad

  Lo que dicen         ← tipografía grande, 2 líneas
  de nosotros.

  Terapeutas y empleadores que confían en Litsea.

  [Card]  [Card]  [Card]     ← grid 3 cols
  [Card]  [Card]  [Card]

  [Comparte tu experiencia →]   ← botón secundario
──────────────────────────────────────────────
```

### Card de opinión
- Fondo: `#ffffff`
- Borde: `1px solid #e5e7eb`
- Sombra: `shadow-sm`
- Border radius: `rounded-2xl`
- Estrellas: color `#2FB7A3` para rating, `#e5e7eb` para vacías

### Modal de formulario
- Overlay: `bg-black/50 backdrop-blur-sm`
- Modal: `bg-white rounded-2xl max-w-md w-full p-6`
- Campos: mismos estilos que los inputs de auth (borde `#e5e7eb`, radius 10px)
- Estrellas seleccionables: hover cambia color, clic fija el rating

---

## Validaciones completas

### Client-side
- Nombre: requerido, min 2 chars
- Email: formato válido (regex)
- Contenido: min 20 chars, max 300 chars (contador visible)
- Rating: requerido, 1-5

### Server-side (`POST /api/opiniones`)
- Todas las validaciones client + deduplicación:
- Rate limiting: 1 por email por 24h
- Sanitización: `trim()` en todos los campos de texto
- El email se normaliza a lowercase antes de guardar y comparar

---

## Privacidad

- El email NUNCA se muestra públicamente
- No se notifica al usuario si su opinión fue rechazada (evita feedback loops negativos)
- El nombre se muestra tal como lo escribió el usuario (puede ser parcial: "Carlos M.")
- No hay sistema de cuentas para los usuarios que envían opiniones
