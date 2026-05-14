# 06 · Panel de Administración
**Rol:** `admin`  
**Ruta base:** `/admin/*`  
**Acceso:** Solo cuentas con `role='admin'` — creadas manualmente en Supabase  
**Acceso desde:** Footer → link "Admin" → `/login/admin`

---

## Navegación del sidebar (admin)

```
[Logo Litsea]   Litsea Empleos

Inicio             /admin

─── Usuarios ───
Terapeutas         /admin/terapeutas
Empleadores        /admin/empleadores

─── Plataforma ───
Vacantes           /admin/vacantes
Aplicaciones       /admin/aplicaciones
Certificados       /admin/certificados
Mensajes           /admin/mensajes
Opiniones          /admin/opiniones        ← 🆕 con badge de pendientes

─── Sistema ───
Auditoría          /admin/auditoria
Configuración      /admin/configuracion

[email del admin]
Admin              ← badge de rol
Cerrar sesión
```

---

## 1. Dashboard `/admin`

### Header
```
Panel de Administración
```

### Métricas (5 cards)
```
[Terapeutas]    [Empleadores]    [Vacantes]
     0                0               0

[Aplicaciones]  [Certificados]
      0                0
```

Cada card:
- Número total desde DB
- Ícono representativo
- CTA opcional ("Ver todos")

### Query
```typescript
const [
  { count: terapeutas },
  { count: empleadores },
  { count: vacantes },
  { count: aplicaciones },
  { count: certificados },
] = await Promise.all([
  supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'therapist'),
  supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'employer'),
  supabase.from('vacancies').select('*', { count: 'exact', head: true }).eq('is_active', true),
  supabase.from('applications').select('*', { count: 'exact', head: true }),
  supabase.from('certificates').select('*', { count: 'exact', head: true }),
])
```

### Accesos rápidos (debajo de métricas)
- Últimas aplicaciones nuevas (últimas 5 con `status='new'`)
- Certificados pendientes de verificar (últimos 5 con `verified=false`)
- Opiniones pendientes de moderar (count de `status='pending'`)

---

## 2. Terapeutas `/admin/terapeutas`

### Propósito
Ver, verificar, suspender y gestionar todos los terapeutas registrados.

### Filtros
```
[Buscar por nombre/email...]   [Todos] [Verificados] [No verificados] [Suspendidos]
```

### Tabla/lista de terapeutas
```
Foto  Nombre               Email                 Especialidad    Egresado  Verificado  Activo   Acciones
──────────────────────────────────────────────────────────────────────────────────────────────────────
[👤]  María García López   maria@email.com       Masoterapia     ✓ Sí      ✓ Sí        ● Activo  [···]
[👤]  Juan Pérez           juan@email.com        Reflexología    ✗ No      ✗ No        ● Activo  [···]
```

### Menú de acciones por terapeuta [···]
- **Ver perfil completo** → `/terapeutas/{slug}` (perfil público)
- **Verificar** → `therapist_profiles.is_verified = true` + logAudit
- **Revocar verificación** → `is_verified = false` + logAudit
- **Marcar egresado Litsea** → `is_litsea_grad = true` + logAudit
- **Suspender cuenta** → `profiles.is_active = false` + logAudit
- **Reactivar cuenta** → `profiles.is_active = true` + logAudit
- **Ver certificados** → → `/admin/certificados?terapeuta={id}`
- **Ver aplicaciones** → `/admin/aplicaciones?terapeuta={id}`
- **Eliminar** → Modal de confirmación → cascade delete (cuidado: elimina también auth.users)

### Auditoría
Cada acción llama `logAudit(adminId, acción, 'terapeutas', terapeutaId, detalles)`.

---

## 3. Empleadores `/admin/empleadores`

### Similar a terapeutas pero para empresas.

### Tabla
```
Logo  Empresa                    Email               Vacantes  Activo   Acciones
────────────────────────────────────────────────────────────────────────────────
[🏨]  Grand Hyatt Cancún         rrhh@hyatt.com      3         ● Activo  [···]
[🏨]  Fiesta Americana Coral     ..@fiesta.com       0         ● Activo  [···]
```

### Acciones por empleador
- **Ver vacantes** → `/admin/vacantes?empleador={id}`
- **Suspender** → `profiles.is_active = false`
- **Reactivar** → `profiles.is_active = true`
- **Eliminar** → Modal → cascade delete

---

## 4. Vacantes `/admin/vacantes`

### Propósito
Visión global de todas las vacantes. Admin puede destacarlas u ocultarlas.

### Filtros
```
[Buscar...]  [Todas] [Activas] [Inactivas] [Destacadas]  [Empleador ▼]
```

