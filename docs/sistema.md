# Sistema Litsea Empleos — Estado completo
**Última actualización:** 2026-05-13  
**Fuente:** Capturas reales + decisiones de producto

---

## 1. Navegación por rol

### Admin
| Ítem | Ruta | Estado |
|---|---|---|
| Inicio | `/admin` | ✅ |
| Terapeutas | `/admin/terapeutas` | ✅ shell |
| Empleadores | `/admin/empleadores` | ✅ shell |
| Vacantes | `/admin/vacantes` | ✅ shell |
| Aplicaciones | `/admin/aplicaciones` | ✅ shell |
| Certificados | `/admin/certificados` | ✅ shell |
| Mensajes | `/admin/mensajes` | ✅ shell |
| Auditoría | `/admin/auditoria` | ✅ shell |
| **Opiniones** | `/admin/opiniones` | 🆕 NUEVA |
| Configuración | `/admin/configuracion` | ✅ shell |

### Empleador
| Ítem | Ruta | Estado |
|---|---|---|
| Inicio | `/empleador/dashboard` | ✅ shell |
| Vacantes | `/empleador/vacantes` | ✅ shell |
| Candidatos | `/empleador/candidatos` | 🔲 (antes "Aplicaciones") |
| Mensajes | `/empleador/mensajes` | ✅ shell |
| Configuración | `/empleador/configuracion` | 🔲 |

### Terapeuta
| Ítem | Ruta | Estado |
|---|---|---|
| Dashboard | `/terapeuta/dashboard` | ✅ |
| Mi perfil | `/terapeuta/perfil` | ✅ wizard 4 pasos |
| Vacantes disponibles | `/terapeuta/vacantes` | ✅ shell |
| Mis aplicaciones | `/terapeuta/aplicaciones` | ✅ shell |
| Mensajes | `/terapeuta/mensajes` | ✅ shell |
| Configuración | `/terapeuta/configuracion` | 🔲 |

---

## 2. Pantallas — Detalle por rol

### 2.1 Admin

#### `/admin` — Dashboard
- **Métricas (cards):** Terapeutas · Empleadores · Vacantes · Aplicaciones · Certificados (todas con valor numérico desde Supabase)
- Datos en tiempo real desde `profiles`, `vacancies`, `applications`, `certificates`

#### `/admin/auditoria` — Historial
- Filtro "Todos los módulos" (dropdown)
- Filtro "Todas las acciones" (dropdown)
- Tabla de logs: acción · módulo · admin · fecha
- Empty state: "No hay registros de auditoría. Las acciones administrativas aparecerán aquí automáticamente."
- Fuente: tabla `audit_logs`

#### `/admin/configuracion` — Configuración
- **Registro de usuarios:** toggle ON/OFF (`allow_registrations` en tabla `settings`)
- **Textos del Home:**
  - Campo: Título principal (`home_title`)
  - Campo: Subtítulo (`home_subtitle`)
  - Botón: "Guardar configuración"
- Persiste en tabla `settings`

#### `/admin/opiniones` — Moderación de opiniones 🆕 NUEVA
Ver sección 4 completa.

---

### 2.2 Empleador

#### `/empleador/dashboard` — Panel de control
- Header: "Bienvenido, {nombre}"
- Subtitle: "Panel de control de empleador"
- **Métricas (cards):**
  - Vacantes activas (count de `vacancies` del empleador con `is_active=true`)
  - Aplicaciones recibidas (count de `applications` a sus vacantes)
  - Terapeutas contratados (count de `applications` con `status='hired'`)

#### `/empleador/vacantes` — Mis Vacantes
- Botón prominente: "Nueva vacante" → `/empleador/vacantes/nueva`
- Lista de vacantes propias con estado (activa/inactiva)
- Acciones por vacante: editar · activar/desactivar · ver aplicaciones

#### `/empleador/candidatos` — Candidatos (renombrado de Aplicaciones)
- Antes era "Aplicaciones recibidas"
- Muestra terapeutas que aplicaron a sus vacantes
- Por vacante o vista global
- Acciones: ver perfil · habilitar chat (solo admin puede hacerlo realmente) · descargar CV

---

### 2.3 Terapeuta

#### `/terapeuta/dashboard` — Dashboard
- Header: "¡Bienvenido/a! Completa tu perfil profesional para que los empleadores puedan encontrarte."
- **Métricas (cards):**
  - Vacantes disponibles (número real, ej. 12)
  - Perfil completado (% calculado)
  - Mensajes nuevos (count de mensajes no leídos)
- **Alerta si perfil incompleto:** "No visible para empleadores. Completa tu perfil para que los hoteles puedan encontrarte."
- **Progreso del perfil** (checklist con % visual):
  - ☐ Especialidad seleccionada
  - ☐ Zonas de trabajo
  - ☐ Foto profesional
  - ☐ Certificados subidos
- CTA: "Completar mi perfil" → `/terapeuta/perfil`

