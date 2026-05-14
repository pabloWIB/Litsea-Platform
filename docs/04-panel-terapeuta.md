# 04 · Panel del Terapeuta
**Rol:** `therapist`  
**Ruta base:** `/terapeuta/*`  
**Acceso:** Requiere sesión con `role='therapist'`  
**Layout:** `DashboardShell` — Sidebar izquierdo + Header + contenido en `#FAF9F5`

---

## Navegación del sidebar (terapeuta)

```
[Logo Litsea]   Litsea Empleos

Dashboard          /terapeuta/dashboard
─── Mi cuenta ───
Mi perfil          /terapeuta/perfil
─── Trabajo ───
Vacantes disponibles /terapeuta/vacantes
Mis aplicaciones   /terapeuta/aplicaciones
Mensajes           /terapeuta/mensajes
─── (footer) ───
Configuración      /terapeuta/configuracion
[Avatar/email]
Cerrar sesión
```

**Desktop:** colapsa a 58px (solo íconos) al perder hover. Expande a 220px al hacer hover.  
**Mobile:** topnav full-width — logo izquierda, burger derecha → drawer desde la izquierda.

---

## 1. Dashboard `/terapeuta/dashboard`

### Propósito
Primera pantalla que ve el terapeuta al iniciar sesión. Resume su estado en la plataforma y lo motiva a completar su perfil si está incompleto.

### Header
```
¡Bienvenido/a, {full_name}!
Completa tu perfil profesional para que los empleadores puedan encontrarte.
```
Si el perfil está al 100%:
```
¡Bienvenido/a, {full_name}!
Tu perfil está completo. Los empleadores pueden encontrarte.
```

### Métricas (3 cards)

**Card 1 — Vacantes disponibles**
- Valor: `COUNT(vacancies WHERE is_active = true)`
- Ícono: Briefcase
- Color accent: `#2FB7A3`
- CTA: "Ver vacantes" → `/terapeuta/vacantes`

**Card 2 — Perfil completado**
- Valor: `X%` (calculado dinámicamente)
- Cálculo:
  ```
  4 campos totales:
  1. specialties (therapist_profiles.specialties) — ¿tiene al menos una?
  2. zones (therapist_profiles.zones) — ¿tiene al menos una?
  3. avatar_url (profiles.avatar_url) — ¿existe?
  4. certificados — ¿hay al menos 1 en certificates?
  ```
- Muestra barra de progreso visual
- Si < 100%: badge "No visible para empleadores"

**Card 3 — Mensajes nuevos**
- Valor: `COUNT(messages WHERE read_at IS NULL AND conversation.therapist_id = auth.uid())`
- Ícono: MessageCircle
- CTA: "Ver mensajes" → `/terapeuta/mensajes`

### Alerta de perfil incompleto
Si `perfil < 100%`:
```
⚠ No visible para empleadores
Completa tu perfil para que los hoteles puedan encontrarte.
[Completar mi perfil →]
```

### Progreso del perfil (checklist)
```
Progreso del perfil
[████░░░░] 25%

☑ Especialidad seleccionada    ← verde si completado
☐ Zonas de trabajo
☐ Foto profesional
☐ Certificados subidos

[Completar mi perfil]          → /terapeuta/perfil
```

### Datos que se cargan
```typescript
// Server Component
const { data: profile } = await supabase
  .from('profiles')
  .select('full_name, avatar_url')
  .eq('id', user.id)
  .single()

const { data: therapistProfile } = await supabase
  .from('therapist_profiles')
  .select('specialties, zones')
  .eq('user_id', user.id)
  .single()

const { count: certsCount } = await supabase
  .from('certificates')
  .select('*', { count: 'exact', head: true })
  .eq('therapist_id', therapistProfile.id)

const { count: vacantesCount } = await supabase
  .from('vacancies')
  .select('*', { count: 'exact', head: true })
  .eq('is_active', true)

const { count: unreadMessages } = await supabase
  .from('messages')
  .select('*', { count: 'exact', head: true })
  .is('read_at', null)
  // filtro por conversaciones del terapeuta
```

---

## 2. Mi Perfil `/terapeuta/perfil` — Wizard 4 pasos

### Propósito
Formulario dividido en 4 pasos para guiar al terapeuta a completar su perfil profesional. El progreso se guarda en DB al avanzar cada paso.

