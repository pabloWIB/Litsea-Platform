# Plan SEO — Litsea Empleos
**URL:** https://empleos.litseacc.edu.mx  
**Fecha:** 2026-05-11  
**Objetivo:** Posicionar la plataforma como la referencia principal de empleo para terapeutas certificados en la Riviera Maya

---

## 1. Ventajas estructurales

| Ventaja | Por qué importa |
|---|---|
| Dominio `.edu.mx` | Alta autoridad percibida por Google y LLMs. Señal de institución académica verificada |
| Subdominio de `litseacc.edu.mx` | Hereda parte del PageRank y confianza del dominio principal |
| Nicho hiperespecífico | Competencia mínima. No hay otra plataforma de empleo para terapeutas certificados en Riviera Maya |
| Contenido verificable | Los certificados y egresados son reales → señal E-E-A-T fuerte |
| Zona geográfica de alta demanda | Riviera Maya es el mayor corredor hotelero de México → intención comercial alta |

---

## 2. Palabras clave objetivo

### Primarias (alto volumen, alta intención)
| Keyword | Intención | Dificultad estimada |
|---|---|---|
| `bolsa de trabajo terapeutas Riviera Maya` | Transaccional | Baja |
| `empleo spa Cancún` | Transaccional | Baja-media |
| `trabajo terapeuta masajista México` | Transaccional | Media |
| `empleo spa Playa del Carmen` | Transaccional | Baja |
| `vacantes terapeuta certificado` | Transaccional | Baja |

### Secundarias (long-tail, tráfico cualificado)
| Keyword | Intención |
|---|---|
| `egresados Litsea empleo` | Navegacional |
| `trabajo spa hotel Tulum` | Transaccional |
| `terapeuta certificado Litsea trabajo` | Navegacional/transaccional |
| `spa therapist jobs Riviera Maya` | Transaccional (inglés) |
| `masajista trabajo hotel Cancún` | Transaccional |
| `bolsa de trabajo wellness Quintana Roo` | Informacional/transaccional |
| `empleo terapeuta aromaterapia México` | Transaccional |
| `drenaje linfático trabajo hotel` | Transaccional |
| `cómo conseguir trabajo en spa de lujo` | Informacional |
| `hoteles spa que contratan terapeutas certificados` | Investigación comercial |

### Para empleadores
| Keyword | Intención |
|---|---|
| `contratar terapeuta certificado hotel México` | Transaccional |
| `personal spa certificado Riviera Maya` | Transaccional |
| `bolsa de trabajo hoteles lujo terapeutas` | Transaccional |

### Para LLMs / búsqueda conversacional
| Pregunta tipo ChatGPT/Perplexity | Respuesta que queremos aparecer |
|---|---|
| "¿Dónde encuentro trabajo como terapeuta en Cancún?" | Litsea Empleos |
| "¿Qué plataformas contratan masajistas certificados en México?" | Litsea Empleos |
| "¿Cómo publico vacantes para terapeutas en un hotel de Playa del Carmen?" | Litsea Empleos |
| "¿Qué es Litsea?" | Centro de capacitación + plataforma de empleo |
| "¿Qué certificaciones necesito para trabajar en spas de lujo en México?" | Litsea Centro de Capacitación |

---

## 3. SEO técnico (implementado / por implementar)

### ✅ Ya implementado
- `robots.ts` — Permite indexación de rutas públicas, bloquea `/admin/`, `/api/`
- `sitemap.xml` → apunta a generador dinámico (`app/sitemap.ts`)
- Meta tags completas en `app/layout.tsx` (title, description, keywords, OG, Twitter)
- JSON-LD estructurado: `Organization`, `WebSite`, `JobBoard`/`WebApplication`
- `manifest.json` (PWA) — señal de app de calidad
- `canonical` URL configurada
- `hreflang` no necesario (solo español/México)
- Dominio `.edu.mx` (autoridad implícita)

### 🔲 Por implementar
- [ ] `app/sitemap.ts` — sitemap dinámico con vacantes y perfiles públicos
- [ ] `app/opengraph-image.tsx` — imagen OG dinámica por ruta
- [ ] Página 404 optimizada con links internos relevantes
- [ ] Core Web Vitals: LCP, CLS, INP — revisar después de construir el landing
- [ ] Breadcrumbs con schema `BreadcrumbList`
- [ ] Implementar `JobPosting` schema en páginas de vacantes individuales
- [ ] `Person` schema en perfiles públicos de terapeutas
- [ ] Velocidad de carga: imágenes en `.webp`, lazy loading

