# Plan de desarrollo — Litsea Bolsa de Trabajo

**Última actualización:** 2026-05-13
**Fuentes:** `docs/PRD-TECNICO.md` · `docs/PRD-CLIENTE.md` · `docs/ejecucion.md`

---

## Estado actual

| Área | Estado |
|---|---|
| Scaffold Next.js 16 + Tailwind 4 + shadcn/ui | ✅ Listo |
| Supabase client/server helpers (`lib/supabase/`) | ✅ Listo |
| Auth UI completo — login, registro, reset password | ✅ Listo |
| Login admin (`/login/admin`) con verificación de rol | ✅ Listo |
| `proxy.ts` — i18n + Supabase auth guard + error handling | ✅ Listo |
| `schema.sql` + `rls.sql` + `seed.sql` en `/supabase` | ✅ Listo |
| Páginas de error (`error.tsx`, `not-found.tsx`) | ✅ Listo |
| Plantillas email Supabase (`public/tamplates/`) | ✅ Listo |
| Favicon completo (`public/favicon/`) | ✅ Listo |
| `.env.local` con todas las variables | ✅ Listo |
| Messages i18n — 17 namespaces (es/en/fr) | ✅ Listo |
| Home page — hero + sections | ✅ Listo |
| Páginas legales (privacidad, términos, cookies) — ES/EN/FR | ✅ Listo |
| `LegalShell` + `LegalNavbar` | ✅ Listo |
| README.md completo | ✅ Listo |
| Todas las rutas del PRD (26 pantallas) | ❌ Pendiente |
| Header público | ❌ Pendiente |
| `(public)/layout.tsx` | ❌ Pendiente |
| Dashboard layout + Sidebar | ❌ Pendiente |
| `types/database.ts` | ❌ Pendiente |
| Integración Resend | ❌ Pendiente |
| Chat en tiempo real (Supabase Realtime) | ❌ Pendiente |

---

## Fase 0 — Base de datos y entorno
> Fuente: `docs/PRD-TECNICO.md` §4, §7, §9

- [x] **0.1** Variables de entorno en `.env.local` completas
- [ ] **0.2** Aplicar `schema.sql` y `rls.sql` en Supabase (SQL editor o CLI)
- [ ] **0.3** Ejecutar `seed.sql` para datos de prueba
- [ ] **0.4** Crear trigger `handle_new_user()` en Supabase
- [ ] **0.5** Configurar Storage: bucket `certificates` (privado) y `avatars` (público)
- [x] **0.6** Configurar Auth Settings en Supabase:
  - Site URL: `https://empleos.litseacc.edu.mx`
  - Redirect URLs: `localhost:3000/api/auth/callback` + producción
- [x] **0.7** Configurar plantillas de email Supabase (usar `public/tamplates/`)

---

## Fase 1 — Middleware y routing ✅ COMPLETA
> `proxy.ts` implementado con:
- i18n routing (next-intl, `localePrefix: as-needed`)
- Supabase auth guard → protege `/(dashboard)/**`
- Try-catch en `getUser()` → manejo seguro de cookies corruptas
- Matcher actualizado → excluye mp4, mp3, webm, pdf, etc.
- Skip automático si env vars no están (dev sin `.env`)
- TopBar suprime banner/navbar en rutas auth y legales

---

## Fase 2 — Auth UI ✅ COMPLETA

- [x] `LoginPageShell` — imagen fija derecha (68%), form izquierda, locale pill ES/EN/FR, back button
- [x] `LoginClient` — terapeuta + empleador variants, Google OAuth, light theme, fully i18n'd
- [x] `AdminLoginClient` — sin Google, verifica `role === 'admin'`, sin selector de idioma
- [x] `/login/admin` — acceso interno Litsea, `robots: noindex`
- [x] `RegisterTerapeutaClient` — light theme, strength bar, sin campo de confirmación
- [x] `RegisterEmpleadorClient` — light theme, sin campo de confirmación
- [x] `ResetPasswordClient` — i18n `resetPassword` namespace, light theme
- [x] `ResetPasswordConfirmClient` — i18n, strength bar, 3 estados
- [x] `/login` redirige a `/login/terapeuta`
- [x] Favicon wired en root layout
- [x] Todos los componentes auth 100% i18n (namespace `auth`)