### Tabla
```
Empresa           Título                      Ubicación      Contrato    Destacada  Activa  Aplicaciones  Acciones
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Grand Hyatt       Terapeuta Masaje Sueco      Cancún         Completo    ⭐ Sí       ✓       8             [···]
Fiesta Americana  Esteticista Facial          PDC            Temporada   No         ✓       2             [···]
```

### Acciones
- **Destacar / Quitar destacado** → PATCH `vacancies.is_featured` + logAudit
- **Activar / Desactivar** → PATCH `vacancies.is_active` + logAudit
- **Ver aplicaciones** → `/admin/aplicaciones?vacante={id}`
- **Eliminar** → Modal + logAudit (solo si no tiene aplicaciones activas)

---

## 5. Aplicaciones `/admin/aplicaciones`

### Propósito
El flujo más crítico del sistema. El admin revisa aplicaciones y decide cuándo habilitar el chat.

### Filtros
```
[Buscar terapeuta/empresa...]  [Todos estados ▼]  [Vacante ▼]  [Empleador ▼]
Estados: Nuevas | En revisión | Chat habilitado | Contratados | Rechazados
```

### Tabla
```
Terapeuta            Vacante                    Empresa          Fecha       Estado          Acciones
─────────────────────────────────────────────────────────────────────────────────────────────────────
María García López   Terapeuta Masaje Sueco     Grand Hyatt      10 may      🔵 Nueva        [···]
Juan Pérez           Reflexólogo Spa            Hotel Azul       8 may       🟡 En revisión  [···]
Ana López            Esteticista Facial         Fiesta Americana 5 may       🟢 Chat activo  [···]
```

### Menú de acciones [···]
- **Ver perfil del terapeuta** → abre perfil público
- **Ver vacante** → abre detalle de vacante
- **Cambiar a "En revisión"** → `status = 'reviewing'` + logAudit
- **Habilitar chat** → `status = 'chat_enabled'`
  - Crea `conversations (application_id, therapist_id, employer_id, is_active=true)`
  - Envía email a terapeuta y empleador (Resend)
  - logAudit
- **Marcar como Contratado** → `status = 'hired'` + logAudit
- **Rechazar** → `status = 'rejected'` + logAudit + email al terapeuta
- **Notas internas** → editar `applications.notes` (visible solo para admin)

### Vista detalle de aplicación
Al hacer clic en una fila → modal o página con:
- Perfil completo del terapeuta
- Detalle de la vacante
- Historial de cambios de estado
- Notas del admin
- Botones de acción

---

## 6. Certificados `/admin/certificados`

### Propósito
Revisar y validar los certificados que los terapeutas subieron para verificar su formación.

### Filtros
```
[Buscar terapeuta...]  [Todos] [Pendientes] [Verificados] [Rechazados]
```

### Lista de certificados
```
Terapeuta            Curso                          Fecha emisión  Estado           Acciones
─────────────────────────────────────────────────────────────────────────────────────────────
María García         Masoterapia Sueca Avanzada     Ene 2025       ⏳ Pendiente     [Ver PDF] [Verificar] [Rechazar]
Juan Pérez           Reflexología Podal             Mar 2024       ✓ Verificado     [Ver PDF]
```

### Ver PDF
- Genera signed URL temporal (1 hora) desde Supabase Storage bucket `certificates`
- Abre en nueva pestaña o iframe

### Verificar
- `certificates.verified = true` + logAudit
- Si el terapeuta tiene al menos 1 certificado verificado, considerar para actualizar `is_litsea_grad = true`

### Rechazar
- `certificates.verified = false` (mantiene el archivo, solo cambia status)
- logAudit

---

## 7. Mensajes `/admin/mensajes`

### Propósito
Vista de lectura de todas las conversaciones activas. El admin supervisa pero no participa en los chats.

### Lista de conversaciones activas
```
María García ↔ Grand Hyatt Cancún
Vacante: Terapeuta de Masajes · Activa desde: 10 may
Último mensaje: "Perfecto, quedamos el viernes..."  hace 3h
```

### Vista de mensajes
Solo lectura. El admin ve todos los mensajes de cualquier conversación.

### Activar / Desactivar conversación
Admin puede `PATCH conversations.is_active`:
- Si desactiva → los participantes ya no pueden enviar mensajes
- Se registra en auditoría

---

## 8. Opiniones `/admin/opiniones` 🆕

Ver documento completo en `08-opiniones.md`.

### Resumen desde el panel admin:

**Tabs principales:**
```
[Pendientes (3)]  [Aprobadas (12)]  [Rechazadas (5)]
```

