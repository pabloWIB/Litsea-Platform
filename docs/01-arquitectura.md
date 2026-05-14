# 01 · Arquitectura del sistema
**Proyecto:** Litsea Empleos  
**URL producción:** https://empleos.litseacc.edu.mx  
**Última actualización:** 2026-05-13

---

## Stack tecnológico

| Capa | Tecnología | Versión | Por qué |
|---|---|---|---|
| Framework | Next.js App Router | 16 | SSR, rutas anidadas, Server Components, Route Handlers |
| Lenguaje | TypeScript | 5.x | Tipado estático, autocompletado en Supabase types |
| Estilos | Tailwind CSS | 4 | Utility-first, consistencia visual, JIT |
| Componentes UI | shadcn/ui | latest | Primitivos accesibles sobre Radix UI |
| Animaciones | Framer Motion | 11 | Sidebar, menú mobile, transiciones |
| Base de datos | Supabase (PostgreSQL) | — | DB + Auth + Storage + Realtime en uno |
| Auth | Supabase Auth | — | Email+password, Google OAuth, sesiones JWT |
| Storage | Supabase Storage | — | Certificados (privado) y avatares (público) |
| Email | Resend + React Email | — | Emails transaccionales con templates React |
| i18n | next-intl | 4 | ES (default) · EN · FR |
| Deploy | EasyPanel | — | Self-hosted, Docker, dominio .edu.mx |
| Fuente | Geist | — | Variable font de Vercel, nativa en Next.js |

---

## Estructura de carpetas

