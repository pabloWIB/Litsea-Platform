# Litsea Empleos

Plataforma oficial de bolsa de trabajo de **Litsea Centro de Capacitación**. Conecta terapeutas certificados con hoteles y spas de lujo en la Riviera Maya (Cancún, Playa del Carmen, Tulum).

**URL de producción:** https://empleos.litseacc.edu.mx

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS 4 + shadcn/ui |
| Auth + DB | Supabase (Auth, Postgres, Storage, Realtime) |
| i18n | next-intl — ES / EN / FR |
| Fuente | Geist |
| Email | Supabase Auth templates + Resend (fase 8) |
| Deploy | EasyPanel (VPS) |

---

## Requisitos previos

- Node.js 20+
- Un proyecto en [Supabase](https://supabase.com) con las tablas aplicadas

---

## Instalación

```bash
npm install
```

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CRON_SECRET=<cadena-aleatoria-segura>
```

---

## Base de datos

Aplica los archivos en este orden desde el SQL Editor de Supabase:

```bash
# 1. Esquema de tablas
supabase/schema.sql

# 2. Políticas RLS
supabase/rls.sql

# 3. Datos de prueba (opcional)
supabase/seed.sql
```

### Configuración de Auth en Supabase

En **Authentication → Settings**:

- **Site URL:** `https://empleos.litseacc.edu.mx`
- **Redirect URLs permitidas:**
  - `http://localhost:3000/api/auth/callback`
  - `https://empleos.litseacc.edu.mx/api/auth/callback`

En **Authentication → Email Templates**: usar las plantillas de `public/tamplates/`.

---

## Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Estructura del proyecto

```
app/
├── [locale]/
│   ├── (auth)/          # Login, registro, reset password — sin header/footer
│   ├── (public)/        # Vacantes, terapeutas, cómo funciona — con Header + Footer
│   ├── (dashboard)/     # Panel terapeuta, empleador, admin — protegido por proxy.ts
│   └── layout.tsx       # NextIntlClientProvider + TopBar
├── api/auth/            # Callbacks OAuth y signout
└── layout.tsx           # Root layout (html, body, favicon)

components/
├── login/               # LoginClient, RegisterTerapeutaClient, RegisterEmpleadorClient…
├── layout/              # TopBar, Navbar, Header (pendiente), Footer (pendiente)
├── home/                # HeroSection, HowItWorksSection, CtaSectionHome…
├── dashboard/           # Sidebar, Topbar, DashboardShell (pendientes)
└── ui/                  # shadcn/ui + LocaleSwitcher, WhatsAppChat

lib/
├── supabase/            # client.ts, server.ts, service.ts
└── utils.ts

messages/
├── es.json              # Español (default)
├── en.json              # English
└── fr.json              # Français

proxy.ts                 # Middleware: i18n routing + Supabase auth guard
supabase/                # schema.sql, rls.sql, seed.sql
public/tamplates/        # Plantillas HTML de emails Supabase
```

---

## Roles de usuario

| Rol | Registro | Acceso |
|---|---|---|
| `therapist` | `/registro-terapeuta` | `/terapeuta/dashboard` |
| `employer` | `/registro-empleador` | `/empleador/dashboard` |
| `admin` | Solo via Supabase dashboard | `/admin` |

El rol se almacena en la tabla `profiles.role` y se asigna mediante un trigger SQL al momento del registro.

---

## i18n

Los textos se organizan en namespaces dentro de `messages/`:

| Namespace | Descripción |
|---|---|
| `nav`, `banner` | TopBar y navegación |
| `hero`, `howItWorks`, `ctaFinal`… | Secciones del home |
| `auth` | Login, registro y errores de autenticación |
| `loginShell` | Panel de video en páginas de auth |
| `resetPassword` | Flujo de recuperación de contraseña |
| `footer` | Footer público |
| `errors` | Páginas 404 / 500 |
| `pageTitles` | Metadata SEO por página |

Para agregar un nuevo namespace, édita `es.json` primero y luego replica la estructura en `en.json` y `fr.json`.

---

## Deploy (EasyPanel)

1. Configura las variables de entorno en el panel de EasyPanel.
2. El proyecto se construye con `npm run build`.
3. El servidor de producción corre con `npm run start`.

---

## Documentación interna

| Archivo | Contenido |
|---|---|
| `docs/plan.md` | Roadmap completo por fases con estado de cada ítem |
| `docs/ejecucion.md` | Árbol de archivos con estado ✅/🔲 y orden de ejecución |
| `docs/auth-plan.md` | Arquitectura de autenticación por rol y flujos |
| `docs/messages.md` | Namespaces i18n implementados y pendientes |
| `docs/seo-plan.md` | Estrategia SEO + AI search optimization |
| `docs/PRD-TECNICO.md` | Requisitos técnicos del producto |
| `docs/PRD-CLIENTE.md` | Requisitos de negocio y pantallas |
