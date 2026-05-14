# Plan de ejecución — Litsea Empleos
**Última actualización:** 2026-05-13 · Archivo por archivo, en orden de dependencia

---

## Estructura completa del proyecto

```
app/
├── (auth)/                              # Sin header/footer — imagen + form
│   ├── login/page.tsx                   ✅ HECHO — redirige a /login/terapeuta
│   ├── login/terapeuta/page.tsx         ✅ HECHO
│   ├── login/empleador/page.tsx         ✅ HECHO
│   ├── login/admin/page.tsx             ✅ HECHO — sin Google, verifica role=admin
│   ├── registro-terapeuta/page.tsx      ✅ HECHO
│   ├── registro-empleador/page.tsx      ✅ HECHO
│   └── reset-password/
│       ├── page.tsx                     ✅ HECHO — i18n, light theme
│       └── confirm/page.tsx             ✅ HECHO — i18n, strength bar
│
├── (public)/                            # TopBar (navbar blanco) + Footer
│   ├── layout.tsx                       🔲 PENDIENTE
│   ├── vacantes/
│   │   ├── page.tsx                     🔲 PENDIENTE
│   │   └── [id]/page.tsx                🔲 PENDIENTE
│   ├── terapeutas/
│   │   ├── page.tsx                     🔲 PENDIENTE
│   │   └── [id]/page.tsx                🔲 PENDIENTE
│   └── como-funciona/page.tsx           🔲 PENDIENTE
│
├── (dashboard)/                         # Sidebar + Topbar — protegido por proxy.ts
│   ├── layout.tsx                       🔲 PENDIENTE
│   ├── terapeuta/
│   │   ├── dashboard/page.tsx           🔲 PENDIENTE
│   │   ├── perfil/page.tsx              🔲 PENDIENTE
│   │   ├── aplicaciones/page.tsx        🔲 PENDIENTE
│   │   ├── certificados/page.tsx        🔲 PENDIENTE
│   │   └── mensajes/page.tsx            🔲 PENDIENTE
│   ├── empleador/
│   │   ├── dashboard/page.tsx           🔲 PENDIENTE
│   │   ├── vacantes/
│   │   │   ├── page.tsx                 🔲 PENDIENTE
│   │   │   ├── nueva/page.tsx           🔲 PENDIENTE
│   │   │   └── [id]/editar/page.tsx     🔲 PENDIENTE
│   │   ├── aplicaciones/page.tsx        🔲 PENDIENTE
│   │   └── mensajes/page.tsx            🔲 PENDIENTE
│   └── admin/
│       ├── page.tsx                     🔲 PENDIENTE
│       ├── terapeutas/page.tsx          🔲 PENDIENTE
│       ├── empleadores/page.tsx         🔲 PENDIENTE
│       ├── vacantes/page.tsx            🔲 PENDIENTE
│       ├── aplicaciones/page.tsx        🔲 PENDIENTE
│       ├── certificados/page.tsx        🔲 PENDIENTE
│       ├── mensajes/page.tsx            🔲 PENDIENTE
│       ├── auditoria/page.tsx           🔲 PENDIENTE
│       └── configuracion/page.tsx       🔲 PENDIENTE
│
├── privacidad/page.tsx                  ✅ HECHO — ES/EN/FR completo
├── terminos/page.tsx                    ✅ HECHO — ES/EN/FR completo (12 secciones)
├── cookies/page.tsx                     ✅ HECHO — ES/EN/FR + cookie type cards
│
├── api/
│   ├── auth/callback/route.ts           ✅ HECHO
│   ├── auth/signout/route.ts            ✅ HECHO
│   ├── vacantes/route.ts                🔲 PENDIENTE
│   ├── vacantes/[id]/route.ts           🔲 PENDIENTE
│   ├── aplicaciones/route.ts            🔲 PENDIENTE
│   ├── aplicaciones/[id]/route.ts       🔲 PENDIENTE
│   ├── certificados/route.ts            🔲 PENDIENTE
│   ├── mensajes/route.ts                🔲 PENDIENTE
│   └── email/route.ts                   🔲 PENDIENTE (Resend)
│
├── page.tsx                             ✅ HECHO (home + hero + sections)
├── layout.tsx                           ✅ HECHO (favicon, html/body, locale header)
├── robots.ts                            ✅ HECHO
├── sitemap.ts                           ✅ HECHO
├── error.tsx                            ✅ HECHO — pill button, light theme
└── not-found.tsx                        ✅ HECHO — i18n, pill button, light theme

components/
├── login/
│   ├── LoginPageShell.tsx               ✅ HECHO — imagen fija derecha, locale pill, back button
│   ├── LoginClient.tsx                  ✅ HECHO — light theme, i18n, terapeuta + empleador variants
│   ├── AdminLoginClient.tsx             ✅ HECHO — sin Google, verifica role=admin, sin locale switcher
│   ├── RegisterTerapeutaClient.tsx      ✅ HECHO — light theme, strength bar, sin confirmar contraseña
│   ├── RegisterEmpleadorClient.tsx      ✅ HECHO — light theme, sin confirmar contraseña
│   ├── ResetPasswordClient.tsx          ✅ HECHO — i18n, light theme, hero button
│   └── ResetPasswordConfirmClient.tsx   ✅ HECHO — i18n, strength bar, 3 estados
├── legales/
│   ├── LegalShell.tsx                   ✅ HECHO — wrapper #FDFAF5 + Footer
│   └── LegalNavbar.tsx                  ✅ HECHO — fijo, blanco, logo + locale pill + back link
├── home/
│   ├── HeroSection.tsx                  ✅ HECHO
│   ├── HowItWorksSection.tsx            ✅ HECHO
│   ├── CtaSectionHome.tsx               ✅ HECHO
│   ├── FeaturedVacanciesSection.tsx     🔲 PENDIENTE
│   └── FeaturedTherapistsSection.tsx    🔲 PENDIENTE
├── layout/
│   ├── TopBar.tsx                       ✅ HECHO — suprime en auth + legales
│   ├── Navbar.tsx                       ✅ HECHO
│   ├── Footer.tsx                       ✅ HECHO
│   └── Header.tsx                       🔲 PENDIENTE
├── dashboard/
│   ├── Sidebar.tsx                      🔲 PENDIENTE — role-aware
│   ├── Topbar.tsx                       🔲 PENDIENTE
│   └── DashboardShell.tsx               🔲 PENDIENTE
├── vacantes/                            🔲 PENDIENTE (4 componentes)
├── terapeutas/                          🔲 PENDIENTE (3 componentes)
├── aplicaciones/                        🔲 PENDIENTE (3 componentes)
├── certificados/                        🔲 PENDIENTE (3 componentes)
├── mensajes/                            🔲 PENDIENTE (3 componentes)
├── admin/                               🔲 PENDIENTE (8 componentes)
└── ui/                                  ✅ shadcn — completo

lib/
├── supabase/client.ts                   ✅ HECHO
├── supabase/server.ts                   ✅ HECHO
├── supabase/service.ts                  ✅ HECHO
├── audit.ts                             🔲 PENDIENTE
├── email.ts                             🔲 PENDIENTE — Resend helpers
└── utils.ts                             ✅ HECHO

emails/ (React Email)                    🔲 PENDIENTE (4 plantillas)

types/
└── database.ts                          🔲 PENDIENTE — tipos generados de Supabase

public/
├── tamplates/                           ✅ HECHO — 5 templates Supabase (Litsea brand)
├── favicon/                             ✅ HECHO — ico, svg, png, webmanifest
└── fondo-login-litsea-centro-capacitacion-bienestar.webp  ✅ HECHO — imagen panel derecho auth

messages/
├── es.json                              ✅ HECHO — 17 namespaces
├── en.json                              ✅ HECHO — 17 namespaces
└── fr.json                              ✅ HECHO — 17 namespaces

proxy.ts                                 ✅ HECHO — i18n + auth guard + try-catch + matcher mp4
.env.local                               ✅ HECHO — todas las vars incluyendo CRON_SECRET
supabase/schema.sql                      ✅ HECHO (pendiente aplicar en Supabase)
supabase/rls.sql                         ✅ HECHO (pendiente aplicar en Supabase)
supabase/seed.sql                        ✅ HECHO
```