```
Litsea-Platform/
│
├── app/
│   ├── [locale]/                        # Raíz localizada (ES/EN/FR)
│   │   ├── layout.tsx                   # Metadata global, TopBar, WhatsApp
│   │   ├── page.tsx                     # Home / Landing
│   │   ├── not-found.tsx               # 404 — i18n, pill button
│   │   ├── error.tsx                    # Error boundary — light theme
│   │   │
│   │   ├── (auth)/                      # Sin TopBar ni Footer
│   │   │   └── login/
│   │   │       ├── page.tsx             # Redirige → /login/terapeuta
│   │   │       ├── terapeuta/page.tsx   # Login terapeuta (LoginClient)
│   │   │       ├── empleador/page.tsx   # Login empleador (LoginClient)
│   │   │       ├── admin/page.tsx       # Login admin oculto (AdminLoginClient)
│   │   │       ├── registro-terapeuta/page.tsx
│   │   │       ├── registro-empleador/page.tsx
│   │   │       └── reset-password/
│   │   │           ├── page.tsx         # Solicitar enlace
│   │   │           └── confirm/page.tsx # Nueva contraseña
│   │   │
│   │   ├── (dashboard)/                 # Requiere sesión activa
│   │   │   ├── layout.tsx               # Auth guard + DashboardShell
│   │   │   ├── dashboard/page.tsx       # Redirect según rol
│   │   │   ├── terapeuta/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── perfil/page.tsx      # Wizard 4 pasos
│   │   │   │   ├── vacantes/page.tsx
│   │   │   │   ├── aplicaciones/page.tsx
│   │   │   │   ├── mensajes/page.tsx
│   │   │   │   └── configuracion/page.tsx
│   │   │   ├── empleador/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── vacantes/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── nueva/page.tsx
│   │   │   │   │   └── [id]/editar/page.tsx
│   │   │   │   ├── candidatos/page.tsx
│   │   │   │   ├── mensajes/page.tsx
│   │   │   │   └── configuracion/page.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx             # Dashboard métricas
│   │   │       ├── terapeutas/page.tsx
│   │   │       ├── empleadores/page.tsx
│   │   │       ├── vacantes/page.tsx
│   │   │       ├── aplicaciones/page.tsx
│   │   │       ├── certificados/page.tsx
│   │   │       ├── mensajes/page.tsx
│   │   │       ├── auditoria/page.tsx
│   │   │       ├── opiniones/page.tsx   # 🆕 Moderación reviews
│   │   │       └── configuracion/page.tsx
│   │   │
│   │   ├── privacidad/page.tsx          # ES/EN/FR completo
│   │   ├── terminos/page.tsx            # ES/EN/FR, 12 secciones
│   │   └── cookies/page.tsx             # ES/EN/FR, cookie cards
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── callback/route.ts        # OAuth + email confirm handler
│   │   │   └── signout/route.ts         # POST → signOut
│   │   ├── vacantes/
│   │   │   ├── route.ts                 # GET (público) + POST (empleador)
│   │   │   └── [id]/route.ts            # GET + PATCH + DELETE
│   │   ├── aplicaciones/
│   │   │   ├── route.ts                 # POST (terapeuta aplica)
│   │   │   └── [id]/route.ts            # PATCH status (admin)
│   │   ├── certificados/
│   │   │   └── route.ts                 # POST upload + GET lista
│   │   ├── mensajes/
│   │   │   └── route.ts                 # GET conversaciones
│   │   ├── opiniones/
│   │   │   ├── route.ts                 # GET (aprobadas, público) + POST (envío público)
│   │   │   └── [id]/route.ts            # PATCH status=approved|rejected (admin)
│   │   └── email/
│   │       └── route.ts                 # POST → Resend
│   │
│   ├── layout.tsx                       # Root layout (html, body, favicon)
│   ├── robots.ts                        # Indexación selectiva
│   └── sitemap.ts                       # Sitemap dinámico
│
├── components/
│   ├── home/
│   │   ├── HeroSection.tsx              # ✅ Hero con video/imagen
│   │   ├── HowItWorksSection.tsx        # ✅ 4 pasos
│   │   ├── CtaSectionHome.tsx           # ✅ CTA terapeuta + empleador
│   │   ├── FeaturedVacanciesSection.tsx # 🔲 Vacantes destacadas desde DB
│   │   ├── FeaturedTherapistsSection.tsx# 🔲 Terapeutas destacados desde DB
│   │   └── OpinionesSection.tsx         # 🆕 Reviews aprobadas + formulario
│   │
│   ├── layout/
│   │   ├── TopBar.tsx                   # ✅ Banner + navbar público (suprime en auth/dashboard)
│   │   ├── Footer.tsx                   # ✅ Links legales, admin link oculto
│   │   ├── Sidebar.tsx                  # ✅ Desktop hover-expand + MobileTopNav
│   │   ├── DashboardShell.tsx           # ✅ Orquesta Sidebar + Header + main
│   │   └── Header.tsx                   # ✅ Topbar del dashboard (email del usuario)
│   │
│   ├── login/
│   │   ├── LoginPageShell.tsx           # ✅ Imagen derecha 68%, form izquierda
│   │   ├── LoginClient.tsx              # ✅ Terapeuta + empleador variants
│   │   ├── AdminLoginClient.tsx         # ✅ Sin Google, verifica role=admin
│   │   ├── RegisterTerapeutaClient.tsx  # ✅ Strength bar, sin confirmar pwd
│   │   ├── RegisterEmpleadorClient.tsx  # ✅ Light theme
│   │   ├── ResetPasswordClient.tsx      # ✅ i18n completo
│   │   └── ResetPasswordConfirmClient.tsx # ✅ Strength bar, 3 estados
│   │
│   ├── legales/
│   │   ├── LegalShell.tsx               # ✅ Wrapper #FDFAF5 + Footer
│   │   └── LegalNavbar.tsx              # ✅ Fijo, logo + locale + back
│   │
│   ├── dashboard/                       # 🔲 Todo pendiente
│   │   ├── Sidebar.tsx                  # role-aware (ya está en layout/)
│   │   ├── MetricCard.tsx               # Card genérico de métrica
│   │   └── DashboardShell.tsx           # (ya está en layout/)
│   │
│   ├── terapeuta/
│   │   ├── PerfilWizard.tsx             # 🔲 4 pasos
│   │   ├── PerfilStep1.tsx              # 🔲 Foto + especialidad
│   │   ├── PerfilStep2.tsx              # 🔲 Zonas
│   │   ├── PerfilStep3.tsx              # 🔲 Bio + experiencia
│   │   ├── PerfilStep4.tsx              # 🔲 Revisión
│   │   └── ProfileProgress.tsx          # 🔲 Progress bar + checklist
│   │
│   ├── vacantes/
│   │   ├── VacanteCard.tsx              # 🔲
│   │   ├── VacanteFiltros.tsx           # 🔲
│   │   └── VacanteForm.tsx              # 🔲 Nueva/editar vacante
│   │
│   ├── opiniones/
│   │   ├── OpinionCard.tsx              # 🆕 Card de review aprobada
│   │   ├── OpinionForm.tsx              # 🆕 Modal con formulario público
│   │   └── OpinionAdmin.tsx             # 🆕 Vista admin aprobar/rechazar
│   │
│   ├── mensajes/
│   │   ├── ChatList.tsx                 # 🔲 Lista de conversaciones
│   │   ├── ChatWindow.tsx               # 🔲 Mensajes en tiempo real
│   │   └── ChatInput.tsx                # 🔲 Input + enviar
│   │
│   └── ui/                              # ✅ shadcn/ui — completo
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                    # ✅ createBrowserClient
│   │   ├── server.ts                    # ✅ createServerClient (cookies)
│   │   └── service.ts                   # ✅ createClient con service_role_key
│   ├── email.ts                         # 🔲 Helpers Resend
│   ├── audit.ts                         # 🔲 logAudit(adminId, action, module, recordId)
│   └── utils.ts                         # ✅ cn(), helpers generales
│
├── emails/ (React Email)
│   ├── WelcomeEmail.tsx                 # 🔲 Bienvenida terapeuta/empleador
│   ├── NewApplicationEmail.tsx          # 🔲 Notif admin
│   ├── ChatEnabledEmail.tsx             # 🔲 Chat habilitado
│   └── ApplicationStatusEmail.tsx       # 🔲 Cambio de estado
│
├── types/
│   └── database.ts                      # 🔲 Tipos generados de Supabase
│
├── messages/
│   ├── es.json                          # ✅ 17 namespaces
│   ├── en.json                          # ✅ 17 namespaces
│   └── fr.json                          # ✅ 17 namespaces
│
├── supabase/
│   ├── schema.sql                       # ✅ Listo — pendiente aplicar
│   ├── rls.sql                          # ✅ Listo — pendiente aplicar
│   └── seed.sql                         # ✅ Datos de prueba
│
├── public/
│   ├── logo-litsea-principal.png        # Logo blanco (sidebar, mobile)
│   ├── logo-litsea-principal-color.png  # Logo color (topbar público)
│   ├── fondo-login-litsea-*.webp        # Imagen panel derecho auth
│   ├── hero-intro-video.mp4             # Video hero home
│   ├── tamplates/                       # 5 templates email Supabase (HTML)
│   ├── favicon.svg / favicon.ico / etc. # Favicon completo
│   └── web-assets/                      # Assets generales
│
├── proxy.ts                             # ✅ i18n + auth guard middleware
├── .env.local                           # ✅ Todas las variables
└── next.config.ts                       # Configuración Next.js
```

