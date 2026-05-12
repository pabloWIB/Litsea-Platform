# Plan de desarrollo — Litsea Bolsa de Trabajo

**Última actualización:** 2026-05-11
**Fuentes:** `docs/PRD-TECNICO.md` · `docs/PRD-CLIENTE.md` · `docs/GUIA.md`

---

## Estado actual

| Área | Estado |
|---|---|
| Scaffold Next.js 16 + Tailwind 4 + shadcn/ui | ✅ Listo |
| Supabase client/server helpers (`lib/supabase/`) | ✅ Listo |
| Auth: login, reset password, OAuth callback, signout | ✅ Listo |
| `schema.sql` + `rls.sql` + `seed.sql` en `/supabase` | ✅ Listo |
| Páginas de error (`error.tsx`, `not-found.tsx`) | ✅ Listo |
| Plantillas de email en `public/tamplates/` | ✅ Listo |
| Todas las rutas del PRD (26 pantallas) | ❌ Pendiente |
| Middleware de protección de rutas | ❌ Pendiente |
| Integración Resend | ❌ Pendiente |
| Chat en tiempo real (Supabase Realtime) | ❌ Pendiente |

---

## Fase 0 — Base de datos y entorno
> Fuente: `docs/PRD-TECNICO.md` §4, §7, §9

- [ ] **0.1** Verificar que `schema.sql` incluye las 9 tablas del PRD: `profiles`, `therapist_profiles`, `employer_profiles`, `vacancies`, `applications`, `certificates`, `conversations`, `messages`, `audit_logs`, `settings`
- [ ] **0.2** Aplicar `schema.sql` y `rls.sql` en el proyecto de Supabase (ejecutar en el SQL editor o via Supabase CLI)
- [ ] **0.3** Ejecutar `seed.sql` para datos de prueba iniciales
- [ ] **0.4** Crear el trigger `handle_new_user()` (ver PRD-TECNICO §5) que inserta en `profiles` al registrarse
- [ ] **0.5** Configurar Storage: bucket `certificates` (privado, signed URLs) y bucket `avatars` (público)
- [ ] **0.6** Completar `.env.local` con todas las variables del PRD-TECNICO §9:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `NEXT_PUBLIC_APP_URL`

---

## Fase 1 — Middleware y routing
> Fuente: `docs/PRD-TECNICO.md` §5, §3

- [ ] **1.1** Crear `middleware.ts` en la raíz del proyecto que:
  - Proteja todas las rutas bajo `/(dashboard)/**`
  - Lea la sesión de Supabase y redirija a `/auth/login` si no hay sesión
  - Valide el `role` del perfil y redirija a la ruta correcta según rol (`therapist` → `/terapeuta/dashboard`, `employer` → `/empleador/dashboard`, `admin` → `/admin`)
- [ ] **1.2** Reorganizar el grupo de rutas del App Router según PRD-TECNICO §3:
  - `app/(public)/` — rutas sin auth
  - `app/(dashboard)/terapeuta/` — área terapeuta
  - `app/(dashboard)/empleador/` — área empleador
  - `app/(dashboard)/admin/` — panel admin
- [ ] **1.3** Crear `app/(public)/layout.tsx` con Header público + Footer
- [ ] **1.4** Actualizar `app/(dashboard)/layout.tsx` con Sidebar que cambie según el rol del usuario

---

## Fase 2 — Registro y autenticación
> Fuente: `docs/PRD-CLIENTE.md` §"Qué puede hacer cada uno" · `docs/PRD-TECNICO.md` §5

- [ ] **2.1** Crear página `app/(public)/auth/registro-terapeuta/page.tsx`
  - Campos: nombre, email, contraseña, confirmar contraseña
  - Al registrar: pasa `role: 'therapist'` en `raw_user_meta_data`
  - Redirige a `/terapeuta/perfil` para completar perfil
- [ ] **2.2** Crear página `app/(public)/auth/registro-empleador/page.tsx`
  - Campos: nombre, empresa, email, contraseña
  - Al registrar: pasa `role: 'employer'` en `raw_user_meta_data`
  - Redirige a `/empleador/dashboard`
- [ ] **2.3** Actualizar `app/auth/callback/route.ts` para:
  - Leer el rol del perfil recién creado
  - Redirigir a la ruta de dashboard correcta según el rol
- [ ] **2.4** Agregar enlace a ambos registros desde la página de login existente

---

## Fase 3 — Páginas públicas
> Fuente: `docs/PRD-CLIENTE.md` §"Pantallas del sistema — Parte pública" · `docs/PRD-TECNICO.md` §8

