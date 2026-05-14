# 02 · Base de datos
**Motor:** PostgreSQL via Supabase  
**Archivo fuente:** `supabase/schema.sql` + `supabase/rls.sql`  
**Estado:** Scripts listos — pendiente aplicar en Supabase SQL Editor

---

## Diagrama de relaciones

```
auth.users (Supabase)
    │
    ├── profiles (1:1)
    │       ├── therapist_profiles (1:1, solo role=therapist)
    │       │       ├── applications (1:N)
    │       │       │       └── conversations (1:1)
    │       │       │               └── messages (1:N)
    │       │       └── certificates (1:N)
    │       │
    │       └── employer_profiles (1:1, solo role=employer)
    │               └── vacancies (1:N)
    │                       └── applications (1:N)
    │
    ├── audit_logs (admin actions)
    └── settings (config global)

opiniones (independiente, sin FK a profiles)
```

---

## Tablas

### `auth.users` (Supabase — no editar directamente)
Gestionada por Supabase Auth. Columnas relevantes:
- `id` UUID — primary key, referenciada por `profiles.id`
- `email` — email del usuario
- `raw_user_meta_data` — JSON con `role`, `full_name`, `company_name` (se pasa al registrarse)
- `email_confirmed_at` — NULL si no confirmó email

---

### `public.profiles`
Un row por usuario. Se crea automáticamente via trigger `handle_new_user`.

```sql
id          UUID PK → auth.users.id (CASCADE DELETE)
role        user_role NOT NULL DEFAULT 'therapist'
            -- enum: 'therapist' | 'employer' | 'admin'
full_name   TEXT NOT NULL DEFAULT ''
email       TEXT NOT NULL DEFAULT ''
phone       TEXT                          -- opcional
avatar_url  TEXT                          -- URL en Storage (bucket: avatars)
is_active   BOOLEAN NOT NULL DEFAULT true -- suspender cuentas
created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
            -- Trigger: trg_profiles_updated_at
```

---

### `public.therapist_profiles`
Datos profesionales del terapeuta. Se crea junto con `profiles` si `role='therapist'`.

```sql
id               UUID PK (gen_random_uuid)
user_id          UUID → profiles.id UNIQUE (CASCADE DELETE)
specialties      TEXT[] NOT NULL DEFAULT '{}'
                 -- ['Masoterapia', 'Reflexología', 'Aromaterapia', ...]
zones            TEXT[] NOT NULL DEFAULT '{}'
                 -- ['Playa del Carmen', 'Cancún', 'Tulum', ...]
bio              TEXT
experience_years INT DEFAULT 0
is_litsea_grad   BOOLEAN NOT NULL DEFAULT false
                 -- True si el admin verificó que es egresado
is_verified      BOOLEAN NOT NULL DEFAULT false
                 -- True si el admin aprobó el perfil completo
slug             TEXT UNIQUE
                 -- URL friendly: 'maria-garcia-lopez'
created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
                 -- Trigger: trg_therapist_profiles_updated_at
```

**Cálculo % perfil completado:**
```
total = 4
completado = count_true([
  len(specialties) > 0,
  len(zones) > 0,
  profiles.avatar_url IS NOT NULL,
  EXISTS(SELECT 1 FROM certificates WHERE therapist_id = this.id)
])
porcentaje = (completado / total) * 100
```

---

### `public.employer_profiles`
Datos del hotel o spa empleador.

```sql
id           UUID PK (gen_random_uuid)
user_id      UUID → profiles.id UNIQUE (CASCADE DELETE)
company_name TEXT NOT NULL DEFAULT ''   -- "Grand Hyatt Playa del Carmen"
website      TEXT                        -- opcional
description  TEXT                        -- descripción del establecimiento
logo_url     TEXT                        -- URL en Storage (bucket: logos)
slug         TEXT UNIQUE                 -- 'grand-hyatt-playa-del-carmen'
created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
             -- Trigger: trg_employer_profiles_updated_at
```

---

### `public.vacancies`
Ofertas de trabajo publicadas por empleadores.