---

## Design tokens

| Token | Valor | Dónde se usa |
|---|---|---|
| `accent` | `#2FB7A3` | Botones primarios, badges, links activos, strength bar |
| `accent-hover` | `#239688` | Hover en botones |
| `bg-app-dark` | `#071210` | Fondo outer del dashboard |
| `bg-sidebar` | `#2C6851` | Sidebar (25% más claro que el original) |
| `bg-content` | `#FAF9F5` | Panel derecho del dashboard, páginas legales |
| `bg-login-right` | `#F5F0E8` | Panel imagen en auth |
| `bg-legal` | `#FDFAF5` | Crema cálido páginas legales |
| `text-main` | `#4a4a4a` | Texto general app pública |
| `text-dark` | `#1a1a1a` | Headings legales |
| `text-body-legal` | `#5a5a5a` | Párrafos legales |
| `text-muted` | `#8a8a8a` | Texto secundario |
| `text-error` | `#b91c1c` | Mensajes de error |
| `error-bg` | `#fff2f2` | Fondo alerta error |
| `error-border` | `#fecaca` | Borde alerta error |
| `input-border` | `#e5e7eb` | Borde inputs |
| `input-bg` | `#f9fafb` | Fondo inputs |
| Font | `Geist` | Variable font, toda la app |
| Botón primario | `rounded-full bg-[#2FB7A3] ring-offset-2 hover:ring-2 hover:ring-[#2FB7A3]` | Acciones principales |
| Input | `border 1.5px #e5e7eb, radius 10px, padding 11px 14px 11px 40px` | Todos los formularios |

