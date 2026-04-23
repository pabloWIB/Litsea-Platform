# PRD Técnico — Litsea Bolsa de Trabajo
**Versión:** 1.0
**Fecha:** 2026-03-31
**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase · Resend · Vercel

---

## 1. Resumen del sistema

Plataforma B2B/B2C que conecta terapeutas egresados de Litsea Centro de Capacitación con empleadores (hoteles y spas de lujo) en la Riviera Maya. El flujo central es: terapeuta se registra → aplica a vacante → admin habilita el chat → empleador contacta al terapeuta.

Tres roles: `therapist`, `employer`, `admin`.

---

## 2. Stack y servicios externos

| Servicio | Uso |
|---|---|
| **Supabase** | Base de datos (PostgreSQL), Auth (email+password, Google OAuth), Storage (certificados, fotos de perfil), Row Level Security |
| **Resend** | Emails transaccionales: confirmación de cuenta, nueva aplicación, chat habilitado, nueva vacante |
| **Vercel** | Deploy, Edge Functions, variables de entorno |
| **Google OAuth** | Login social vía Supabase Auth provider |

---

## 3. Arquitectura de carpetas (App Router)

```
app/
├── (public)/                  # rutas sin auth
│   ├── page.tsx               # Home / Landing
│   ├── vacantes/
│   │   ├── page.tsx           # Listado de vacantes
│   │   └── [id]/page.tsx      # Detalle de vacante
│   ├── terapeutas/
│   │   ├── page.tsx           # Directorio de terapeutas
│   │   └── [id]/page.tsx      # Perfil público de terapeuta
│   ├── como-funciona/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── registro-terapeuta/page.tsx
│   │   └── registro-empleador/page.tsx
│   └── layout.tsx             # Header público + Footer
│
├── (dashboard)/               # rutas protegidas, requieren auth
│   ├── terapeuta/
│   │   ├── dashboard/page.tsx
│   │   ├── perfil/page.tsx
│   │   ├── aplicaciones/page.tsx
│   │   ├── certificados/page.tsx
│   │   └── mensajes/page.tsx
│   ├── empleador/
│   │   ├── dashboard/page.tsx
│   │   ├── vacantes/
│   │   │   ├── page.tsx
│   │   │   ├── nueva/page.tsx
│   │   │   └── [id]/editar/page.tsx
│   │   ├── aplicaciones/page.tsx
│   │   └── mensajes/page.tsx
│   ├── admin/
│   │   ├── page.tsx           # Panel con métricas
│   │   ├── terapeutas/page.tsx
│   │   ├── empleadores/page.tsx
│   │   ├── vacantes/page.tsx
│   │   ├── aplicaciones/page.tsx
│   │   ├── certificados/page.tsx
│   │   ├── mensajes/page.tsx
│   │   ├── auditoria/page.tsx
│   │   └── configuracion/page.tsx
│   └── layout.tsx             # Sidebar + auth guard
│
├── api/                       # Route Handlers
│   ├── auth/callback/route.ts # OAuth callback de Supabase
│   └── webhooks/              # si se necesitan
│
└── layout.tsx                 # Root layout
```

---

## 4. Base de datos (Supabase / PostgreSQL)

### 4.1 Tablas principales

#### `profiles`
Extiende `auth.users`. Un usuario = un perfil.

```sql
id          uuid PK → auth.users.id
role        enum('therapist', 'employer', 'admin')
full_name   text
email       text
phone       text
avatar_url  text
is_active   boolean DEFAULT true
created_at  timestamptz
updated_at  timestamptz
```

#### `therapist_profiles`
```sql
id              uuid PK
user_id         uuid FK → profiles.id UNIQUE
specialties     text[]          -- ['Sueco', 'Hot Stone', ...]
zones           text[]          -- ['Playa del Carmen', 'Tulum', ...]
bio             text
experience_years int
is_litsea_grad  boolean DEFAULT false
is_verified     boolean DEFAULT false
slug            text UNIQUE
```

#### `employer_profiles`
```sql
id           uuid PK
user_id      uuid FK → profiles.id UNIQUE
company_name text
website      text
description  text
logo_url     text
slug         text UNIQUE
```