```sql
id             UUID PK (gen_random_uuid)
employer_id    UUID → employer_profiles.id (CASCADE DELETE)
title          TEXT NOT NULL              -- "Terapeuta de Masajes Sueco"
description    TEXT NOT NULL             -- descripción larga
location       TEXT NOT NULL             -- "Playa del Carmen, Q.R."
position_type  TEXT NOT NULL DEFAULT ''  -- "Terapeuta", "Estilista", etc.
contract_type  TEXT NOT NULL DEFAULT ''  -- "Tiempo completo", "Por temporada", "Freelance"
specialties    TEXT[] NOT NULL DEFAULT '{}'  -- especialidades requeridas
is_featured    BOOLEAN NOT NULL DEFAULT false  -- destacada en home
is_active      BOOLEAN NOT NULL DEFAULT true   -- visible públicamente
created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
               -- Trigger: trg_vacancies_updated_at
```

**Índices:**
```sql
idx_vacancies_employer   ON vacancies(employer_id)
idx_vacancies_active     ON vacancies(is_active, is_featured)
```

---

### `public.applications`
Postulación de un terapeuta a una vacante.

```sql
id           UUID PK (gen_random_uuid)
vacancy_id   UUID → vacancies.id (CASCADE DELETE)
therapist_id UUID → therapist_profiles.id (CASCADE DELETE)
status       application_status NOT NULL DEFAULT 'new'
             -- enum: 'new' | 'reviewing' | 'chat_enabled' | 'hired' | 'rejected'
notes        TEXT                    -- notas internas del admin (no visibles al terapeuta)
created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
             -- Trigger: trg_applications_updated_at
UNIQUE(vacancy_id, therapist_id)    -- un terapeuta no puede aplicar dos veces a la misma vacante
```

**Estados posibles:**
```
new          → Recién enviada, admin no la ha revisado
reviewing    → Admin la está revisando
chat_enabled → Admin habilitó el chat: se crea conversation
hired        → El empleador contrató al terapeuta
rejected     → No fue seleccionado
```

**Índices:**
```sql
idx_applications_vacancy  ON applications(vacancy_id)
idx_applications_therapist ON applications(therapist_id)
idx_applications_status   ON applications(status)
```

---

### `public.certificates`
Certificados subidos por terapeutas para verificar su formación.

```sql
id           UUID PK (gen_random_uuid)
therapist_id UUID → therapist_profiles.id (CASCADE DELETE)
title        TEXT NOT NULL              -- "Masoterapia Sueca Avanzada"
issued_by    TEXT NOT NULL DEFAULT 'Litsea Centro de Capacitación'
issued_at    DATE                       -- fecha de emisión
file_url     TEXT NOT NULL             -- URL firmada en Storage (bucket: certificates, privado)
verified     BOOLEAN NOT NULL DEFAULT false  -- admin marcó como válido
created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

**Índice:**
```sql
idx_certificates_therapist ON certificates(therapist_id)
```

---

### `public.conversations`
Chat entre terapeuta y empleador. Se crea cuando admin cambia status a `chat_enabled`.

```sql
id             UUID PK (gen_random_uuid)
application_id UUID → applications.id UNIQUE (CASCADE DELETE)
               -- una conversación por aplicación
therapist_id   UUID → profiles.id (CASCADE DELETE)
employer_id    UUID → profiles.id (CASCADE DELETE)
is_active      BOOLEAN NOT NULL DEFAULT false
               -- admin activa/desactiva el chat
created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

---

### `public.messages`
Mensajes individuales en una conversación.