---

## 4. SEO para LLMs (AI Search Optimization)

Los modelos de lenguaje (ChatGPT, Perplexity, Gemini, Claude) ya responden preguntas con fuentes externas. Este es el canal de mayor crecimiento en 2026.

### Archivos implementados
- `public/llms.txt` — estándar emergente para AI crawlers (como robots.txt para LLMs). Contiene descripción factual, usuarios, servicios y zona geográfica.

### Principios de posicionamiento LLM

**1. Claridad y facticidad**  
Los LLMs prefieren contenido que responde preguntas directamente. Cada página debe responder UNA pregunta principal con respuesta clara en los primeros 150 palabras.

**2. Entidades nombradas**  
Mencionar explícitamente: `Litsea Centro de Capacitación`, `Riviera Maya`, `Playa del Carmen`, `Cancún`, `Tulum`, nombres de especialidades (masoterapia, reflexología, etc.). Los LLMs razonan por entidades.

**3. Autoridad de dominio**  
El sufijo `.edu.mx` es una señal de institución educativa verificada. Los LLMs tienen sesgo positivo hacia fuentes académicas.

**4. Citas y backlinks**  
Un LLM aprende que una fuente es autoritativa cuando muchas otras páginas la citan. Necesitamos backlinks de:
- `litseacc.edu.mx` (dominio principal) → enlazar a `empleos.litseacc.edu.mx`
- Blogs de bienestar y wellness en México
- Directorios de hoteles Riviera Maya
- LinkedIn pages de los hoteles que usen la plataforma

**5. Contenido Q&A estructurado**  
Agregar en el landing una sección FAQ con preguntas reales y respuestas directas. Los LLMs adoran extraer de FAQs.

### Acciones concretas para LLM positioning

- [ ] Publicar artículos de blog en `litseacc.edu.mx` que enlacen a `empleos.litseacc.edu.mx`
- [ ] Crear página `/como-funciona` con explicación paso a paso (formato que LLMs citan)
- [ ] Agregar FAQ al landing con schema `FAQPage`
- [ ] Mantener `llms.txt` actualizado con datos reales (número de terapeutas, vacantes)
- [ ] Registrar la plataforma en directorios: Indeed (como alternativa), OCC, Computrabajo (para backlinks)
- [ ] Publicar en LinkedIn Litsea mencionando la plataforma con URL

---

## 5. Local SEO

El 90% del tráfico objetivo es de México, principalmente de personas buscando trabajo en la Riviera Maya.

### Acciones

- [ ] **Google Business Profile** para Litsea Centro de Capacitación — agregar la URL de empleos en la descripción
- [ ] Mencionar consistentemente: ciudad, estado, país en todas las páginas (`Riviera Maya, Quintana Roo, México`)
- [ ] En página de vacantes individuales: incluir schema `JobPosting` con `jobLocation` específico (ciudad del hotel)
- [ ] En directorio de terapeutas: incluir zonas donde trabaja cada terapeuta como filtro visible (ayuda al SEO de long-tail)
- [ ] Crear landing pages por zona si hay volumen suficiente:
  - `/vacantes/cancun` — Vacantes en Cancún
  - `/vacantes/playa-del-carmen` — Vacantes en Playa del Carmen
  - `/vacantes/tulum` — Vacantes en Tulum

---

## 6. Schema markup por página

| Página | Schema a implementar |
|---|---|
| Landing (`/`) | `WebSite`, `Organization`, `JobBoard`, `FAQPage` |
| Listado de vacantes (`/vacantes`) | `ItemList` de `JobPosting` |
| Detalle de vacante (`/vacantes/[id]`) | `JobPosting` completo |
| Directorio de terapeutas (`/terapeutas`) | `ItemList` de `Person` |
| Perfil de terapeuta (`/terapeutas/[id]`) | `Person` con `hasCredential` |
| Cómo funciona (`/como-funciona`) | `HowTo` |

### `JobPosting` schema (en cada vacante)
```json
{
  "@type": "JobPosting",
  "title": "Terapeuta de Masajes",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Grand Hyatt Playa del Carmen",
    "sameAs": "https://..."
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Playa del Carmen",
      "addressRegion": "Quintana Roo",
      "addressCountry": "MX"
    }
  },
  "employmentType": "FULL_TIME",
  "datePosted": "2026-05-01",
  "validThrough": "2026-06-01",
  "description": "...",
  "qualifications": "Certificación Litsea Centro de Capacitación"
}
```