### Indicador de progreso
```
[Paso 1 de 4: Información básica]          25%
[████░░░░░░░░░░░░] ─────────────────────────
```

---

### Paso 1 de 4 — Foto y especialidad (25%)

**Foto profesional**
- Botón "Subir foto" → file picker → acepta JPG, PNG, WebP (max 5MB)
- Preview circular de la foto seleccionada
- Sube a Supabase Storage bucket `avatars`, ruta: `{user_id}/avatar.{ext}`
- Actualiza `profiles.avatar_url`

**Especialidad** (requerido)
- Select dropdown: 
  - Masoterapia Sueca
  - Reflexología
  - Aromaterapia
  - Masaje con Piedras Calientes
  - Drenaje Linfático
  - Faciales y Tratamientos
  - Manicura y Pedicura
  - Hidroterapia
  - Reiki
  - Otra
- Guarda en `therapist_profiles.specialties[0]`

**Checkbox: "Egresado de Litsea Centro de Capacitación"**
- Marca `therapist_profiles.is_litsea_grad = true`
- No verifica automáticamente — admin debe validar manualmente

**Botones:**
- "Volver" → deshabilitado en paso 1
- "Continuar" → guarda y avanza al paso 2

---

### Paso 2 de 4 — Zonas de trabajo (50%)

**Selector múltiple de zonas**
- Chips/tags seleccionables (múltiple):
  - Cancún
  - Playa del Carmen
  - Tulum
  - Cozumel
  - Holbox
  - Puerto Morelos
  - Bacalar
  - Mérida
  - Otra
- Guarda en `therapist_profiles.zones[]`

**Botones:**
- "Volver" → paso 1
- "Continuar" → guarda y avanza al paso 3

---

### Paso 3 de 4 — Bio y experiencia (75%)

**Biografía profesional**
- Textarea (max 500 caracteres)
- Contador de caracteres en tiempo real
- Placeholder: "Describe tu experiencia, técnicas dominadas y lo que te hace destacar como terapeuta..."
- Guarda en `therapist_profiles.bio`

**Años de experiencia**
- Input número (0-50)
- Guarda en `therapist_profiles.experience_years`

**Botones:**
- "Volver" → paso 2
- "Continuar" → guarda y avanza al paso 4

---

### Paso 4 de 4 — Revisión (100%)

**Preview del perfil completo:**
```
[Foto circular]  Nombre completo
                 Especialidad · {X} años de experiencia
                 📍 {zonas separadas por coma}
                 
[Bio completa]

[Egresado Litsea ✓]
```

**Botones:**
- "Volver" → paso 3
- "Guardar perfil" → hace PATCH en DB + redirige a `/terapeuta/dashboard`

**Tras guardar:**
- Perfil marcado como "pendiente de revisión" por admin
- `therapist_profiles.is_verified` sigue en `false` hasta aprobación del admin
- Mensaje: "Tu perfil está completo. El equipo Litsea lo revisará pronto."

---

## 3. Vacantes disponibles `/terapeuta/vacantes`

### Propósito
Listado de todas las vacantes activas. El terapeuta puede filtrar y aplicar directamente.

### Header
```
Vacantes disponibles
Explora oportunidades en hoteles y spas de la Riviera Maya.
```

### Filtros
Tabs/chips superiores:
- **Todas** (default)
- Por zona: Cancún · PDC · Tulum · etc.
- Por especialidad: Masoterapia · Reflexología · etc.
- Por contrato: Tiempo completo · Por temporada · Freelance

Implementación: URL params `?zona=cancun&especialidad=masoterapia&contrato=completo`

### Tarjeta de vacante
```
[Logo empleador]  Grand Hyatt Cancún
Terapeuta de Masajes Sueco
📍 Cancún, Quintana Roo  |  ⏱ Tiempo completo
Especialidades: Masaje Sueco · Reflexología
Publicada hace 3 días

[Ver detalles]  [Aplicar ahora]
```

"Aplicar ahora" → si terapeuta no tiene sesión → redirect login. Si tiene sesión → POST `/api/aplicaciones` → crea application con `status='new'`

### Empty state
```
No hay vacantes disponibles.
Intenta cambiar los filtros o vuelve más tarde.
```