---

## Proxy / Middleware (`proxy.ts`)

El archivo `proxy.ts` actúa como middleware de Next.js. Procesa **cada request** en este orden:

### 1. i18n routing
- Usa `next-intl/middleware` con `routing` configurado
- Locales: `es` (default, `as-needed`), `en`, `fr`
- Si la URL no tiene locale y no es ES, redirige automáticamente

### 2. Auth guard
Rutas protegidas (`PROTECTED_PREFIXES`):
```
/terapeuta → requiere sesión
/empleador → requiere sesión
/admin     → requiere sesión (verificación de role=admin en el layout)
```

Rutas de auth (`AUTH_PATHS`):
```
/login
/registro-terapeuta
/registro-empleador
```

### Lógica
```
si es ruta protegida Y no hay sesión → redirect /login
si hay sesión Y es ruta de auth      → redirect /
```

### Fallback seguro
- Si las env vars de Supabase no están configuradas: pasa el request sin auth guard
- `try/catch` en `getUser()`: cookies corruptas o expiradas no rompen la app

### Matcher
```
Excluye: _next/static, _next/image, favicon, api/, auth/callback, auth/signout,
         .svg .png .jpg .jpeg .gif .webp .ico .mp4 .mp3 .webm .woff2 .ttf .pdf .txt .xml .json
```

---

## Locales (i18n)

| Locale | Prefijo en URL | Comportamiento |
|---|---|---|
| `es` | ninguno (default) | `/login`, `/vacantes`, `/admin` |
| `en` | `/en/` | `/en/login`, `/en/vacantes` |
| `fr` | `/fr/` | `/fr/login`, `/fr/vacantes` |

- La configuración `localePrefix: 'as-needed'` significa que ES no lleva prefijo
- Todos los textos de la UI se sirven desde `messages/{locale}.json`
- Server Components usan `getTranslations()`, Client Components usan `useTranslations()`
- `generateMetadata` también usa `getTranslations()` para SEO

---

## Variables de entorno

```env
# Supabase — requeridas para auth y DB
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # Solo en Server Actions / Route Handlers

# Resend — para emails transaccionales
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=empleos@litseacc.edu.mx

# App
NEXT_PUBLIC_APP_URL=https://empleos.litseacc.edu.mx

# Cron jobs
CRON_SECRET=...                        # Para proteger endpoints de cron
```

---

## Roles del sistema

| Rol | Valor en DB | Cómo se crea | Dashboard |
|---|---|---|---|
| Terapeuta | `therapist` | Auto-registro público | `/terapeuta/*` |
| Empleador | `employer` | Auto-registro o Litsea lo crea | `/empleador/*` |
| Admin | `admin` | Solo via Supabase Dashboard | `/admin/*` |

La verificación de rol ocurre en dos lugares:
1. **`proxy.ts`**: solo verifica que haya sesión activa (no el rol)
2. **`app/[locale]/(dashboard)/layout.tsx`**: lee `profiles.role` y pasa al `DashboardShell`

El `DashboardShell` muestra la navegación correcta según el rol pero **no redirige** si el rol no coincide con la URL — esa lógica debe agregarse en cada page o en el layout.