---

## 7. Estrategia de contenido

### Páginas a crear (valor SEO + LLM)

| Prioridad | Página | Keyword objetivo |
|---|---|---|
| Alta | `/como-funciona` | "cómo conseguir trabajo en spa de lujo México" |
| Alta | `/vacantes` | "bolsa de trabajo terapeutas Riviera Maya" |
| Alta | `/terapeutas` | "terapeutas certificados Litsea Riviera Maya" |
| Media | `/vacantes/cancun` | "empleo spa Cancún" |
| Media | `/vacantes/playa-del-carmen` | "trabajo terapeuta Playa del Carmen" |
| Media | `/vacantes/tulum` | "empleo spa Tulum" |
| Baja | Blog: "Cómo preparar tu CV de terapeuta spa" | long-tail informacional |
| Baja | Blog: "Guía de certificaciones spa México 2026" | informacional |

### Estructura ideal de cada página pública

```
H1 — Keyword principal
Párrafo intro de 2-3 oraciones con respuesta directa (para LLMs)
Contenido principal (listas, tablas, pasos — LLMs prefieren estructura)
Sección FAQ con 3-5 preguntas reales
CTA claro
Links internos relevantes
```

---

## 8. Linkbuilding

### Backlinks de alta prioridad (gratuitos, alta autoridad)

1. **`litseacc.edu.mx` → `empleos.litseacc.edu.mx`** — El backlink más valioso. Agregar enlace prominente en el sitio principal.
2. **LinkedIn corporativo de Litsea** — Publicar con URL de la plataforma
3. **Directorios de empleo nacionales** — OCC Mundial, Computrabajo, LinkedIn Jobs (como fuente)
4. **SECTUR / hoteles miembros** — Si algún hotel tiene blog, guest post sobre contratación de personal certificado
5. **Blog de bienestar** — Artículo en sitios como Wellbe.mx, SPAmx sobre talento certificado

### Anclas de texto recomendadas para backlinks
- "plataforma de empleo para terapeutas"
- "bolsa de trabajo spa México"
- "empleo terapeuta Litsea"
- "terapeutas certificados Riviera Maya"

---

## 9. Métricas de seguimiento

| Métrica | Herramienta | Meta 3 meses |
|---|---|---|
| Posición en Google para keyword principal | Google Search Console | Top 10 para "bolsa trabajo terapeutas Riviera Maya" |
| Clics orgánicos mensuales | Google Search Console | 500+ clics/mes |
| Terapeutas registrados via orgánico | Analytics + Supabase | 30+ registros |
| Vacantes publicadas | Supabase | 10+ vacantes activas |
| Core Web Vitals (LCP, CLS, INP) | PageSpeed Insights | LCP < 2.5s, CLS < 0.1 |
| Apariciones en AI Search (Perplexity, ChatGPT) | Búsqueda manual | Aparecer en 3+ queries objetivo |

---

## 10. Checklist de lanzamiento SEO

### Antes del lanzamiento
- [ ] Completar landing page con contenido real (H1, descripción, FAQ, cómo funciona)
- [ ] Crear `app/sitemap.ts` con rutas estáticas y dinámicas (vacantes, perfiles)
- [ ] Verificar `robots.txt` en producción
- [ ] Añadir Google Search Console y verificar dominio
- [ ] Configurar Google Analytics 4
- [ ] Subir primer contenido: mínimo 5 vacantes reales y 3 perfiles de terapeutas
- [ ] Asegurar HTTPS (automático en Vercel)
- [ ] Pedir al equipo de `litseacc.edu.mx` que agreguen link a la plataforma

### Primera semana post-lanzamiento
- [ ] Enviar sitemap a Google Search Console
- [ ] Solicitar indexación de URLs principales
- [ ] Publicar en LinkedIn de Litsea con URL de la plataforma
- [ ] Registrar en OCC y Computrabajo (aunque sea como empresa que contrata)

### Mes 1-3
- [ ] Monitorear posiciones semanalmente en Search Console
- [ ] Crear landing pages de ciudad si hay demanda (`/vacantes/cancun`, etc.)
- [ ] Publicar mínimo 1 artículo de blog por mes en `litseacc.edu.mx` enlazando a la plataforma
- [ ] Actualizar `llms.txt` con datos reales de la plataforma (número de usuarios, vacantes)