```sql
id              UUID PK (gen_random_uuid)
conversation_id UUID → conversations.id (CASCADE DELETE)
sender_id       UUID → profiles.id (CASCADE DELETE)
body            TEXT NOT NULL
read_at         TIMESTAMPTZ     -- NULL si no leído
created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

**Índice:**
```sql
idx_messages_conversation ON messages(conversation_id, created_at)
```

**Realtime:** Supabase Realtime escucha `INSERT` en `messages` para el chat en tiempo real.

---

### `public.audit_logs`
Historial de todas las acciones del equipo admin.

```sql
id         UUID PK (gen_random_uuid)
admin_id   UUID → profiles.id (SET NULL on delete)
action     TEXT NOT NULL   -- 'verify_therapist', 'suspend_user', 'enable_chat', etc.
module     TEXT NOT NULL   -- 'terapeutas', 'empleadores', 'vacantes', 'aplicaciones', etc.
record_id  TEXT            -- UUID del registro afectado
details    JSONB           -- contexto adicional: antes/después, motivo, etc.
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

**Índice:**
```sql
idx_audit_logs_admin ON audit_logs(admin_id, created_at DESC)
```

**Función helper (`lib/audit.ts`):**
```typescript
logAudit(adminId: string, action: string, module: string, recordId: string, details?: object)
```

---

### `public.settings`
Configuración global de la plataforma. Modificable desde el panel admin.

```sql
key        TEXT PK           -- identificador de la config
value      JSONB NOT NULL    -- valor (puede ser bool, string, number, array)
updated_by UUID → profiles.id (SET NULL on delete)
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

**Valores iniciales:**
```sql
allow_registrations = true         -- toggle: permitir nuevos registros
home_title          = "Conectamos terapeutas con el lujo"
home_subtitle       = "Encuentra tu lugar en los mejores spas..."
```

---

### `public.opiniones` 🆕 NUEVA
Reviews/testimonios de usuarios públicos. Requiere aprobación del admin.

```sql
id          UUID PK (gen_random_uuid)
nombre      TEXT NOT NULL              -- "María García"
email       TEXT NOT NULL             -- no se muestra públicamente
cargo       TEXT                       -- "Terapeuta Certificada" (opcional)
empresa     TEXT                       -- "Grand Hyatt Cancún" (opcional)
contenido   TEXT NOT NULL             -- el texto de la opinión (20-300 chars)
rating      INT CHECK (rating BETWEEN 1 AND 5)  -- estrellas
status      TEXT NOT NULL DEFAULT 'pending'
            CHECK (status IN ('pending', 'approved', 'rejected'))
revisado_by UUID REFERENCES profiles(id) ON DELETE SET NULL
revisado_at TIMESTAMPTZ               -- cuándo fue aprobada/rechazada
created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

---

## Tipos personalizados (ENUMs)

```sql
CREATE TYPE user_role AS ENUM ('therapist', 'employer', 'admin');

CREATE TYPE application_status AS ENUM (
  'new',
  'reviewing',
  'chat_enabled',
  'hired',
  'rejected'
);
```

---

## Trigger: `handle_new_user`

Se ejecuta **después de cada INSERT en `auth.users`**. Crea automáticamente las filas en `profiles` y en `therapist_profiles` o `employer_profiles` según el rol.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Siempre crea el perfil base
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'therapist'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );

  -- Si es terapeuta, crea therapist_profile vacío
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'therapist') = 'therapist' THEN
    INSERT INTO public.therapist_profiles (user_id)
    VALUES (NEW.id);
  END IF;

  -- Si es empleador, crea employer_profile con company_name
  IF NEW.raw_user_meta_data->>'role' = 'employer' THEN
    INSERT INTO public.employer_profiles (user_id, company_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'company_name', '')
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Importante:** La función requiere `SET search_path = public` para funcionar correctamente en el contexto de Supabase Auth.

---

## Row Level Security (RLS)

