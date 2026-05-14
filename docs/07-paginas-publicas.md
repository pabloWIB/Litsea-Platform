# 07 · Páginas Públicas
**Acceso:** Sin autenticación — visibles para cualquier visitante  
**Layout:** TopBar (banner + navbar) + Footer  
**Fondo:** `#ffffff`

---

## TopBar — comportamiento

El `TopBar.tsx` decide qué mostrar según la ruta:

### En rutas de auth y dashboard → invisible
```typescript
const AUTH_PREFIXES = [
  '/login', '/registro-terapeuta', '/registro-empleador', '/reset-password',
  '/privacidad', '/terminos', '/cookies',
  '/terapeuta', '/empleador', '/admin'  // dashboard
]
```
Si la ruta empieza con alguno de estos: el `TopBar` renderiza solo `{children}` sin banner ni navbar.

### En rutas públicas → visible

**Banner superior (56px, fondo `#2FB7A3`):**
```
"La bolsa de empleo oficial de Litsea ya está activa. Crea tu perfil gratis →"
```
- Se oculta al hacer scroll >10px
- Botón X lo cierra permanentemente (sesión)
- En mobile solo muestra el CTA (versión corta)

**Navbar (blanco, sticky):**
- En desktop: logo + links + locale switcher + "Busco Talento" (botón)
- En mobile: logo + hamburger → menú full-screen oscuro (#071210/97)
- Se muestra con sombra suave al hacer scroll >40px

**Links del navbar:**
```
Vacantes       → /#vacantes
Terapeutas     → /#terapeutas
Empleadores    → /#empleadores
Cómo funciona  → /#como-funciona
[ES 🇲🇽]       → locale switcher
[Busco Talento] → /registro-empleador
```

---

## Home `/`

### Propósito
Landing page principal. Presenta la plataforma, muestra vacantes y terapeutas destacados, explica el proceso y tiene CTAs de conversión.

### Secciones en orden

---

#### 1. Hero Section — `HeroSection.tsx` ✅
```
[Badge] Bolsa de trabajo · Riviera Maya

Conectamos
terapeutas
con el lujo.

Plataforma oficial de empleo de Litsea Centro de Capacitación.
Terapeutas verificados para hoteles y spas de lujo en Cancún,
Playa del Carmen y Tulum.

[Soy Terapeuta]   [Soy empleador]
```

**Fondo:** Video `hero-intro-video.mp4` con overlay oscuro. Si el video no carga, imagen de respaldo.

**CTAs:**
- "Soy Terapeuta" → `/registro-terapeuta`
- "Soy empleador" → `/registro-empleador`

---

#### 2. Vacantes Destacadas — `FeaturedVacanciesSection.tsx` 🔲
```
[Label] Oportunidades
Vacantes
destacadas.

[Card vacante 1]  [Card vacante 2]  [Card vacante 3]

[Ver todas las vacantes →]
```

**Datos:** `SELECT * FROM vacancies WHERE is_featured = true AND is_active = true LIMIT 6`

**Card:**
```
[Logo empleador]
Terapeuta de Masajes Sueco
Grand Hyatt Cancún · Cancún
Tiempo completo · Masoterapia · Reflexología
[Ver vacante]
```

Si no hay vacantes destacadas → no mostrar la sección (o mostrar las últimas activas).

---

#### 3. Terapeutas Destacados — `FeaturedTherapistsSection.tsx` 🔲
```
[Label] Talento certificado
Terapeutas
destacados.

[Card terapeuta 1]  [Card terapeuta 2]  [Card terapeuta 3]

[Ver directorio →]
```

**Datos:** `SELECT * FROM therapist_profiles WHERE is_verified = true LIMIT 6`

**Card:**
```
[Foto circular]
María García López
Masoterapia · Reflexología
📍 Playa del Carmen · Cancún
[Egresada Litsea ✓]
[Ver perfil →]
```

---

#### 4. Red de Empleadores — (sección estática)
```
[Label] Red de empleadores
Hoteles y spas
participantes.

"Los mejores establecimientos de bienestar en Riviera Maya
confían en Litsea para encontrar talento certificado."

[Logos de hoteles: Grand Hyatt, Fiesta Americana, etc.]
```

---

#### 5. Cómo Funciona — `HowItWorksSection.tsx` ✅
```
[Label] El proceso
Cómo
funciona.

[1] Crea tu perfil
    Los terapeutas registran su perfil profesional...

[2] Aplica a vacantes
    Los hoteles publican oportunidades laborales...

[3] Litsea conecta
    El equipo Litsea revisa las aplicaciones...

[4] Oportunidad laboral
    El hotel entrevista al terapeuta...

Stats: 100% verificados · Gratis · Riviera Maya
```

---

#### 6. Para Empleadores — (sección estática)
```
[Label] Para empleadores
Encuentra al
terapeuta ideal.

Accede a una red exclusiva de profesionales del bienestar...

[Talento Certificado]  [Perfiles Curados]  [Contratación Ágil]

[Publicar vacante]
```

---

#### 7. Opiniones — `OpinionesSection.tsx` 🆕
```
[Label] Comunidad
Lo que dicen
de nosotros.

[Card opinión 1]  [Card opinión 2]  [Card opinión 3]

[Comparte tu experiencia →]     ← abre modal formulario
```

**Datos:** `SELECT * FROM opiniones WHERE status = 'approved' ORDER BY created_at DESC LIMIT 6`

Ver detalles completos en `08-opiniones.md`.

---

#### 8. CTA Final — `CtaSectionHome.tsx` ✅
```
[Label] Únete ahora
El bienestar de lujo
necesita talento excepcional.

[Card Terapeuta]                [Card Empleador]
Para terapeutas                 Para empleadores
Tu carrera en el mejor spa.     El talento que buscabas.
Crea tu perfil y aplica...      Publica vacantes y accede...
[Crear cuenta gratis]           [Publicar vacante]
```

---

## Listado de Vacantes `/vacantes`

### Propósito
Todas las vacantes activas con filtros. Alta prioridad SEO con `JobPosting` schema.

### Metadata SEO
```
title: "Vacantes disponibles | Litsea Empleos"
description: "Explora oportunidades de trabajo para terapeutas en hoteles y spas de lujo en Cancún, Playa del Carmen y Tulum."
schema: ItemList de JobPosting
```

### Filtros
```
[Zona ▼]           [Especialidad ▼]    [Tipo de contrato ▼]

Cancún              Masoterapia         Tiempo completo
Playa del Carmen    Reflexología        Por temporada
Tulum               Aromaterapia        Freelance
Cozumel             Drenaje linfático
Holbox              Faciales
```

Implementación: URL search params → `?zona=cancun&especialidad=masoterapia`

### Grid de vacantes
Responsive: 3 cols desktop / 2 cols tablet / 1 col mobile

### Tarjeta de vacante
```
[Logo empleador]
Grand Hyatt Cancún

Terapeuta de Masajes Sueco
📍 Cancún, Q.R.  ·  ⏱ Tiempo completo

Especialidades: Masoterapia · Reflexología

Publicada hace 3 días
[Ver vacante]
```

### Empty state
```
No hay vacantes que coincidan con tu búsqueda.
[Limpiar filtros]
```

### Query
```typescript
let query = supabase
  .from('vacancies')
  .select('*, employer_profiles(company_name, logo_url, slug)')
  .eq('is_active', true)
  .order('is_featured', { ascending: false })  // destacadas primero
  .order('created_at', { ascending: false })

if (zona) query = query.eq('location', zona)
if (especialidad) query = query.contains('specialties', [especialidad])
if (contrato) query = query.eq('contract_type', contrato)
```

---

## Detalle de Vacante `/vacantes/[id]`

### Metadata SEO
```
title: "{título} en {empresa} | Litsea Empleos"
schema: JobPosting completo
```

### Schema JobPosting
```json
{
  "@type": "JobPosting",
  "title": "Terapeuta de Masajes Sueco",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Grand Hyatt Playa del Carmen"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "addressLocality": "Playa del Carmen",
      "addressRegion": "Quintana Roo",
      "addressCountry": "MX"
    }
  },
  "employmentType": "FULL_TIME",
  "datePosted": "2026-05-01",
  "description": "...",
  "qualifications": "Certificación Litsea Centro de Capacitación"
}
```

### Layout
```
[← Volver a vacantes]

[Logo]  Grand Hyatt Cancún

Terapeuta de Masajes Sueco
📍 Cancún · ⏱ Tiempo completo · 📅 Publicada 10 mayo 2026

Especialidades requeridas:
[Masoterapia] [Reflexología]

Descripción del puesto:
...texto completo...

─────────────────────────────
¿Te interesa esta vacante?

[Aplicar ahora]          ← si no está logueado → /login/terapeuta
                         ← si está logueado → POST /api/aplicaciones
```

### Botón "Aplicar ahora"
- Usuario no autenticado → redirige a `/login/terapeuta?next=/vacantes/{id}`
- Usuario autenticado como terapeuta → crea aplicación
- Usuario ya aplicó → muestra "Ya aplicaste a esta vacante" (badge estado)
- Usuario como empleador → no muestra el botón

---

## Directorio de Terapeutas `/terapeutas`

### Propósito
Galería pública de terapeutas verificados. Permite a empleadores explorar talento.

### Metadata SEO
```
title: "Directorio de terapeutas certificados | Litsea Empleos"
schema: ItemList de Person
```

### Filtros
```
[Especialidad ▼]   [Zona ▼]
```

### Grid de terapeutas
```
[Foto]  María García López
        [Egresada Litsea ✓]
        Masoterapia · 5 años
        📍 Playa del Carmen · Cancún
        [Ver perfil →]
```

Solo muestra terapeutas con `is_verified = true` y `is_active = true`.

---

## Perfil Público de Terapeuta `/terapeutas/[slug]`

### Schema: `Person`
```json
{
  "@type": "Person",
  "name": "María García López",
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "Certificación",
    "recognizedBy": { "name": "Litsea Centro de Capacitación" }
  }
}
```

### Layout
```
[Foto grande circular]
María García López
[Egresada Litsea ✓]  [Verificada ✓]

Masoterapia · Reflexología · Aromaterapia
📍 Playa del Carmen · Cancún · Tulum
5 años de experiencia

Sobre mí:
"Soy terapeuta con certificación Litsea..."

Certificaciones (verificadas):
[📄] Masoterapia Sueca Avanzada — Litsea 2024
[📄] Reflexología Podal — Litsea 2023

[← Volver al directorio]
```

---

## Cómo Funciona `/como-funciona`

### Propósito
Landing SEO explicando el proceso en detalle. Objetivo: capturar búsquedas de long-tail como "cómo conseguir trabajo en spa de lujo México".

### Schema: `HowTo`

### Contenido
```
H1: Cómo funciona Litsea Empleos

Introducción directa (2-3 oraciones para LLMs)

[Paso 1] Para terapeutas: Crea tu cuenta
[Paso 2] Completa tu perfil profesional
[Paso 3] Aplica a vacantes
[Paso 4] Litsea revisa y conecta

Para empleadores:
[Paso 1] Crea tu cuenta como empresa
[Paso 2] Publica vacantes
[Paso 3] Recibe candidatos calificados
[Paso 4] Contrata con confianza

FAQ:
- ¿Es gratis para terapeutas? Sí, 100% gratuito.
- ¿Necesito ser egresado de Litsea? Recomendado, no obligatorio.
- ¿Cómo se habilita el chat? El equipo Litsea lo activa manualmente.
- ¿Cuánto tarda el proceso? Típicamente 24-72 horas.
```

---

## Páginas Legales

### Comportamiento compartido
- Layout: `LegalShell` → fondo `#FDFAF5`, `LegalNavbar` fijo, Footer al fondo
- `LegalNavbar`: logo color + locale switcher + "← Volver al inicio"
- `generateMetadata` con `getTranslations('pageTitles')`
- Robots: `noindex` para EN y FR; `index` solo para ES

### `/privacidad` — Aviso de privacidad ✅
Contenido completo en ES/EN/FR. Incluye responsable de datos, finalidades, derechos ARCO, transferencias, cookies.

### `/terminos` — Términos y condiciones ✅
12 secciones completas ES/EN/FR. Incluye: objeto, uso aceptable, propiedad intelectual, limitación de responsabilidad, ley aplicable.

### `/cookies` — Política de cookies ✅
ES/EN/FR completo con cards visuales de tipos de cookie (esenciales, funcionales, analíticas, marketing).

---

## Footer

```
[Logo Litsea]
Talento certificado para los mejores spas y hoteles de la Riviera Maya.

Plataforma          Terapeutas              Empleadores
Ver vacantes        Crear cuenta gratis     Publicar vacante
Directorio          Mi perfil               Crear cuenta
Cómo funciona       Mis certificados        Ver aplicaciones
                    Iniciar sesión

─────────────────────────────────────────────────────
© 2026 Litsea Centro de Capacitación · Riviera Maya, Quintana Roo, México
Privacidad  ·  Términos  ·  Cookies  ·  Admin          ← "Admin" lleva a /login/admin
```

**Nota:** El link "Admin" en el footer es el único punto de entrada público hacia `/login/admin`. Está a propósito en el footer, no destacado, para que solo el equipo interno lo encuentre.

---

## Widget WhatsApp

Componente flotante `WhatsAppChat.tsx` en todas las páginas públicas (no en dashboard).

```
[💬] Burbuja flotante bottom-right

Al hover:
┌─────────────────────────────┐
│ Litsea Empleos              │
│ ¡Hola! ¿En qué podemos     │
│ ayudarte? Escríbenos.       │
│                             │
│ [Abrir chat →]              │
└─────────────────────────────┘
```

Link: `https://wa.me/52XXXXXXXXXX?text=Hola, me gustaría saber más sobre Litsea Bolsa de Trabajo.`