- [ ] **3.1** `app/(public)/page.tsx` — Landing / Home
  - Hero con CTA para terapeutas y empleadores
  - Sección de vacantes destacadas (`is_featured = true`)
  - Sección de terapeutas verificados destacados
  - Sección "Cómo funciona" (3 pasos del flujo)
  - Textos dinámicos leídos desde tabla `settings` (`home_title`, `home_subtitle`)
- [ ] **3.2** `app/(public)/vacantes/page.tsx` — Listado de vacantes
  - Listar vacantes activas (`is_active = true`)
  - Filtros por: zona, especialidad, tipo de contrato
- [ ] **3.3** `app/(public)/vacantes/[id]/page.tsx` — Detalle de vacante
  - Info completa de la vacante
  - Botón "Aplicar" (redirige a login si no hay sesión, o ejecuta Server Action si está autenticado)
- [ ] **3.4** `app/(public)/terapeutas/page.tsx` — Directorio de terapeutas
  - Listar terapeutas verificados (`is_verified = true`)
  - Filtros por especialidad y zona
- [ ] **3.5** `app/(public)/terapeutas/[id]/page.tsx` — Perfil público de terapeuta
  - Foto, nombre, bio, especialidades, certificaciones verificadas

---

## Fase 4 — Dashboard terapeuta
> Fuente: `docs/PRD-CLIENTE.md` §"Área del terapeuta" · `docs/PRD-TECNICO.md` §8

- [ ] **4.1** `app/(dashboard)/terapeuta/dashboard/page.tsx`
  - Cards: aplicaciones activas, mensajes nuevos
  - Alerta si el perfil está incompleto
- [ ] **4.2** `app/(dashboard)/terapeuta/perfil/page.tsx`
  - Editar: nombre, foto (upload a Storage), bio, especialidades (multi-select), zonas, años de experiencia
  - Server Action para guardar en `therapist_profiles`
- [ ] **4.3** `app/(dashboard)/terapeuta/aplicaciones/page.tsx`
  - Tabla con vacantes a las que aplicó y su estado (`new`, `reviewing`, `chat_enabled`, `hired`, `rejected`)
  - Badge de color por estado
- [ ] **4.4** `app/(dashboard)/terapeuta/certificados/page.tsx`
  - Listar certificados subidos con estado de verificación
  - Formulario para subir nuevo certificado (PDF/imagen) a Storage
- [ ] **4.5** `app/(dashboard)/terapeuta/mensajes/page.tsx`
  - Lista de conversaciones habilitadas por admin
  - Vista de chat dentro de cada conversación
  - Suscripción a Supabase Realtime para mensajes nuevos

---

## Fase 5 — Dashboard empleador
> Fuente: `docs/PRD-CLIENTE.md` §"Área del empleador" · `docs/PRD-TECNICO.md` §8

- [ ] **5.1** `app/(dashboard)/empleador/dashboard/page.tsx`
  - Cards: vacantes activas, aplicaciones nuevas recibidas hoy
- [ ] **5.2** `app/(dashboard)/empleador/vacantes/page.tsx`
  - Lista de vacantes propias con estado (activa/inactiva)
  - Botón para crear nueva vacante
- [ ] **5.3** `app/(dashboard)/empleador/vacantes/nueva/page.tsx`
  - Formulario: título, descripción, ubicación, tipo de posición, tipo de contrato, especialidades requeridas
  - Server Action que inserta en `vacancies`
- [ ] **5.4** `app/(dashboard)/empleador/vacantes/[id]/editar/page.tsx`
  - Mismo formulario pre-cargado con datos existentes
- [ ] **5.5** `app/(dashboard)/empleador/aplicaciones/page.tsx`
  - Ver terapeutas que aplicaron a cada vacante
  - Ver perfil resumido de cada terapeuta aplicante
- [ ] **5.6** `app/(dashboard)/empleador/mensajes/page.tsx`
  - Idéntico al chat del terapeuta, misma lógica de Realtime

---

## Fase 6 — Panel admin
> Fuente: `docs/PRD-CLIENTE.md` §"Panel admin" · `docs/PRD-TECNICO.md` §8

- [ ] **6.1** `app/(dashboard)/admin/page.tsx` — Dashboard con métricas
  - Contadores: total terapeutas, empleadores, vacantes activas, aplicaciones por estado
- [ ] **6.2** `app/(dashboard)/admin/terapeutas/page.tsx`
  - Tabla de todos los terapeutas
  - Acciones: verificar (`is_verified`), suspender (`is_active`), ver perfil completo
