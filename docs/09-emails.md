# 09 · Sistema de Emails
**Dos capas:** Supabase Auth (automático) + Resend (transaccional)

---

## Capa 1: Supabase Auth (emails de autenticación)

Supabase gestiona automáticamente los emails relacionados con el proceso de auth. Se personalizan en el Dashboard de Supabase.

### Emails que maneja Supabase

| Evento | Cuándo se dispara | Template |
|---|---|---|
| Confirmación de cuenta | Al registrarse | `confirm.html` |
| Reset de contraseña | Al solicitar reset | `reset.html` |
| Cambio de email | Al cambiar email en configuración | `security/password.html` |
| Invitación | Admin invita a un usuario | `invite.html` |

### Configuración (Dashboard → Auth → Email Templates)

**From:** `empleos@litseacc.edu.mx`  
**Reply-to:** `empleos@litseacc.edu.mx`

**URL de confirmación (en el template):**
```
{{ .SiteURL }}/api/auth/callback?code={{ .TokenHash }}&type=email
```

**URL de reset (en el template):**
```
{{ .SiteURL }}/api/auth/callback?code={{ .TokenHash }}&type=recovery
```

### Templates HTML (en `public/tamplates/`)

Los templates tienen branding Litsea completo:
- `confirm.html` — "Confirma tu cuenta en Litsea Empleos"
- `confirma.html` — variante (mismo propósito, distinto diseño)
- `reset.html` — "Restablece tu contraseña"
- `invite.html` — "Invitación a Litsea Empleos"
- `security/password.html` — "Cambio de contraseña"

**Estructura visual de los templates:**
```
[Logo Litsea]
────────────────────────────────────

Asunto: "Confirma tu cuenta en Litsea Empleos"

Hola {nombre},

Gracias por registrarte en Litsea Empleos.
Para activar tu cuenta, confirma tu correo:

[Confirmar mi cuenta]    ← botón #2FB7A3

Si no creaste esta cuenta, ignora este mensaje.

────────────────────────────────────
Litsea Centro de Capacitación
Riviera Maya, Quintana Roo, México
empleos@litseacc.edu.mx
```

### SMTP personalizado para usar `empleos@litseacc.edu.mx`

Opción A — Resend como SMTP:
```
Host:     smtp.resend.com
Port:     587
User:     resend
Password: [RESEND_API_KEY]
From:     empleos@litseacc.edu.mx
```

Opción B — SMTP del hosting de `litseacc.edu.mx`.

---

## Capa 2: Resend (emails transaccionales)

Resend se usa para los emails que **no** maneja Supabase — notificaciones del negocio.

**Variables de entorno requeridas:**
```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=empleos@litseacc.edu.mx
```

**Paquetes:**
```bash
npm install resend @react-email/components
```

---

### Todos los emails transaccionales

#### 1. Bienvenida — Terapeuta
**Trigger:** Cuando el terapeuta confirma su email (se dispara en `/api/auth/callback`)  
**Destinatario:** Terapeuta nuevo  
**Template:** `emails/WelcomeTherapistEmail.tsx`

```
Asunto: ¡Bienvenido/a a Litsea Empleos, {nombre}!

[Logo Litsea]

¡Hola, {nombre}!

Tu cuenta de terapeuta en Litsea Empleos está activa.
El siguiente paso es completar tu perfil profesional.

[Completar mi perfil →]

Qué puedes hacer:
✓ Subir tu foto profesional
✓ Agregar tus especialidades
✓ Subir tus certificados Litsea
✓ Aplicar a vacantes en hoteles y spas de lujo

¿Tienes dudas? Escríbenos por WhatsApp o responde este correo.

[Logo]  empleos@litseacc.edu.mx
```

#### 2. Bienvenida — Empleador
**Trigger:** Al confirmar email del empleador  
**Destinatario:** Empleador nuevo  
**Template:** `emails/WelcomeEmployerEmail.tsx`

```
Asunto: ¡Bienvenido a Litsea Empleos, {company_name}!

¡Hola!

Tu cuenta de empleador para {company_name} está activa.

[Publicar primera vacante →]

Qué puedes hacer:
✓ Publicar vacantes de terapeutas
✓ Recibir candidatos verificados
✓ Chatear con candidatos seleccionados

[Logo]  empleos@litseacc.edu.mx
```

#### 3. Nueva aplicación → Admin
**Trigger:** Cuando un terapeuta aplica a una vacante  
**Destinatario:** `empleos@litseacc.edu.mx` (equipo Litsea)  
**Template:** `emails/NewApplicationEmail.tsx`

```
Asunto: Nueva aplicación — {vacante_titulo}

Nueva aplicación recibida:

Terapeuta: {nombre_terapeuta}
Vacante:   {vacante_titulo}
Empresa:   {company_name}
Fecha:     {fecha}

[Ver en el panel →]           → /admin/aplicaciones?id={applicationId}
```

#### 4. Chat habilitado → Terapeuta
**Trigger:** Admin cambia status a `chat_enabled`  
**Destinatario:** Terapeuta  
**Template:** `emails/ChatEnabledTherapistEmail.tsx`

```
Asunto: ¡El empleador quiere contactarte!

Hola {nombre},

¡Buenas noticias! El equipo Litsea habilitó el chat con:

{company_name}
Vacante: {vacante_titulo}

[Ir al chat →]               → /terapeuta/mensajes

Este contacto fue habilitado y supervisado por el equipo Litsea.
```