**Por opinión:**
```
Carlos M.           ⭐⭐⭐⭐⭐
"La plataforma me ayudó a encontrar trabajo en menos de 2 semanas..."
Terapeuta · Cancún · 11 mayo 2026

[Aprobar ✓]  [Rechazar ✗]  [Ver completa]
```

**Aprobar:**
- `status = 'approved'` + `revisado_by = admin.id` + `revisado_at = NOW()`
- La opinión aparece inmediatamente en el home
- logAudit

**Rechazar:**
- `status = 'rejected'` + `revisado_by` + `revisado_at`
- La opinión no se publica
- logAudit

---

## 9. Auditoría `/admin/auditoria`

### Propósito
Historial inmutable de todas las acciones realizadas por admins.

### Filtros
```
[Todos los módulos ▼]  [Todas las acciones ▼]  [Admin ▼]  [Fecha desde]  [Fecha hasta]
```

**Módulos:** terapeutas · empleadores · vacantes · aplicaciones · certificados · opiniones · configuracion · mensajes

**Acciones comunes:**
- `verify_therapist` — verificar terapeuta
- `suspend_user` — suspender cuenta
- `reactivate_user` — reactivar cuenta
- `enable_chat` — habilitar chat
- `change_application_status` — cambiar estado aplicación
- `feature_vacancy` — destacar vacante
- `verify_certificate` — verificar certificado
- `approve_opinion` — aprobar opinión
- `reject_opinion` — rechazar opinión
- `update_settings` — cambiar configuración

### Tabla de auditoría
```
Fecha/hora          Admin              Acción                  Módulo          Detalle
────────────────────────────────────────────────────────────────────────────────────────
13 may 2026 14:32   informes@litsea   enable_chat             aplicaciones    {therapist: 'María G.', employer: 'Grand Hyatt'}
13 may 2026 10:15   informes@litsea   verify_therapist        terapeutas      {therapist_id: 'uuid...'}
12 may 2026 09:00   informes@litsea   approve_opinion         opiniones       {opinion_id: 'uuid...', nombre: 'Carlos M.'}
```

### Empty state
```
No hay registros de auditoría.
Las acciones administrativas aparecerán aquí automáticamente.
```

### Implementación
Cada acción admin llama:
```typescript
// lib/audit.ts
export async function logAudit(
  adminId: string,
  action: string,
  module: string,
  recordId: string,
  details?: Record<string, unknown>
) {
  const supabase = createServiceClient()
  await supabase.from('audit_logs').insert({
    admin_id: adminId,
    action,
    module,
    record_id: recordId,
    details: details ?? {},
  })
}
```

---

## 10. Configuración `/admin/configuracion`

### Registro de usuarios
```
Registro de usuarios
Permitir nuevos registros en la plataforma

[Toggle ON/OFF]    ← lee/escribe settings('allow_registrations')
```

Si `allow_registrations = false`:
- Las rutas `/registro-terapeuta` y `/registro-empleador` muestran:
  "Los registros están temporalmente cerrados. Vuelve pronto."

### Textos del Home
```
Título principal
[________________________]   ← settings('home_title')

Subtítulo
[________________________]   ← settings('home_subtitle')

[Guardar configuración]
```

Al guardar:
- UPSERT en `settings` para ambas claves
- `updated_by = admin.id`, `updated_at = NOW()`
- logAudit('update_settings', 'configuracion', ...)
- El home re-lee estos valores en cada request (no cacheado, o ISR corto de 60s)

### Futuras opciones de configuración (pendientes)
- Cantidad máxima de vacantes por empleador
- Días de expiración de vacantes
- Mensaje de mantenimiento
- Redes sociales de Litsea

---

## Registro de un admin (proceso manual)

1. Ir a Supabase Dashboard → Authentication → Users → Add User
2. Ingresar email y contraseña
3. Marcar "Auto Confirm Email"
4. En SQL Editor:
```sql
INSERT INTO public.profiles (id, email, role, full_name)
SELECT id, email, 'admin'::user_role, 'Nombre del Admin'
FROM auth.users
WHERE email = 'admin@litseacc.edu.mx';
```
5. Verificar con:
```sql
SELECT id, email, role FROM public.profiles WHERE role = 'admin';
```

---

## Seguridad del panel admin

1. **Doble verificación de rol:**
   - `proxy.ts`: verifica que haya sesión activa
   - `AdminLoginClient`: verifica `role === 'admin'`, si no → signOut
   - `(dashboard)/layout.tsx`: lee el rol y se lo pasa al shell

2. **Todas las acciones admin** se registran en `audit_logs` — inmutable

3. **Service Role Key** solo en Server Actions y Route Handlers — nunca en cliente

4. **`/login/admin`** tiene `robots: noindex` — no indexable por buscadores