### Función helper
```sql
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

### Políticas por tabla

#### `profiles`
| Operación | Quién puede | Condición |
|---|---|---|
| SELECT | Público | `is_active = true` |
| UPDATE | Propietario | `id = auth.uid()` |
| ALL | Admin | `current_user_role() = 'admin'` |

#### `therapist_profiles`
| Operación | Quién puede | Condición |
|---|---|---|
| SELECT | Público | `is_verified = true` |
| ALL | Propietario | `user_id = auth.uid()` |
| ALL | Admin | `current_user_role() = 'admin'` |

#### `employer_profiles`
| Operación | Quién puede | Condición |
|---|---|---|
| SELECT | Público | `true` (todas visibles) |
| ALL | Propietario | `user_id = auth.uid()` |
| ALL | Admin | `current_user_role() = 'admin'` |

#### `vacancies`
| Operación | Quién puede | Condición |
|---|---|---|
| SELECT | Público | `is_active = true` |
| ALL | Empleador owner | `employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid())` |
| ALL | Admin | `current_user_role() = 'admin'` |

#### `applications`
| Operación | Quién puede | Condición |
|---|---|---|
| ALL | Terapeuta owner | `therapist_id IN (SELECT id FROM therapist_profiles WHERE user_id = auth.uid())` |
| SELECT | Empleador | `vacancy_id IN (vacantes del empleador)` |
| ALL | Admin | `current_user_role() = 'admin'` |

#### `certificates`
| Operación | Quién puede | Condición |
|---|---|---|
| ALL | Propietario | `therapist_id IN (SELECT id FROM therapist_profiles WHERE user_id = auth.uid())` |
| ALL | Admin | `current_user_role() = 'admin'` |

#### `conversations`
| Operación | Quién puede | Condición |
|---|---|---|
| SELECT | Participantes | `therapist_id = auth.uid() OR employer_id = auth.uid() OR admin` |
| UPDATE | Admin | `current_user_role() = 'admin'` |
| INSERT | Admin | `current_user_role() = 'admin'` |

#### `messages`
| Operación | Quién puede | Condición |
|---|---|---|
| ALL | Participantes | conversation activa donde participa el usuario, o admin |

#### `audit_logs`
| Operación | Quién puede | Condición |
|---|---|---|
| ALL | Admin | `current_user_role() = 'admin'` |

#### `settings`
| Operación | Quién puede | Condición |
|---|---|---|
| SELECT | Público | `true` |
| ALL | Admin | `current_user_role() = 'admin'` |

#### `opiniones` 🆕
| Operación | Quién puede | Condición |
|---|---|---|
| SELECT | Público | `status = 'approved'` |
| INSERT | Público | `true` (cualquiera puede enviar) |
| ALL | Admin | `current_user_role() = 'admin'` |

---

## Supabase Storage — Buckets

| Bucket | Visibilidad | Qué guarda | URL |
|---|---|---|---|
| `avatars` | Público | Fotos de perfil de terapeutas | URL directa |
| `certificates` | Privado | PDFs de certificados | Signed URL (expira en 1h) |
| `logos` | Público | Logos de empleadores | URL directa |

---

## Cómo aplicar el esquema

### Orden correcto de ejecución en Supabase SQL Editor:

1. **Limpiar** (si hay residuos de configuraciones anteriores):
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.vacancies CASCADE;
DROP TABLE IF EXISTS public.employer_profiles CASCADE;
DROP TABLE IF EXISTS public.therapist_profiles CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS public.application_status CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;
```

2. Ejecutar `supabase/schema.sql` completo
3. Ejecutar `supabase/rls.sql` completo
4. Ejecutar la nueva tabla de opiniones:
```sql
-- Agregar en supabase/schema.sql y ejecutar
CREATE TABLE public.opiniones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  email       TEXT NOT NULL,
  cargo       TEXT,
  empresa     TEXT,
  contenido   TEXT NOT NULL CHECK (char_length(contenido) BETWEEN 20 AND 300),
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'rejected')),
  revisado_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  revisado_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.opiniones ENABLE ROW LEVEL SECURITY;
```
5. Ejecutar las políticas RLS de opiniones (ver sección anterior)
6. Configurar Storage: crear buckets `avatars` (público), `certificates` (privado), `logos` (público)
7. Configurar trigger en Auth → Settings:
   - Site URL: `https://empleos.litseacc.edu.mx`
   - Redirect URLs: `http://localhost:3000/api/auth/callback` y `https://empleos.litseacc.edu.mx/api/auth/callback`