#### 5. Chat habilitado → Empleador
**Trigger:** Admin cambia status a `chat_enabled`  
**Destinatario:** Empleador  
**Template:** `emails/ChatEnabledEmployerEmail.tsx`

```
Asunto: Chat habilitado con terapeuta

Hola,

El equipo Litsea habilitó el chat con:

{nombre_terapeuta}
Especialidad: {especialidad}

[Ir al chat →]               → /empleador/mensajes

Revisa el perfil del candidato antes de chatear.
```

#### 6. Cambio de estado de aplicación → Terapeuta
**Trigger:** Admin cambia status (a cualquiera)  
**Destinatario:** Terapeuta  
**Template:** `emails/ApplicationStatusEmail.tsx`

```
Asunto: Actualización sobre tu aplicación

Hola {nombre},

Tu aplicación para "{vacante_titulo}" en {company_name}
ha sido actualizada:

Estado: [EN REVISIÓN]     ← badge con color según estado

[Ver mis aplicaciones →]
```

---

## Implementación técnica

### `lib/email.ts`

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'empleos@litseacc.edu.mx'

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[]
  subject: string
  react: React.ReactElement
}) {
  try {
    const { error } = await resend.emails.send({
      from: `Litsea Empleos <${FROM}>`,
      to,
      subject,
      react,
    })
    if (error) console.error('Resend error:', error)
  } catch (err) {
    console.error('Email send failed:', err)
    // No lanzar — un email fallido no debe romper el flujo principal
  }
}
```

### `app/api/email/route.ts`

Para los emails que se disparan desde el cliente (si aplica):

```typescript
export async function POST(request: Request) {
  // Verificar que el request es interno (CRON_SECRET o auth)
  const { type, data } = await request.json()

  switch (type) {
    case 'welcome_therapist':
      await sendEmail({ to: data.email, subject: '...', react: <WelcomeTherapistEmail {...data} /> })
      break
    case 'new_application':
      await sendEmail({ to: FROM, subject: '...', react: <NewApplicationEmail {...data} /> })
      break
    // etc.
  }

  return Response.json({ ok: true })
}
```

### Cuándo disparar cada email

| Email | Dónde se dispara |
|---|---|
| Bienvenida terapeuta | `app/api/auth/callback/route.ts` — después de confirmar email |
| Bienvenida empleador | `app/api/auth/callback/route.ts` — después de confirmar email |
| Nueva aplicación | `app/api/aplicaciones/route.ts` — al crear aplicación |
| Chat habilitado (ambos) | `app/api/aplicaciones/[id]/route.ts` — al cambiar a `chat_enabled` |
| Cambio de estado | `app/api/aplicaciones/[id]/route.ts` — al cambiar cualquier status |

---

## Templates con React Email

Estructura de un template:

```tsx
// emails/WelcomeTherapistEmail.tsx
import { Html, Head, Body, Container, Img, Text, Button } from '@react-email/components'

interface WelcomeTherapistEmailProps {
  nombre: string
  email: string
}

export default function WelcomeTherapistEmail({ nombre, email }: WelcomeTherapistEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Body style={{ backgroundColor: '#FAF9F5', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', backgroundColor: '#ffffff' }}>
          <Img
            src="https://empleos.litseacc.edu.mx/logo-litsea-principal-color.png"
            width={120}
            alt="Litsea Empleos"
          />
          <Text>¡Hola, {nombre}!</Text>
          <Text>Tu cuenta de terapeuta está activa.</Text>
          <Button href="https://empleos.litseacc.edu.mx/terapeuta/perfil"
            style={{ backgroundColor: '#2FB7A3', color: '#fff' }}>
            Completar mi perfil
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
```

---

## Preview de emails en desarrollo

```bash
npx email dev
```

Abre un servidor local en `http://localhost:3000` que renderiza los templates de React Email con datos de prueba.

---

## Manejo de errores

- Los emails **nunca deben bloquear el flujo principal** de la app
- Si Resend falla: loggear el error en consola, continuar sin lanzar excepción
- Implementar retry básico (1 reintento) para emails críticos (bienvenida, chat habilitado)
- Para producción: considerar usar Supabase Edge Functions como fallback

---

## Estado actual

| Email | Template | Integración | Estado |
|---|---|---|---|
| Confirmación de cuenta | Supabase template (`confirm.html`) | Automático Supabase | ✅ Template listo |
| Reset de contraseña | Supabase template (`reset.html`) | Automático Supabase | ✅ Template listo |
| Bienvenida terapeuta | `WelcomeTherapistEmail.tsx` | callback route.ts | 🔲 Pendiente |
| Bienvenida empleador | `WelcomeEmployerEmail.tsx` | callback route.ts | 🔲 Pendiente |
| Nueva aplicación (admin) | `NewApplicationEmail.tsx` | aplicaciones route.ts | 🔲 Pendiente |
| Chat habilitado terapeuta | `ChatEnabledTherapistEmail.tsx` | aplicaciones/[id] route.ts | 🔲 Pendiente |
| Chat habilitado empleador | `ChatEnabledEmployerEmail.tsx` | aplicaciones/[id] route.ts | 🔲 Pendiente |
| Cambio de estado | `ApplicationStatusEmail.tsx` | aplicaciones/[id] route.ts | 🔲 Pendiente |