---

## Namespaces i18n — Estado actual

| Namespace | Usado en | Keys |
|---|---|---|
| `nav` | TopBar, Navbar | 7 |
| `banner` | TopBar | 3 |
| `hero` | HeroSection | 8 |
| `vacantesDestacadas` | Home | 4 |
| `terapeutasDestacados` | Home | 5 |
| `redEmpleadores` | Home | 4 |
| `howItWorks` | HowItWorksSection | 13 |
| `paraEmpleadores` | Home | 8 |
| `ctaFinal` | CtaSectionHome | 11 |
| `pageTitles` | Metadata de cada page | 11 |
| `whatsapp` | WhatsAppChat | 4 |
| `footer` | Footer | 14 |
| `resetPassword` | ResetPasswordClient, ResetPasswordConfirmClient | 28 |
| `auth` | LoginClient, RegisterTerapeutaClient, RegisterEmpleadorClient, AdminLoginClient | 66 |
| `loginShell` | LoginPageShell | 4 |
| `errors` | not-found.tsx | 5 |
| `legal` | LegalNavbar, privacidad, terminos, cookies | 8 |

---

## Orden de ejecución — Siguiente bloque (Fase 3)

### Bloque A — Fundación pública (sin esto las páginas públicas no tienen nav/layout)
| # | Archivo | Por qué primero |
|---|---|---|
| 1 | `types/database.ts` | Tipos usados en TODOS los componentes con datos |
| 2 | `components/layout/Header.tsx` | Nav público con links + locale switcher |
| 3 | `app/(public)/layout.tsx` | Layout que ensambla TopBar (que ya incluye Header) + Footer |

