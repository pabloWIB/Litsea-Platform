# 05 · Panel del Empleador
**Rol:** `employer`  
**Ruta base:** `/empleador/*`  
**Acceso:** Requiere sesión con `role='employer'`  
**Layout:** `DashboardShell` — Sidebar izquierdo + Header + contenido en `#FAF9F5`

---

## Navegación del sidebar (empleador)

```
[Logo Litsea]   Litsea Empleos

Inicio             /empleador/dashboard
─── Contratación ───
Vacantes           /empleador/vacantes
Candidatos         /empleador/candidatos
─── Comunicación ───
Mensajes           /empleador/mensajes
─── (footer) ───
Configuración      /empleador/configuracion
[company_name / email]
Cerrar sesión
```

**Nota sobre el nombre:** El ítem se llama "Candidatos" (no "Aplicaciones") porque desde la perspectiva del empleador son personas candidatas, no formularios de aplicación.

---

## 1. Dashboard `/empleador/dashboard`

### Header
```
Bienvenido, {company_name}
Panel de control de empleador
```

### Métricas (3 cards)

**Card 1 — Vacantes activas**
- Valor: `COUNT(vacancies WHERE employer_id = X AND is_active = true)`
- Ícono: Briefcase
- CTA: "Ver mis vacantes" → `/empleador/vacantes`

**Card 2 — Aplicaciones recibidas**
- Valor: `COUNT(applications WHERE vacancy.employer_id = X AND status != 'rejected')`
- Ícono: ClipboardList
- CTA: "Ver candidatos" → `/empleador/candidatos`

**Card 3 — Terapeutas contratados**
- Valor: `COUNT(applications WHERE vacancy.employer_id = X AND status = 'hired')`
- Ícono: Users (con check)
- Color: verde cuando > 0

### Query base
```typescript
const { data: employerProfile } = await supabase
  .from('employer_profiles')
  .select('id, company_name')
  .eq('user_id', user.id)
  .single()

const employerId = employerProfile.id

// Métricas en paralelo
const [
  { count: vacantesActivas },
  { count: aplicacionesRecibidas },
  { count: contratados }
] = await Promise.all([
  supabase.from('vacancies').select('*', { count: 'exact', head: true })
    .eq('employer_id', employerId).eq('is_active', true),
  supabase.from('applications')
    .select('*, vacancies!inner(employer_id)', { count: 'exact', head: true })
    .eq('vacancies.employer_id', employerId)
    .neq('status', 'rejected'),
  supabase.from('applications')
    .select('*, vacancies!inner(employer_id)', { count: 'exact', head: true })
    .eq('vacancies.employer_id', employerId)
    .eq('status', 'hired'),
])
```

### Acceso rápido (debajo de métricas)
```
[+] Nueva vacante    → /empleador/vacantes/nueva
[👁] Ver candidatos  → /empleador/candidatos
[💬] Ir a mensajes   → /empleador/mensajes
```

---

## 2. Mis Vacantes `/empleador/vacantes`

### Propósito
Gestión completa de las ofertas de trabajo del empleador.

### Header
```
Mis Vacantes
[+ Nueva vacante]          ← botón primario top-right
```

### Lista de vacantes

Cada vacante muestra:
```
[activa|inactiva]  Terapeuta de Masajes Sueco
                   📍 Cancún · Tiempo completo
                   Especialidades: Masaje Sueco · Reflexología
                   Publicada: 10 mayo 2026 · 5 aplicaciones
                   
[Editar] [Ver candidatos] [Activar/Desactivar] [Eliminar]
```

**Badge estado:**
- `is_active = true` → chip verde "Activa"
- `is_active = false` → chip gris "Inactiva"

**Acciones por vacante:**
| Acción | Comportamiento |
|---|---|
| Editar | → `/empleador/vacantes/{id}/editar` |
| Ver candidatos | → `/empleador/candidatos?vacante={id}` |
| Activar/Desactivar | PATCH `vacancies.is_active` |
| Eliminar | Modal confirmación → DELETE (solo si no tiene aplicaciones activas) |

### Empty state
```
Aún no has publicado vacantes.
Publica tu primera oferta y empieza a recibir candidatos.
[Publicar primera vacante →]
```

---

## 3. Nueva Vacante `/empleador/vacantes/nueva`

### Propósito
Formulario para crear una oferta de trabajo.

### Campos del formulario

```
Título del puesto *
  Input: "Ej. Terapeuta de Masajes Sueco"
  Max 100 chars

Descripción *
  Textarea: descripción detallada del puesto
  Min 50 chars, max 2000 chars
  Guía: "Incluye requisitos, horarios, prestaciones y expectativas"

Ubicación *
  Select:
  - Cancún
  - Playa del Carmen
  - Tulum
  - Cozumel
  - Holbox
  - Puerto Morelos
  - Otra (con campo de texto libre)

Tipo de posición
  Select:
  - Terapeuta
  - Estilista
  - Esteticista
  - Recepcionista Spa
  - Coordinador Spa
  - Otro

Tipo de contrato *
  Radio buttons:
  ○ Tiempo completo
  ○ Por temporada
  ○ Freelance / Por día

Especialidades requeridas *
  Chips seleccionables (múltiple):
  - Masoterapia Sueca
  - Reflexología
  - Aromaterapia
  - Masaje con Piedras Calientes
  - Drenaje Linfático
  - Faciales
  - Manicura y Pedicura
  - Hidroterapia
  - Reiki

[Guardar borrador]   [Publicar vacante]
```