- [ ] **6.3** `app/(dashboard)/admin/empleadores/page.tsx`
  - Tabla de empleadores con acciones: suspender, editar
- [ ] **6.4** `app/(dashboard)/admin/vacantes/page.tsx`
  - Tabla de todas las vacantes
  - Acciones: destacar (`is_featured`), desactivar (`is_active`), eliminar
- [ ] **6.5** `app/(dashboard)/admin/aplicaciones/page.tsx`
  - Tabla de todas las aplicaciones con selector de estado
  - Acción "Habilitar chat": cambia status a `chat_enabled`, crea fila en `conversations` con `is_active: true`
- [ ] **6.6** `app/(dashboard)/admin/certificados/page.tsx`
  - Lista de certificados pendientes de verificación
  - Botón verificar/rechazar con preview del archivo (signed URL)
- [ ] **6.7** `app/(dashboard)/admin/mensajes/page.tsx`
  - Vista de todas las conversaciones activas (modo lectura)
- [ ] **6.8** `app/(dashboard)/admin/auditoria/page.tsx`
  - Tabla de `audit_logs` con filtros por módulo, acción y fecha
- [ ] **6.9** `app/(dashboard)/admin/configuracion/page.tsx`
  - Toggle para `allow_registrations`
  - Campos para `home_title` y `home_subtitle`
  - Server Action que hace upsert en `settings` y registra en `audit_logs`

---

## Fase 7 — Emails transaccionales
> Fuente: `docs/PRD-TECNICO.md` §6 · `docs/PRD-CLIENTE.md` §"Emails automáticos"

- [ ] **7.1** Instalar `resend` y `@react-email/components`
- [ ] **7.2** Crear plantillas React Email en `emails/`:
  - `WelcomeEmail.tsx` — bienvenida al registrarse
  - `NewApplicationEmail.tsx` — notificación al admin cuando llega aplicación
  - `ChatEnabledEmail.tsx` — notificación a terapeuta y empleador cuando se habilita chat
  - `ApplicationStatusEmail.tsx` — notificación al terapeuta cuando cambia estado
- [ ] **7.3** Crear `app/api/emails/route.ts` o integrar envíos en Server Actions
- [ ] **7.4** Disparar email de bienvenida desde el trigger post-registro o Server Action de registro
- [ ] **7.5** Disparar email al admin al insertar en `applications`
- [ ] **7.6** Disparar emails de chat habilitado cuando admin cambia status a `chat_enabled`

---

## Fase 8 — Audit logs
> Fuente: `docs/PRD-TECNICO.md` §4.1 tabla `audit_logs`

- [ ] **8.1** Crear helper `lib/audit.ts` con función `logAudit(adminId, action, module, recordId, details)`
- [ ] **8.2** Llamar `logAudit` en cada acción crítica del panel admin:
  - Verificar terapeuta, suspender cuenta, cambiar estado de aplicación, habilitar chat, verificar certificado, destacar vacante, eliminar vacante, cambiar settings

---

## Fase 9 — Pulido y deploy
> Fuente: `docs/PRD-TECNICO.md` §10 · `docs/GUIA.md`

- [ ] **9.1** Revisar RLS: confirmar que ninguna tabla expone datos sin la política correcta
- [ ] **9.2** Validar que `SUPABASE_SERVICE_ROLE_KEY` solo se usa en Server Actions/Route Handlers, nunca en cliente
- [ ] **9.3** Agregar rate limiting en endpoints de registro (o verificar config de Supabase Auth)
- [ ] **9.4** Pruebas de flujo completo: registro terapeuta → aplicar → admin habilita chat → chat funciona
- [ ] **9.5** Pruebas de roles: verificar que terapeuta no puede acceder a rutas de empleador/admin
- [ ] **9.6** Configurar variables de entorno en Vercel (producción)
- [ ] **9.7** Deploy a producción con `vercel --prod`

---

## Decisiones pendientes (del PRD)
> Fuente: `docs/PRD-TECNICO.md` §12 · `docs/PRD-CLIENTE.md` §"Preguntas"

- [ ] ¿Los empleadores se registran solos o solo el admin los crea?
- [ ] ¿Límite de vacantes por empleador?
- [ ] ¿Terapeuta puede aplicar a múltiples vacantes del mismo empleador?
- [ ] ¿Chat con Supabase Realtime o polling?
- [ ] ¿Notificaciones push además de email?
- [ ] ¿Búsqueda con `pg_trgm` o simple `ILIKE`?
- [ ] ¿Los emails de admin van a `empleos@litseacc.edu.mx`?
