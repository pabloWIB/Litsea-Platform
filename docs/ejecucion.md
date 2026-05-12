# Plan de ejecución — Litsea Empleos
**Fecha:** 2026-05-11 · Archivo por archivo, en orden de dependencia

---

## Estructura completa del proyecto

```
app/
├── (auth)/                              # Sin header/footer — solo el form hero
│   ├── login/page.tsx                   ✅ HECHO
│   ├── registro-terapeuta/page.tsx      ✅ HECHO
│   ├── registro-empleador/page.tsx      ✅ HECHO
│   └── reset-password/
│       ├── page.tsx                     ✅ HECHO
│       └── confirm/page.tsx             ✅ HECHO
│
├── (public)/                            # Header + Footer público
│   ├── layout.tsx                       🔲 PENDIENTE — Header + Footer
│   ├── vacantes/
│   │   ├── page.tsx                     🔲 PENDIENTE
│   │   └── [id]/page.tsx                🔲 PENDIENTE
│   ├── terapeutas/
│   │   ├── page.tsx                     🔲 PENDIENTE
│   │   └── [id]/page.tsx                🔲 PENDIENTE
│   └── como-funciona/page.tsx           🔲 PENDIENTE
│
├── (dashboard)/                         # Sidebar + Topbar — protegido por auth
│   ├── layout.tsx                       🔲 PENDIENTE — reescribir completo
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
├── privacidad/page.tsx                  🔲 PENDIENTE
├── terminos/page.tsx                    🔲 PENDIENTE
├── cookies/page.tsx                     🔲 PENDIENTE
├── page.tsx                             ✅ HECHO (home + hero + sections)
├── layout.tsx                           ✅ HECHO (root — SEO, JSON-LD)
├── robots.ts                            ✅ HECHO
├── sitemap.ts                           ✅ HECHO
├── error.tsx                            ✅ HECHO
└── not-found.tsx                        ✅ HECHO

components/
├── login/                               ✅ HECHO (LoginClient, Shell, Register*, ResetPassword*)
├── home/
│   ├── HeroSection.tsx                  ✅ HECHO
│   ├── HowItWorksSection.tsx            ✅ HECHO
│   ├── CtaSectionHome.tsx               ✅ HECHO
│   ├── FeaturedVacanciesSection.tsx     🔲 PENDIENTE
│   └── FeaturedTherapistsSection.tsx    🔲 PENDIENTE
├── layout/
│   ├── Header.tsx                       🔲 PENDIENTE — Nav público (sticky)
│   └── Footer.tsx                       🔲 PENDIENTE
├── dashboard/
│   ├── Sidebar.tsx                      🔲 PENDIENTE — Role-aware
│   ├── Topbar.tsx                       🔲 PENDIENTE
│   └── DashboardShell.tsx               🔲 PENDIENTE
├── vacantes/
│   ├── VacanteCard.tsx                  🔲 PENDIENTE
│   ├── VacantesList.tsx                 🔲 PENDIENTE
│   ├── VacanteFiltros.tsx               🔲 PENDIENTE
│   └── VacanteForm.tsx                  🔲 PENDIENTE
├── terapeutas/
│   ├── TerapeutaCard.tsx                🔲 PENDIENTE
│   ├── TerapeutasList.tsx               🔲 PENDIENTE
│   └── TerapeutaPerfilForm.tsx          🔲 PENDIENTE
├── aplicaciones/
│   ├── AplicacionesList.tsx             🔲 PENDIENTE
│   ├── AplicacionStatusBadge.tsx        🔲 PENDIENTE
│   └── AplicacionActions.tsx            🔲 PENDIENTE
├── certificados/
│   ├── CertificadoCard.tsx              🔲 PENDIENTE
│   ├── CertificadoUpload.tsx            🔲 PENDIENTE
│   └── CertificadoVerificacion.tsx      🔲 PENDIENTE
├── mensajes/
│   ├── ChatWindow.tsx                   🔲 PENDIENTE
│   ├── ConversacionesList.tsx           🔲 PENDIENTE
│   └── MessageBubble.tsx                🔲 PENDIENTE
├── admin/
│   ├── MetricsCards.tsx                 🔲 PENDIENTE
│   ├── TerapeutasTable.tsx              🔲 PENDIENTE
│   ├── EmpleadoresTable.tsx             🔲 PENDIENTE
│   ├── VacantesTable.tsx                🔲 PENDIENTE
│   ├── AplicacionesTable.tsx            🔲 PENDIENTE
│   ├── CertificadosReview.tsx           🔲 PENDIENTE
│   ├── AuditoriaLog.tsx                 🔲 PENDIENTE
│   └── SettingsForm.tsx                 🔲 PENDIENTE
├── legales/
│   └── LegalLayout.tsx                  🔲 PENDIENTE
└── ui/                                  ✅ shadcn — completo

lib/
├── supabase/client.ts                   ✅ HECHO
├── supabase/server.ts                   ✅ HECHO
├── supabase/service.ts                  ✅ HECHO
├── audit.ts                             🔲 PENDIENTE — helper log acciones admin
├── email.ts                             🔲 PENDIENTE — Resend helpers
└── utils.ts                             ✅ HECHO

emails/ (React Email)
├── WelcomeEmail.tsx                     🔲 PENDIENTE
├── NewApplicationEmail.tsx              🔲 PENDIENTE
├── ChatEnabledEmail.tsx                 🔲 PENDIENTE
└── ApplicationStatusEmail.tsx           🔲 PENDIENTE

types/
└── database.ts                          🔲 PENDIENTE — tipos de Supabase
```