**Cálculo del % perfil:**
```
total_fields = 4
completed = sum([
  bool(therapist_profile.specialties),
  bool(therapist_profile.zones),
  bool(profile.avatar_url),
  certificates_count > 0
])
percentage = (completed / total_fields) * 100
```

#### `/terapeuta/perfil` — Mi perfil (wizard 4 pasos)

**Paso 1 de 4 — Información básica (25%)**
- Foto profesional: upload con preview
- Especialidad: select (campo requerido *)
  - Opciones: Masoterapia · Reflexología · Aromaterapia · Piedras calientes · Drenaje linfático · Faciales · Manicura/Pedicura · Hidroterapia · Reiki · Otros
- Checkbox: "Egresado Litsea"
- Botones: Volver · Continuar

**Paso 2 de 4 — Zonas de trabajo (50%)**
- Selector múltiple de zonas: Cancún · Playa del Carmen · Tulum · Cozumel · Holbox · Puerto Morelos · Bacalar · Mérida · Otra
- Botones: Volver · Continuar

**Paso 3 de 4 — Bio y experiencia (75%)**
- Textarea: Biografía profesional (max 500 chars)
- Input: Años de experiencia (número)
- Botones: Volver · Continuar

**Paso 4 de 4 — Revisión y envío (100%)**
- Preview del perfil completo
- Botones: Volver · Guardar perfil

#### `/terapeuta/vacantes` — Vacantes disponibles
- Título: "Vacantes disponibles"
- Subtitle: "Explora oportunidades en hoteles y spas de la Riviera Maya."
- **Filtros (tabs/chips):** Todas · por zona · por especialidad · por tipo de contrato
- Cards de vacantes: título · empleador · ubicación · tipo · especialidades · botón "Aplicar"
- Empty state: "No hay vacantes disponibles. Intenta cambiar los filtros o vuelve más tarde."

#### `/terapeuta/aplicaciones` — Mis aplicaciones
- Título: "Mis aplicaciones"
- Subtitle: "Revisa el estado de tus postulaciones."
- Lista de aplicaciones con badge de estado:
  - `new` → "Nueva"
  - `reviewing` → "En revisión"
  - `chat_enabled` → "Chat habilitado"
  - `hired` → "Contratado" (verde)
  - `rejected` → "No seleccionado" (rojo)
- Por cada aplicación: vacante · empleador · fecha · estado

#### `/terapeuta/mensajes` — Mensajes
- Layout dos columnas: lista de conversaciones (izq) · chat (der)
- Empty state: "Selecciona una conversación para ver los mensajes."
- Solo muestra conversaciones donde `is_active = true` (habilitadas por admin)
- Realtime via Supabase Realtime (subscripción a `messages`)

---

## 3. Sidebar — Botón "Colapsar"

El sidebar del terapeuta (y demás roles) tiene un botón "Colapsar" visible en desktop.
- Actualmente colapsa al hacer hover (automático)
- Se debe agregar un botón fijo "Colapsar / Expandir" en la parte inferior del sidebar
- Estado persiste en `localStorage` o `sessionStorage`

Ruta del componente: `components/layout/Sidebar.tsx` → `DesktopSidebar`

---

## 4. Opiniones — Sistema de moderación 🆕 NUEVA FEATURE

### 4.1 Flujo completo

```
Usuario público (internet)
  → Rellena formulario en home (/opiniones o sección del home)
  → Datos guardados en tabla `opiniones` con status='pending'
  → Admin recibe notificación (badge en sidebar)
  → Admin abre /admin/opiniones
  → Ve lista con estado "Pendiente"
  → Admin aprueba o rechaza
  → Si aprobado: status='approved', aparece en home
  → Si rechazado: status='rejected', no se publica
```

### 4.2 Tabla `opiniones` (nueva)

```sql
CREATE TABLE public.opiniones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  email       TEXT NOT NULL,
  cargo       TEXT,                    -- "Terapeuta", "Hotel Manager", etc.
  empresa     TEXT,                    -- nombre del hotel/spa si aplica
  contenido   TEXT NOT NULL,           -- el texto de la opinión
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'rejected')),
  revisado_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  revisado_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.3 Panel Admin `/admin/opiniones`

**Vista lista:**
- Tabs: Pendientes · Aprobadas · Rechazadas
- Por cada opinión: nombre · cargo/empresa · contenido (preview) · rating ⭐ · fecha · botones
- Botones: "Aprobar" (verde) · "Rechazar" (rojo) · "Ver completa"
- Badge en sidebar con count de pendientes

**Vista detalle (modal o página):**
- Nombre completo · email · cargo · empresa
- Contenido completo
- Rating (estrellas)
- Fecha de envío
- Acciones: Aprobar · Rechazar · Volver

### 4.4 Formulario público (home page — nueva sección)

Posición: debajo de "Cómo funciona" o al final del landing

```
Sección: "Lo que dicen de Litsea"
  → Grid de opiniones aprobadas (cards)
  → Botón: "Comparte tu experiencia" → abre modal con formulario