### Bloque B — Páginas públicas (en orden de valor)
| # | Archivo | |
|---|---|---|
| 4 | `app/(public)/vacantes/page.tsx` | Alta prioridad SEO |
| 5 | `components/vacantes/VacanteCard.tsx` | |
| 6 | `components/vacantes/VacanteFiltros.tsx` | |
| 7 | `app/(public)/vacantes/[id]/page.tsx` | JobPosting schema |
| 8 | `app/(public)/terapeutas/page.tsx` | |
| 9 | `components/terapeutas/TerapeutaCard.tsx` | |
| 10 | `app/(public)/terapeutas/[id]/page.tsx` | Person schema |
| 11 | `app/(public)/como-funciona/page.tsx` | SEO landing |
| 12 | `FeaturedVacanciesSection.tsx` + `FeaturedTherapistsSection.tsx` | Home completo |

### Bloque C — Dashboard base (luego terapeuta, empleador, admin)
| # | Archivo | |
|---|---|---|
| 13 | `components/dashboard/Sidebar.tsx` | role-aware |
| 14 | `components/dashboard/Topbar.tsx` | avatar, notificaciones |
| 15 | `app/(dashboard)/layout.tsx` | auth guard + Sidebar + Topbar |

---

## Design system

| Token | Valor |
|---|---|
| Background app | `#ffffff` (auth/público) · `#071210` (dashboard futuro) |
| Background legal | `#FDFAF5` (crema cálido) |
| Accent | `#2FB7A3` — botones primarios, links, badges |
| Accent hover | `#239688` |
| Input border | `#e5e7eb` |
| Input bg | `#f9fafb` |
| Text main | `#4a4a4a` |
| Text dark | `#1a1a1a` (headings legales) |
| Text body legal | `#5a5a5a` |
| Text muted | `#8a8a8a` |
| Error bg | `#fff2f2` / border `#fecaca` / text `#b91c1c` |
| Fuente | `Geist` |
| Botón primario | `rounded-full bg-[#2FB7A3] ring-offset-2 hover:ring-2 hover:ring-[#2FB7A3]` |
| Input | `border 1.5px #e5e7eb, radius 10px, padding 11px 14px 11px 40px` |