### Comportamiento
- "Guardar borrador" → crea con `is_active = false`
- "Publicar vacante" → crea con `is_active = true`
- Tras publicar → redirige a `/empleador/vacantes` con mensaje "Vacante publicada exitosamente"

### Route Handler: `POST /api/vacantes`
```typescript
// Validaciones server-side:
// - verificar que el user tiene role='employer'
// - verificar que la vacante pertenece al employer
// - insertar en vacancies

INSERT INTO vacancies (employer_id, title, description, location, position_type, contract_type, specialties, is_active)
VALUES (...)
```

---

## 4. Editar Vacante `/empleador/vacantes/[id]/editar`

Igual al formulario de nueva vacante pero pre-llenado con los datos existentes.

**Validaciones:**
- El `employer_id` de la vacante debe coincidir con el del usuario autenticado (seguridad)
- Si no coincide → 403 Forbidden

---

## 5. Candidatos `/empleador/candidatos`

### Propósito
Ver todos los terapeutas que aplicaron a las vacantes del empleador. El empleador puede filtrar por vacante y ver el perfil de cada candidato.

### Header
```
Candidatos
Terapeutas que aplicaron a tus vacantes.

Filtrar por vacante: [Todas las vacantes ▼]
```

### Tarjeta de candidato
```
[Foto]  María García López
        Masoterapia · 5 años de experiencia
        📍 Playa del Carmen · Cancún
        [Egresada Litsea ✓]
        
Vacante: Terapeuta de Masajes Sueco
Fecha aplicación: 8 mayo 2026
Estado: [EN REVISIÓN]           ← admin controla este estado

[Ver perfil completo]           → /terapeutas/{slug}
                                   (perfil público del terapeuta)
```

**Nota importante:** El empleador NO puede cambiar el estado de la aplicación. Solo el admin puede hacerlo. El empleador solo visualiza el estado actual.

### Estados visibles para el empleador
| Estado | Lo que ve el empleador |
|---|---|
| `new` | "Nueva aplicación" |
| `reviewing` | "En revisión por Litsea" |
| `chat_enabled` | "Chat habilitado — puede contactarlo" |
| `hired` | "Contratado" |
| `rejected` | No se muestra al empleador (o "No seleccionado" si el empleador rechazó) |

### Chat habilitado
Si `chat_enabled` → mostrar botón "Iniciar chat" → `/empleador/mensajes?conv={conversationId}`

### Empty state
```
Aún no hay candidatos para esta vacante.
Cuando los terapeutas apliquen, aparecerán aquí.
```

---

## 6. Mensajes `/empleador/mensajes`

### Propósito
Chat con terapeutas cuyas conversaciones han sido habilitadas por el admin.

### Layout (igual que el del terapeuta)
- Lista de conversaciones (izq)
- Ventana de chat (der)

### Conversación
```
[Foto terapeuta]  María García López
Vacante: Terapeuta de Masajes Sueco
Último mensaje: "Sí, tengo disponibilidad..."   hace 1h
```

### Restricciones
- El empleador SOLO ve conversaciones donde `employer_id = auth.uid()` y `is_active = true`
- No puede iniciar conversaciones por su cuenta — solo el admin las activa

---

## 7. Configuración `/empleador/configuracion`

### Secciones

**Datos de la empresa**
- Nombre del hotel/spa → actualiza `employer_profiles.company_name`
- Website → `employer_profiles.website`
- Descripción → `employer_profiles.description`
- Logo → upload a Storage bucket `logos`
- Guardar → PATCH en `employer_profiles`

**Seguridad**
- Cambiar contraseña
- Cambiar email

**Notificaciones** (toggles)
- Email cuando un terapeuta aplica a mis vacantes
- Email cuando Litsea habilita un chat

**Cuenta**
- "Eliminar cuenta" → modal de confirmación → elimina vacantes, aplicaciones y cuenta

---

## Flujo completo del empleador

```
1. Empleador crea cuenta en /registro-empleador
   → Trigger crea profiles + employer_profiles

2. Empleador accede a /empleador/dashboard
   → Ve métricas vacías inicialmente

3. Empleador crea vacante en /empleador/vacantes/nueva
   → Vacante publicada con is_active=true

4. Terapeutas ven la vacante en /vacantes y aplican
   → Se crean applications con status='new'

5. Admin revisa en /admin/aplicaciones
   → Cambia status a 'reviewing' y luego 'chat_enabled'
   → Se crea conversation con is_active=true
   → Se envía email a terapeuta y empleador

6. Empleador ve al candidato en /empleador/candidatos con status='chat_enabled'
   → Puede ir a /empleador/mensajes y chatear con el terapeuta

7. Si contratan: admin cambia status a 'hired'
   → Aparece en métrica "Terapeutas contratados"
```

---

## Notas de seguridad

### En todos los Route Handlers del empleador:
1. Verificar `role = 'employer'` en el token JWT
2. Verificar que el recurso (vacante, aplicación) pertenece al `employer_profile` del usuario
3. Nunca permitir que un empleador modifique el `status` de una aplicación directamente

### En Server Components:
```typescript
// Verificar que la vacante pertenece al empleador
const { data: vacancy } = await supabase
  .from('vacancies')
  .select('*, employer_profiles!inner(user_id)')
  .eq('id', vacancyId)
  .eq('employer_profiles.user_id', user.id)
  .single()

if (!vacancy) return notFound()
```