Formulario (modal):
  - Nombre completo *
  - Email * (no se muestra públicamente)
  - Cargo (opcional)
  - Empresa/Hotel (opcional)
  - Tu experiencia * (textarea, max 300 chars)
  - Calificación * (1-5 estrellas, click)
  - Botón: "Enviar opinión"
  - Confirmación: "Gracias. Tu opinión será revisada por el equipo Litsea."
```

### 4.5 Sección home — Opiniones aprobadas

```
Título: "Lo que dicen de nosotros"
Subtitle: "Terapeutas y empleadores que confían en Litsea"
Grid responsive: 3 cols desktop / 1 col mobile
Card por opinión:
  - Estrellas ⭐⭐⭐⭐⭐
  - Texto de la opinión
  - Nombre + cargo + empresa
  - (Email NO se muestra nunca)
```

### 4.6 RLS para `opiniones`

```sql
-- Lectura pública de aprobadas
CREATE POLICY "opiniones: lectura pública aprobadas"
  ON public.opiniones FOR SELECT
  USING (status = 'approved');

-- Inserción pública (cualquiera puede enviar)
CREATE POLICY "opiniones: inserción pública"
  ON public.opiniones FOR INSERT
  WITH CHECK (true);

-- Admin: acceso total
CREATE POLICY "opiniones: admin"
  ON public.opiniones FOR ALL
  USING (public.current_user_role() = 'admin');
```

---

## 5. Cambios en navegación del sidebar

### Sidebar empleador — actualizar

**Cambios vs código actual:**
- "Aplicaciones" → renombrar a "Candidatos" (`/empleador/candidatos`)
- Agregar "Configuración" (`/empleador/configuracion`)

### Sidebar admin — agregar Opiniones

Agregar ítem en sección "Plataforma":
```tsx
{ label: 'Opiniones', href: '/admin/opiniones', icon: <Star size={16} /> }
```
Con badge de count pendientes.

### Sidebar — botón Colapsar

En `DesktopSidebar`, agregar al fondo (sobre el user info):
```tsx
<button onClick={() => setOpen(!open)}>
  {open ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
  {open && <span>Colapsar</span>}
</button>
```
Persistir estado en localStorage: `litsea_sidebar_open`.

---

## 6. Configuración — página terapeuta/empleador

Ambos roles necesitan `/terapeuta/configuracion` y `/empleador/configuracion`:
- Cambiar contraseña (via Supabase `updateUser`)
- Cambiar email
- Notificaciones (toggle: email cuando hay nueva aplicación, cuando se habilita chat)
- Zona horaria (opcional)
- Eliminar cuenta (con confirmación)

---

## 7. Nuevas rutas a crear

| Ruta | Descripción | Prioridad |
|---|---|---|
| `/admin/opiniones` | Moderación de reviews | Alta |
| `/empleador/candidatos` | Renombrar de aplicaciones | Media |
| `/empleador/configuracion` | Config del empleador | Media |
| `/terapeuta/configuracion` | Config del terapeuta | Media |
| `app/api/opiniones/route.ts` | GET (aprobadas) + POST (pública) | Alta |
| `app/api/opiniones/[id]/route.ts` | PATCH status (admin) | Alta |

---

## 8. Mensajes i18n — nuevos namespaces necesarios

```json
"opiniones": {
  "titulo": "Lo que dicen de nosotros",
  "subtitulo": "Terapeutas y empleadores que confían en Litsea",
  "compartir": "Comparte tu experiencia",
  "nombre": "Nombre completo",
  "cargo": "Cargo (opcional)",
  "empresa": "Empresa / Hotel (opcional)",
  "contenido": "Tu experiencia",
  "contentPlaceholder": "Cuéntanos cómo fue tu experiencia con Litsea...",
  "calificacion": "Calificación",
  "enviar": "Enviar opinión",
  "gracias": "Gracias. Tu opinión será revisada por el equipo Litsea.",
  "adminPendientes": "Pendientes",
  "adminAprobadas": "Aprobadas",
  "adminRechazadas": "Rechazadas",
  "aprobar": "Aprobar",
  "rechazar": "Rechazar"
}
```

---

## 9. Decisiones de producto

| Decisión | Resolución |
|---|---|
| ¿Email del usuario de opiniones se muestra? | No — solo nombre, cargo, empresa |
| ¿Hay rate limiting en envío de opiniones? | Sí — 1 por email por 24h (validar en API route) |
| ¿Se notifica al admin de nueva opinión? | Pendiente — badge en sidebar como mínimo |
| ¿Candidatos o Aplicaciones en empleador? | "Candidatos" — más intuitivo para el contexto |
| ¿Sidebar colapsa por hover o botón? | Ambos — hover + botón fijo "Colapsar" |
| ¿Rating requerido en opinión? | Sí (1-5 estrellas, obligatorio) |
| ¿Mínimo de chars en opinión? | 20 chars mínimo, 300 máximo |