### Query
```typescript
const { data: vacantes } = await supabase
  .from('vacancies')
  .select(`
    *,
    employer_profiles (company_name, logo_url, slug)
  `)
  .eq('is_active', true)
  .order('created_at', { ascending: false })
```

---

## 4. Mis Aplicaciones `/terapeuta/aplicaciones`

### Propósito
Historial de todas las postulaciones del terapeuta con su estado actual.

### Header
```
Mis aplicaciones
Revisa el estado de tus postulaciones.
```

### Tarjeta de aplicación
```
[Logo empleador]  Grand Hyatt Cancún
Terapeuta de Masajes Sueco
Aplicada el 10 de mayo, 2026

Estado: [EN REVISIÓN]           ← badge de color según estado
```

**Colores de badge por estado:**
| Estado | Color | Texto |
|---|---|---|
| `new` | Gris | Nueva |
| `reviewing` | Azul | En revisión |
| `chat_enabled` | Verde | Chat habilitado |
| `hired` | Verde oscuro | Contratado ✓ |
| `rejected` | Rojo | No seleccionado |

Si estado es `chat_enabled` → mostrar botón "Ir al chat" → `/terapeuta/mensajes?conv={conversationId}`

### Empty state
```
Aún no has aplicado a ninguna vacante.
[Ver vacantes disponibles →]
```

---

## 5. Mensajes `/terapeuta/mensajes`

### Propósito
Chat en tiempo real con empleadores. Solo muestra conversaciones habilitadas por el admin (`conversations.is_active = true`).

### Layout
Dos columnas en desktop, vista única en mobile:
- **Columna izquierda:** lista de conversaciones
- **Columna derecha:** mensajes de la conversación seleccionada

### Lista de conversaciones
Por cada conversación activa:
```
[Logo empleador]  Grand Hyatt Cancún
Vacante: Terapeuta de Masajes
Último mensaje: "Nos gustaría agend..."  hace 2h
[● 3]  ← badge de mensajes no leídos
```

### Ventana de chat
```
─────────────────────────────────────
Grand Hyatt Cancún · Terapeuta de Masajes
Chat habilitado por Litsea ⓘ
─────────────────────────────────────
[Employer]  Hola María, nos gustaría conocerte. ¿Tienes disponibilidad esta semana?
                                                            [Tú]  Sí, ¿qué días?
─────────────────────────────────────
[___________________________] [Enviar →]
```

### Implementación Realtime
```typescript
// Suscripción a nuevos mensajes
supabase
  .channel(`messages:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => {
    setMessages(prev => [...prev, payload.new])
    markAsRead(payload.new.id)
  })
  .subscribe()
```

### Marcar como leído
Al abrir una conversación: `UPDATE messages SET read_at = NOW() WHERE conversation_id = X AND read_at IS NULL AND sender_id != auth.uid()`

### Empty state (sin conversaciones)
```
No tienes conversaciones activas.
Las conversaciones aparecen cuando Litsea habilita el chat
con un empleador interesado en tu perfil.
```

---

## 6. Configuración `/terapeuta/configuracion`

### Secciones

**Seguridad**
- Cambiar contraseña: campo nueva contraseña + confirmar → `supabase.auth.updateUser({ password })`
- Cambiar email: nuevo email → `supabase.auth.updateUser({ email })` → Supabase envía confirmación

**Notificaciones** (toggle switches)
- Email cuando hay nueva vacante compatible con mi perfil
- Email cuando un empleador ve mi perfil
- Email cuando se habilita chat

**Cuenta**
- "Eliminar mi cuenta" → confirmar con modal → `supabase.auth.admin.deleteUser()` via service_role → cascade delete en DB

---

## Notas de implementación

### Visibilidad del terapeuta
Un terapeuta solo aparece en búsquedas de empleadores si:
1. `therapist_profiles.is_verified = true` (admin lo verificó)
2. `profiles.is_active = true` (no suspendido)

Hasta que el admin verifique, el terapeuta puede usar el panel pero no es visible.

### Perfil incompleto
El sistema calcula el porcentaje en tiempo real. No existe un campo `completion_percentage` en DB — se calcula siempre que se necesite.

### Slug del terapeuta
El `slug` se genera al guardar el perfil completo:
```typescript
slug = `${full_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${nanoid(4)}`
// Ejemplo: 'maria-garcia-lopez-x4k2'
```