---

## Orden de ejecución recomendado

### Bloque 1 — Fundación (sin esto nada funciona)
| # | Archivo | Por qué primero |
|---|---|---|
| 1 | `types/database.ts` | Tipos de DB usados en todos los componentes |
| 2 | `components/dashboard/Sidebar.tsx` | Lo necesita el layout del dashboard |
| 3 | `components/dashboard/Topbar.tsx` | Idem |
| 4 | `app/(dashboard)/layout.tsx` | REESCRIBIR — base de los 14 screens de dashboard |
| 5 | `components/layout/Header.tsx` | Nav público sticky — como el Hero del Glamping |
| 6 | `components/layout/Footer.tsx` | Footer público |
| 7 | `app/(public)/layout.tsx` | Ensambla Header + Footer |

### Bloque 2 — Páginas públicas (SEO + flujo de entrada)
| # | Archivo | Qué necesita |
|---|---|---|
| 8  | `app/(public)/vacantes/page.tsx` | VacanteCard, VacanteFiltros |
| 9  | `components/vacantes/VacanteCard.tsx` | Diseño de tarjeta |
| 10 | `components/vacantes/VacanteFiltros.tsx` | Filtros zona/especialidad |
| 11 | `app/(public)/vacantes/[id]/page.tsx` | Detalle + botón aplicar |
| 12 | `app/(public)/terapeutas/page.tsx` | TerapeutaCard |
| 13 | `components/terapeutas/TerapeutaCard.tsx` | — |
| 14 | `app/(public)/terapeutas/[id]/page.tsx` | Perfil público |
| 15 | `app/(public)/como-funciona/page.tsx` | Landing SEO |

### Bloque 3 — Dashboard terapeuta
| # | Archivo | Qué hace |
|---|---|---|
| 16 | `app/(dashboard)/terapeuta/dashboard/page.tsx` | Resumen aplicaciones + mensajes |
| 17 | `app/(dashboard)/terapeuta/perfil/page.tsx` | Editar bio, foto, especialidades, zonas |
| 18 | `components/terapeutas/TerapeutaPerfilForm.tsx` | Form con Server Action |
| 19 | `app/(dashboard)/terapeuta/aplicaciones/page.tsx` | Lista con status badges |
| 20 | `components/aplicaciones/AplicacionStatusBadge.tsx` | Badge por estado |
| 21 | `app/(dashboard)/terapeuta/certificados/page.tsx` | Upload a Supabase Storage |
| 22 | `components/certificados/CertificadoUpload.tsx` | — |
| 23 | `app/(dashboard)/terapeuta/mensajes/page.tsx` | Chat real-time |
| 24 | `components/mensajes/ChatWindow.tsx` | Supabase Realtime |

