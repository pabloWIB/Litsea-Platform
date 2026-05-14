# Plan de desarrollo — Litsea Bolsa de Trabajo

**Última actualización:** 2026-05-14  
**Fuentes:** `docs/PRD-TECNICO.md` · `docs/PRD-CLIENTE.md` · `docs/ejecucion.md`

---

## Estado actual — 2026-05-14

| Área | Estado |
|---|---|
| Scaffold Next.js 16 + Tailwind 4 + shadcn/ui | ✅ Listo |
| Supabase client/server helpers (`lib/supabase/`) | ✅ Listo |
| Auth UI completo — login, registro, reset password | ✅ Listo |
| Login admin (`/login/admin`) con verificación de rol | ✅ Listo |
| `proxy.ts` — i18n + Supabase auth guard + error handling | ✅ Listo |
| `schema.sql` + `rls.sql` + `seed.sql` — aplicados en Supabase | ✅ Listo |
| Páginas de error (`error.tsx`, `not-found.tsx`) | ✅ Listo |
| Plantillas email Supabase (`public/tamplates/`) | ✅ Listo |
| Favicon completo | ✅ Listo |
| `.env.local` con todas las variables | ✅ Listo |
| Messages i18n — 20 namespaces, 343 claves (es/en/fr) | ✅ Listo |
| Home page — todas las secciones | ✅ Listo |
| Páginas legales (privacidad, términos, cookies) — ES/EN/FR | ✅ Listo |
| Todas las rutas del PRD (26 pantallas) | ✅ Listo |
| Páginas públicas — vacantes, terapeutas, como-funciona | ✅ Listo |
| Dashboard terapeuta — 7 páginas | ✅ Listo |
| Dashboard empleador — 6 páginas | ✅ Listo |
| Panel admin — 10 páginas | ✅ Listo |
| `types/database.ts` | ✅ Listo |
| `lib/audit.ts` — `logAudit()` en todas las acciones admin | ✅ Listo |
| `lib/email.ts` + templates Resend | ✅ Listo |
| `api/auth/callback` — ruta correcta en `/api/auth/callback` | ✅ Listo |
| `api/opiniones` — GET + POST + PATCH [id] | ✅ Listo |
| Sistema de opiniones — modal público + moderación admin | ✅ Listo |
| Chat en tiempo real (Supabase Realtime) | ✅ Listo |
| Google OAuth — código implementado | ✅ Listo (falta config Supabase) |
| Google OAuth — configurado en Supabase Dashboard | ✅ Listo |
| Storage buckets — avatars, certificates, logos | ❌ Pendiente |
| SMTP Resend en Supabase Auth | ❌ Pendiente |
| Deploy en EasyPanel | ❌ Pendiente |

---

## Fase 0 — Base de datos y entorno ✅ COMPLETA

- [x] **0.1** Variables de entorno en `.env.local` completas
- [x] **0.2** Aplicar `schema.sql` y `rls.sql` en Supabase
- [x] **0.3** Ejecutar `seed.sql` para datos de prueba
- [x] **0.4** Trigger `handle_new_user()` en Supabase (incluido en schema.sql)
- [ ] **0.5** Storage: crear buckets `avatars` (público), `certificates` (privado), `logos` (público)
- [x] **0.6** Auth Settings: Site URL + Redirect URLs
- [x] **0.7** Plantillas email Supabase configuradas

---

## Fase 1 — Middleware y routing ✅ COMPLETA

- i18n routing (next-intl, `localePrefix: as-needed`)
- Supabase auth guard → protege `/(dashboard)/**`
- Try-catch en `getUser()` → manejo seguro de cookies corruptas
- Matcher excluye estáticos, api/, auth/

---

## Fase 2 — Auth UI ✅ COMPLETA

- [x] `LoginPageShell` — imagen fija derecha, locale pill ES/EN/FR, back button
- [x] `LoginClient` — terapeuta + empleador, Google OAuth, i18n completo
- [x] `AdminLoginClient` — sin Google, verifica `role === 'admin'`
- [x] `RegisterTerapeutaClient` / `RegisterEmpleadorClient` — strength bar
- [x] `ResetPasswordClient` / `ResetPasswordConfirmClient` — 3 estados, i18n
- [x] Google OAuth → `signInWithOAuth({ provider: 'google' })` implementado

---

## Fase 2b — Páginas legales ✅ COMPLETA

- [x] `LegalShell` + `LegalNavbar`
- [x] `privacidad`, `terminos`, `cookies` — ES/EN/FR completo

---

## Fase 3 — Páginas públicas ✅ COMPLETA

- [x] `app/(public)/vacantes/page.tsx` — filtros zona/especialidad/contrato
- [x] `app/(public)/vacantes/[id]/page.tsx` — detalle + Server Action aplicar
- [x] `app/(public)/terapeutas/page.tsx` — directorio verificados
- [x] `app/(public)/terapeutas/[slug]/page.tsx` — perfil público, JSON-LD Person
- [x] `app/(public)/como-funciona/page.tsx` — landing SEO, JSON-LD HowTo
- [x] Home completo — Hero, VacantesDestacadas, TerapeutasDestacados, RedEmpleadores, ParaEmpleadores, HowItWorks, Opiniones, CTA
- [x] `components/vacantes/VacanteCard`, `VacanteFiltros`, `AplicarButton`
- [x] `components/terapeutas/TerapeutaCard`