#### `vacancies`
```sql
id              uuid PK
employer_id     uuid FK → employer_profiles.id
title           text
description     text
location        text            -- 'Playa del Carmen', 'Cancún', etc.
position_type   text            -- 'Terapeuta', 'Estilista', etc.
contract_type   text            -- 'Tiempo completo', 'Por temporada', etc.
specialties     text[]
is_featured     boolean DEFAULT false
is_active       boolean DEFAULT true
created_at      timestamptz
updated_at      timestamptz
```

#### `applications`
```sql
id              uuid PK
vacancy_id      uuid FK → vacancies.id
therapist_id    uuid FK → therapist_profiles.id
status          enum('new', 'reviewing', 'chat_enabled', 'hired', 'rejected')
notes           text            -- notas internas del admin
created_at      timestamptz
updated_at      timestamptz
UNIQUE(vacancy_id, therapist_id)
```

#### `certificates`
```sql
id              uuid PK
therapist_id    uuid FK → therapist_profiles.id
title           text            -- nombre del curso/certificación
issued_by       text            -- 'Litsea Centro de Capacitación'
issued_at       date
file_url        text            -- Storage de Supabase
verified        boolean DEFAULT false
created_at      timestamptz
```

#### `conversations`
```sql
id              uuid PK
application_id  uuid FK → applications.id UNIQUE
therapist_id    uuid FK → profiles.id
employer_id     uuid FK → profiles.id
is_active       boolean DEFAULT false  -- el admin activa el chat
created_at      timestamptz
```

#### `messages`
```sql
id              uuid PK
conversation_id uuid FK → conversations.id
sender_id       uuid FK → profiles.id
body            text
read_at         timestamptz
created_at      timestamptz
```

#### `audit_logs`
```sql
id          uuid PK
admin_id    uuid FK → profiles.id
action      text
module      text
record_id   text
details     jsonb
created_at  timestamptz
```

#### `settings`
```sql
key         text PK
value       jsonb
updated_by  uuid FK → profiles.id
updated_at  timestamptz
```

Claves iniciales: `allow_registrations` (bool), `home_title` (text), `home_subtitle` (text).

---

### 4.2 Row Level Security (RLS)

- `profiles`: usuario solo lee/edita su propio row. Admin lee todos.
- `vacancies`: lectura pública para `is_active = true`. Solo empleador owner edita.
- `applications`: terapeuta ve las suyas. Empleador ve las de sus vacantes. Admin ve todo.
- `conversations` / `messages`: solo los participantes + admin.
- `certificates`: propietario + admin.
- `audit_logs`: solo admin.
- `settings`: solo admin.

---

## 5. Autenticación

- Proveedor: Supabase Auth
- Métodos: email+password y Google OAuth
- Callback: `/api/auth/callback` — después del OAuth redirect, leer `role` del metadata o del perfil y redirigir a `/terapeuta/dashboard`, `/empleador/dashboard` o `/admin`
- Al crear cuenta, insertar row en `profiles` con el rol correspondiente (via trigger de Supabase o Server Action)
- Middleware de Next.js protege las rutas `/(dashboard)/**`

### Trigger post-registro
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'therapist'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 6. Emails transaccionales (Resend)

| Evento | Destinatario | Plantilla |
|---|---|---|
| Registro exitoso | Terapeuta / Empleador | Bienvenida + confirmar email |
| Nueva aplicación | Admin | Notificación con link |
| Chat habilitado | Terapeuta + Empleador | "Ya pueden contactarse" |
| Nueva vacante publicada | Terapeutas activos (batch) | Digest semanal o inmediato |
| Cambio de estado de aplicación | Terapeuta | Estado actualizado |

Implementar con `@react-email/components` + `resend` SDK desde Route Handlers o Server Actions.

---

## 7. Migraciones (Supabase CLI)

```
supabase/
└── migrations/
    ├── 20260331_01_profiles.sql
    ├── 20260331_02_therapist_profiles.sql
    ├── 20260331_03_employer_profiles.sql
    ├── 20260331_04_vacancies.sql
    ├── 20260331_05_applications.sql
    ├── 20260331_06_certificates.sql
    ├── 20260331_07_conversations_messages.sql
    ├── 20260331_08_audit_logs.sql
    ├── 20260331_09_settings.sql
    ├── 20260331_10_rls_policies.sql
    └── 20260331_11_triggers.sql
```

Flujo: `supabase db diff` → revisar → `supabase db push` en staging → `supabase db push --linked` en producción.

---

## 8. Pantallas (18 total)