### Bloque 4 — Dashboard empleador
| # | Archivo | Qué hace |
|---|---|---|
| 25 | `app/(dashboard)/empleador/dashboard/page.tsx` | Resumen vacantes + aplicaciones |
| 26 | `app/(dashboard)/empleador/vacantes/page.tsx` | Lista de sus vacantes |
| 27 | `app/(dashboard)/empleador/vacantes/nueva/page.tsx` | Form crear vacante |
| 28 | `components/vacantes/VacanteForm.tsx` | Form reutilizable crear/editar |
| 29 | `app/(dashboard)/empleador/vacantes/[id]/editar/page.tsx` | Form editar |
| 30 | `app/(dashboard)/empleador/aplicaciones/page.tsx` | Ver quién aplicó |
| 31 | `app/(dashboard)/empleador/mensajes/page.tsx` | Chat con terapeutas |

### Bloque 5 — Panel admin
| # | Archivo | Qué hace |
|---|---|---|
| 32 | `app/(dashboard)/admin/page.tsx` | Métricas globales (cards + charts) |
| 33 | `components/admin/MetricsCards.tsx` | — |
| 34 | `app/(dashboard)/admin/terapeutas/page.tsx` | Tabla + verificar/suspender |
| 35 | `app/(dashboard)/admin/empleadores/page.tsx` | Tabla + suspender |
| 36 | `app/(dashboard)/admin/vacantes/page.tsx` | Tabla + destacar/desactivar |
| 37 | `app/(dashboard)/admin/aplicaciones/page.tsx` | Cambiar status + habilitar chat |
| 38 | `app/(dashboard)/admin/certificados/page.tsx` | Revisar PDF + verificar |
| 39 | `app/(dashboard)/admin/mensajes/page.tsx` | Vista lectura de conversaciones |
| 40 | `app/(dashboard)/admin/auditoria/page.tsx` | Log de acciones admin |
| 41 | `app/(dashboard)/admin/configuracion/page.tsx` | Settings del home |

### Bloque 6 — API Routes
| # | Archivo | Para qué |
|---|---|---|
| 42 | `api/vacantes/route.ts` | GET lista pública + POST crear (empleador) |
| 43 | `api/vacantes/[id]/route.ts` | GET detalle + PATCH + DELETE |
| 44 | `api/aplicaciones/route.ts` | POST aplicar a vacante |
| 45 | `api/aplicaciones/[id]/route.ts` | PATCH cambiar estado (admin) |
| 46 | `api/certificados/route.ts` | POST upload + GET lista |
| 47 | `api/mensajes/route.ts` | GET conversaciones |
| 48 | `api/email/route.ts` | POST enviar emails (Resend) |

### Bloque 7 — Emails y legales
| # | Archivo | — |
|---|---|---|
| 49 | `lib/email.ts` | Helpers Resend |
| 50 | `emails/WelcomeEmail.tsx` | Bienvenida |
| 51 | `emails/NewApplicationEmail.tsx` | Notif admin |
| 52 | `emails/ChatEnabledEmail.tsx` | Chat habilitado |
| 53 | `emails/ApplicationStatusEmail.tsx` | Cambio de estado |
| 54 | `app/privacidad/page.tsx` | Texto legal |
| 55 | `app/terminos/page.tsx` | Texto legal |
| 56 | `app/cookies/page.tsx` | Texto legal |

---

## Design system

| Token | Valor | Uso |
|---|---|---|
| Background | `#071210` | Fondo principal — toda la app |
| Accent | `#2FB7A3` | Teal — botones primarios, links, badges |
| Accent hover | `#3ecfbb` | Hover sobre accent |
| Card | `bg-white/5 border-white/10` | Cards oscuras |
| Text primary | `text-white` | — |
| Text muted | `text-white/50` | Subtítulos, labels |
| Text faint | `text-white/25` | Placeholders, hints |
| Error | `text-red-400 bg-red-500/8 border-red-500/20` | Errores |
| Success | `text-[#2FB7A3] bg-[#2FB7A3]/10 border-[#2FB7A3]/20` | Confirmaciones |
| Fuente | `Geist` (ya configurada en layout.tsx) | — |
| Botón primario | `HoverBorderGradient backdropClassName="bg-[#2FB7A3]"` | — |
| Botón secundario | `HoverBorderGradient border-white/20 backdropClassName="bg-white/8"` | — |
| Animaciones | `framer-motion` — `EASE = [0.22,1,0.36,1]` | Consistente en todo |

---

## Próximo paso inmediato

**Bloque 1 — empezar por:**
1. `types/database.ts` — tipos de la DB
2. `app/(dashboard)/layout.tsx` — reescribir sidebar/topbar en Litsea dark
3. `components/layout/Header.tsx` — nav público