---

## Fase 4 — Dashboard terapeuta ✅ COMPLETA

- [x] `DashboardShell` + `Sidebar` (role-aware) + `TopBar` dashboard
- [x] `(dashboard)/layout.tsx` — auth guard + shell
- [x] `terapeuta/dashboard` — métricas, progreso perfil, aplicaciones recientes
- [x] `terapeuta/perfil` — `PerfilWizard` 4 pasos, upload avatar a Storage
- [x] `terapeuta/vacantes` — listado con filtros
- [x] `terapeuta/aplicaciones` — badges de estado
- [x] `terapeuta/certificados` — `CertificadoForm`, upload PDF a Storage
- [x] `terapeuta/mensajes` — `ChatContainer`, Supabase Realtime
- [x] `terapeuta/configuracion` — cambiar pwd, email, eliminar cuenta

---

## Fase 5 — Dashboard empleador ✅ COMPLETA

- [x] `empleador/dashboard` — métricas vacantes/aplicaciones/contratados
- [x] `empleador/vacantes` — lista + activar/desactivar + eliminar
- [x] `empleador/vacantes/nueva` — Server Action crear vacante
- [x] `empleador/vacantes/[id]/editar` — Server Action actualizar
- [x] `empleador/candidatos` — aplicaciones de sus vacantes
- [x] `empleador/mensajes` — chat con terapeutas
- [x] `empleador/configuracion` — datos empresa, logo, seguridad

---

## Fase 6 — Panel admin ✅ COMPLETA

- [x] `admin/` — 5 métricas globales + accesos rápidos
- [x] `admin/terapeutas` — verificar/revocar/suspender/reactivar + logAudit
- [x] `admin/empleadores` — suspender/reactivar
- [x] `admin/vacantes` — destacar/desactivar + logAudit
- [x] `admin/aplicaciones` — cambiar estado + habilitar chat + crear conversación + enviar emails
- [x] `admin/certificados` — verificar PDFs (signed URL) + logAudit
- [x] `admin/mensajes` — lectura + toggle activar/desactivar conversación
- [x] `admin/opiniones` — moderar (aprobar/rechazar) con logAudit
- [x] `admin/auditoria` — historial completo con filtros
- [x] `admin/configuracion` — toggle registros + textos home

---

## Fase 7 — API Routes ✅ COMPLETA (arquitectura Server Actions)

Las mutaciones usan Server Actions inline en las pages — no requieren API routes REST separadas.

- [x] `api/auth/callback` — OAuth + email confirm handler
- [x] `api/opiniones` — GET aprobadas (público) + POST nueva (público)
- [x] `api/opiniones/[id]` — PATCH aprobar/rechazar (admin)

---

## Fase 8 — Emails Resend ✅ COMPLETA

- [x] `resend` + `@react-email/components` instalados
- [x] `lib/email.ts` — `sendChatEnabledEmails()` + `sendApplicationStatusEmail()`
- [x] `emails/ChatEnabledEmail.tsx` — terapeuta + empleador, variante `isTherapist`
- [x] `emails/ApplicationStatusEmail.tsx` — hired/rejected con CTA

---

## Fase 9 — Audit + Legales ✅ COMPLETA

- [x] Páginas legales — ES/EN/FR
- [x] `lib/audit.ts` — `logAudit()` implementado
- [x] `logAudit` en todas las acciones admin críticas

---

## Fase 10 — Deploy y configuración final ← PENDIENTE

Ver `docs/PENDIENTES.md` para instrucciones detalladas.

- [x] **10.1** Google OAuth — configurado en Supabase Dashboard + Google Cloud Console
- [ ] **10.2** Storage buckets — `avatars` (público), `certificates` (privado), `logos` (público)
- [ ] **10.3** SMTP Resend en Supabase Auth Settings
- [ ] **10.4** Verificar dominio `litseacc.edu.mx` en Resend Dashboard
- [ ] **10.5** Confirmar número de WhatsApp en `components/ui/WhatsAppChat.tsx`
- [ ] **10.6** Variables de entorno en EasyPanel
- [ ] **10.7** Pruebas flujo completo: registro → aplicar → admin habilita chat → chat funciona
- [ ] **10.8** Deploy a producción

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
| ¿API Routes o Server Actions? | Server Actions — más simple, mismo resultado |
| ¿Video o imagen en auth? | Imagen estática |
| ¿Chat Realtime o polling? | Supabase Realtime (ChatContainer.tsx) |
| ¿Confirmar contraseña en registro? | No — eliminado |
| ¿Páginas legales traducidas? | Sí — ES/EN/FR completo |
| ¿Auth callback path? | `/api/auth/callback` (no `/auth/callback`) |