---

## Fase 2b — Páginas legales ✅ COMPLETA

- [x] `components/legales/LegalShell.tsx` — wrapper con `#FDFAF5` bg + Footer
- [x] `components/legales/LegalNavbar.tsx` — fijo, blanco, logo + locale pill + back link
- [x] `app/(locale)/privacidad/page.tsx` — contenido ES/EN/FR completo
- [x] `app/(locale)/terminos/page.tsx` — contenido ES/EN/FR completo (12 secciones)
- [x] `app/(locale)/cookies/page.tsx` — contenido ES/EN/FR completo + cookie type cards
- [x] `generateMetadata` con `getTranslations` en las 3 páginas
- [x] Footer link "Admin" → `/login/admin`

---

## Fase 3 — Páginas públicas ← SIGUIENTE BLOQUE
> Fuente: `docs/PRD-CLIENTE.md` §"Pantallas del sistema — Parte pública"

- [ ] **3.1** `components/layout/Header.tsx` — nav público sticky, logo color, links, locale switcher
- [ ] **3.2** `app/(public)/layout.tsx` — ensambla Header + Footer
- [ ] **3.3** `app/(public)/vacantes/page.tsx` — listado con filtros (zona, especialidad)
- [ ] **3.4** `components/vacantes/VacanteCard.tsx`
- [ ] **3.5** `components/vacantes/VacanteFiltros.tsx`
- [ ] **3.6** `app/(public)/vacantes/[id]/page.tsx` — detalle + botón aplicar
- [ ] **3.7** `app/(public)/terapeutas/page.tsx` — directorio verificados
- [ ] **3.8** `components/terapeutas/TerapeutaCard.tsx`
- [ ] **3.9** `app/(public)/terapeutas/[id]/page.tsx` — perfil público
- [ ] **3.10** `app/(public)/como-funciona/page.tsx` — landing SEO
- [ ] **3.11** Completar home — `FeaturedVacanciesSection` + `FeaturedTherapistsSection`

---

## Fase 4 — Dashboard terapeuta

- [ ] **4.1** `types/database.ts` — tipos generados de Supabase (bloqueante para todo el dashboard)
- [ ] **4.2** `components/dashboard/Sidebar.tsx` — role-aware, dark theme
- [ ] **4.3** `components/dashboard/Topbar.tsx` — avatar, notificaciones
- [ ] **4.4** `app/(dashboard)/layout.tsx` — Sidebar + Topbar + auth guard
- [ ] **4.5** `app/(dashboard)/terapeuta/dashboard/page.tsx` — cards + alerta perfil incompleto
- [ ] **4.6** `app/(dashboard)/terapeuta/perfil/page.tsx` — bio, foto, especialidades, zonas
- [ ] **4.7** `components/terapeutas/TerapeutaPerfilForm.tsx`
- [ ] **4.8** `app/(dashboard)/terapeuta/aplicaciones/page.tsx` — lista con status badges
- [ ] **4.9** `app/(dashboard)/terapeuta/certificados/page.tsx` — upload a Storage
- [ ] **4.10** `app/(dashboard)/terapeuta/mensajes/page.tsx` — chat Realtime

---

## Fase 5 — Dashboard empleador

- [ ] **5.1** `app/(dashboard)/empleador/dashboard/page.tsx`
- [ ] **5.2** `app/(dashboard)/empleador/vacantes/page.tsx`
- [ ] **5.3** `app/(dashboard)/empleador/vacantes/nueva/page.tsx`
- [ ] **5.4** `components/vacantes/VacanteForm.tsx`
- [ ] **5.5** `app/(dashboard)/empleador/vacantes/[id]/editar/page.tsx`
- [ ] **5.6** `app/(dashboard)/empleador/aplicaciones/page.tsx`
- [ ] **5.7** `app/(dashboard)/empleador/mensajes/page.tsx`

---

## Fase 6 — Panel admin