### Públicas (sin auth)
| # | Ruta | Descripción |
|---|---|---|
| 1 | `/` | Landing: hero, vacantes destacadas, terapeutas destacados, empleadores, cómo funciona, CTAs |
| 2 | `/vacantes` | Listado con filtros (zona, especialidad, tipo de contrato) |
| 3 | `/vacantes/[id]` | Detalle de vacante + botón aplicar |
| 4 | `/terapeutas` | Directorio público de terapeutas |
| 5 | `/terapeutas/[id]` | Perfil público de terapeuta |
| 6 | `/auth/login` | Login (email+pass + Google) |
| 7 | `/auth/registro-terapeuta` | Registro terapeuta |
| 8 | `/auth/registro-empleador` | Registro empleador |

### Dashboard Terapeuta
| # | Ruta | Descripción |
|---|---|---|
| 9 | `/terapeuta/dashboard` | Resumen: aplicaciones activas, mensajes nuevos, perfil completo |
| 10 | `/terapeuta/perfil` | Editar perfil: bio, especialidades, zonas, foto |
| 11 | `/terapeuta/aplicaciones` | Lista de aplicaciones con estado |
| 12 | `/terapeuta/certificados` | Ver/subir certificados |
| 13 | `/terapeuta/mensajes` | Chat con empleadores (solo convs habilitadas) |

### Dashboard Empleador
| # | Ruta | Descripción |
|---|---|---|
| 14 | `/empleador/dashboard` | Resumen: vacantes activas, aplicaciones nuevas |
| 15 | `/empleador/vacantes` | Gestión de vacantes propias |
| 16 | `/empleador/aplicaciones` | Ver aplicaciones a sus vacantes |
| 17 | `/empleador/mensajes` | Chat con terapeutas (solo convs habilitadas) |

### Admin
| # | Ruta | Descripción |
|---|---|---|
| 18 | `/admin` | Dashboard: métricas globales |
| 19 | `/admin/terapeutas` | CRUD terapeutas, verificar Litsea, suspender |
| 20 | `/admin/empleadores` | CRUD empleadores, suspender |
| 21 | `/admin/vacantes` | CRUD vacantes, destacar/ocultar |
| 22 | `/admin/aplicaciones` | Cambiar estado, habilitar chat |
| 23 | `/admin/certificados` | Revisar y verificar certificados subidos |
| 24 | `/admin/mensajes` | Vista de todas las conversaciones |
| 25 | `/admin/auditoria` | Log de acciones admin con filtros |
| 26 | `/admin/configuracion` | Toggle registros, textos del home |

---

## 9. Variables de entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=contacto@litsea.com.mx

# App
NEXT_PUBLIC_APP_URL=https://litsea.com.mx
```

---

## 10. Consideraciones de seguridad

- RLS habilitado en todas las tablas. Nunca usar `service_role_key` en cliente.
- Middleware valida sesión en todas las rutas `/(dashboard)`.
- Rate limiting en endpoints de auth (Supabase lo maneja, revisar configuración).
- Storage de certificados: bucket privado, acceso solo via signed URLs.
- Audit log en todas las acciones admin críticas (cambio de estado, suspensión, verificación).
- Validación de roles en Server Actions: no confiar solo en el cliente.

---

## 11. Flujo de datos principal

```
Terapeuta se registra
  → row en auth.users (Supabase)
  → trigger crea profiles + therapist_profiles
  → email de bienvenida (Resend)
  → perfil incompleto, redirige a /terapeuta/perfil

Terapeuta aplica a vacante
  → insert en applications (status: 'new')
  → email al admin

Admin revisa aplicación
  → cambia status a 'reviewing' o 'chat_enabled'
  → si chat_enabled: insert en conversations (is_active: true)
  → email a terapeuta y empleador

Terapeuta y empleador se mensajean
  → insert en messages
  → Supabase Realtime para updates en tiempo real

Admin configura home
  → upsert en settings
  → home lee settings en Server Component (no cache o ISR corto)
```

---

## 12. Decisiones pendientes

- [ ] ¿Realtime con Supabase Realtime o polling para el chat?
- [ ] ¿Notificaciones push o solo email?
- [ ] ¿Los empleadores se registran solos o solo el admin los crea?
- [ ] ¿Límite de vacantes por empleador en plan inicial?
- [ ] ¿Terapeuta puede aplicar a múltiples vacantes del mismo empleador?
- [ ] ¿Sistema de búsqueda/filtros con `pg_trgm` o simple `ILIKE`?