- [ ] **6.1** `app/(dashboard)/admin/page.tsx` — métricas globales
- [ ] **6.2** `components/admin/MetricsCards.tsx`
- [ ] **6.3** `app/(dashboard)/admin/terapeutas/page.tsx` — verificar/suspender
- [ ] **6.4** `app/(dashboard)/admin/empleadores/page.tsx`
- [ ] **6.5** `app/(dashboard)/admin/vacantes/page.tsx` — destacar/desactivar
- [ ] **6.6** `app/(dashboard)/admin/aplicaciones/page.tsx` — habilitar chat
- [ ] **6.7** `app/(dashboard)/admin/certificados/page.tsx` — verificar PDFs
- [ ] **6.8** `app/(dashboard)/admin/mensajes/page.tsx` — lectura
- [ ] **6.9** `app/(dashboard)/admin/auditoria/page.tsx`
- [ ] **6.10** `app/(dashboard)/admin/configuracion/page.tsx`

---

## Fase 7 — API Routes

- [ ] **7.1** `api/vacantes/route.ts` — GET público + POST empleador
- [ ] **7.2** `api/vacantes/[id]/route.ts` — GET + PATCH + DELETE
- [ ] **7.3** `api/aplicaciones/route.ts` — POST terapeuta
- [ ] **7.4** `api/aplicaciones/[id]/route.ts` — PATCH estado (admin)
- [ ] **7.5** `api/certificados/route.ts` — POST upload + GET lista
- [ ] **7.6** `api/mensajes/route.ts` — GET conversaciones
- [ ] **7.7** `api/email/route.ts` — POST Resend

---

## Fase 8 — Emails Resend

- [ ] **8.1** Instalar `resend` + `@react-email/components`
- [ ] **8.2** `lib/email.ts` — helpers Resend
- [ ] **8.3** `emails/WelcomeEmail.tsx` — bienvenida terapeuta/empleador
- [ ] **8.4** `emails/NewApplicationEmail.tsx` — notif admin
- [ ] **8.5** `emails/ChatEnabledEmail.tsx` — chat habilitado
- [ ] **8.6** `emails/ApplicationStatusEmail.tsx` — cambio de estado

---

## Fase 9 — Audit + Legales

- [x] **9.1** Páginas legales completas (privacidad, términos, cookies) — ES/EN/FR
- [ ] **9.2** `lib/audit.ts` — helper `logAudit(adminId, action, module, recordId)`
- [ ] **9.3** Llamar `logAudit` en cada acción crítica del panel admin

---

## Fase 10 — Deploy y pulido

- [ ] **10.1** Revisar RLS: ninguna tabla expone datos sin política
- [ ] **10.2** `SUPABASE_SERVICE_ROLE_KEY` solo en Server Actions/Route Handlers
- [ ] **10.3** Pruebas flujo completo: registro → aplicar → admin habilita chat → chat funciona
- [ ] **10.4** Pruebas de roles: terapeuta no accede a rutas empleador/admin
- [ ] **10.5** Configurar variables de entorno en Easypanel
- [ ] **10.6** Deploy a producción

---

## Decisiones tomadas

| Decisión | Resolución |
|---|---|
| ¿Un login o páginas separadas? | 3 páginas separadas (/login/terapeuta, /login/empleador, /login/admin) |
| ¿Admin se registra solo? | No — solo vía Supabase dashboard |
| ¿Google OAuth para admin? | No — solo email + password |
| ¿Reset compartido o separado? | Compartido con i18n |
| ¿Selector de login? | Eliminado — /login redirige directo a /terapeuta |
| ¿Middleware o proxy? | proxy.ts (Next.js 16 convención) |
| ¿Video o imagen en auth? | Imagen estática (`fondo-login-litsea-centro-capacitacion-bienestar`) |
| ¿Chat Realtime o polling? | Pendiente decisión |
| ¿Empleadores se registran solos? | Pendiente decisión |
| ¿Confirmar contraseña en registro? | No — eliminado de ambos formularios |
| ¿Páginas legales traducidas? | Sí — contenido completo ES/EN/FR en las 3 páginas |
| ¿Navbar en páginas legales? | Sí — LegalNavbar propio (sin banner, solo logo + locale + back) |
