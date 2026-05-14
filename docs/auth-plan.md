# Plan de Autenticación — Litsea Empleos
**Fecha:** 2026-05-13  
**Estado:** Planificación completa · Implementación paso a paso

---

## 1. Estado actual

| Archivo | Ruta | Estado |
|---|---|---|
| `LoginSelectorClient` | `/login` | ✅ Hecho — selector de rol |
| `LoginClient` variant=terapeuta | `/login/terapeuta` | ✅ Hecho |
| `LoginClient` variant=empleador | `/login/empleador` | ✅ Hecho |
| `RegisterTerapeutaClient` | `/registro-terapeuta` | ✅ Hecho |
| `RegisterEmpleadorClient` | `/registro-empleador` | ✅ Hecho (falla por env vars) |
| `ResetPasswordClient` | `/reset-password` | ✅ Hecho — compartido |
| `ResetPasswordConfirmClient` | `/reset-password/confirm` | ✅ Hecho — compartido |
| `LoginPageShell` | componente base | ✅ Hecho |
| `/login/admin` | Admin login | ❌ Falta |
| `/auth/callback` | Route Handler OAuth | ❌ Falta (existe en `/api/auth/callback`) |
| `middleware.ts` | Protección de rutas | ❌ Falta |
| Email confirmation page | Después de confirmar correo | ❌ Falta |

---

## 2. Arquitectura completa de rutas

```
app/[locale]/(auth)/
├── login/
│   ├── page.tsx              /login           → Selector: Terapeuta / Empleador
│   ├── terapeuta/page.tsx    /login/terapeuta → Login terapeuta
│   ├── empleador/page.tsx    /login/empleador → Login empleador
│   └── admin/page.tsx        /login/admin     → Login admin (oculto, solo desde footer)
├── registro-terapeuta/
│   └── page.tsx              /registro-terapeuta
├── registro-empleador/
│   └── page.tsx              /registro-empleador
└── reset-password/
    ├── page.tsx              /reset-password       → Solicitar enlace (compartido)
    └── confirm/page.tsx      /reset-password/confirm → Nueva contraseña (compartido)

app/[locale]/
└── auth-confirmado/page.tsx  /auth-confirmado → Pantalla post-confirmación de email

app/api/auth/
└── callback/route.ts         /api/auth/callback → OAuth + email confirm handler
```

---

## 3. Flujo por rol

### 3.1 Terapeuta

```
SIGNUP
  /registro-terapeuta
    → signUp({ data: { role: 'therapist', full_name } })
    → Supabase envía email de confirmación
    → Pantalla: "Revisa tu correo" ✅ (ya existe)
    → Usuario hace clic en enlace del email
    → /api/auth/callback?next=/auth-confirmado&role=therapist
    → /auth-confirmado → CTA: "Completa tu perfil" → /terapeuta/perfil

LOGIN
  /login → /login/terapeuta
    → signInWithPassword o Google OAuth
    → getRoleRedirect() lee profiles.role
    → Redirige a /terapeuta/dashboard

RESET PASSWORD
  /login/terapeuta → "¿Olvidaste tu contraseña?" → /reset-password
    → resetPasswordForEmail({ redirectTo: /api/auth/callback?next=/reset-password/confirm })
    → Usuario hace clic en enlace
    → /reset-password/confirm → actualiza contraseña
    → Redirige a /login/terapeuta
```

### 3.2 Empleador / Empresa

```
SIGNUP
  /registro-empleador
    → signUp({ data: { role: 'employer', full_name, company_name } })
    → Supabase envía email de confirmación
    → Pantalla: "Revisa tu correo" ✅
    → Usuario hace clic en enlace del email
    → /api/auth/callback?next=/auth-confirmado&role=employer
    → /auth-confirmado → CTA: "Ir a mi panel" → /empleador/dashboard

LOGIN
  /login → /login/empleador
    → signInWithPassword o Google OAuth
    → getRoleRedirect() → /empleador/dashboard

RESET PASSWORD
  Igual al terapeuta. Después de confirmar redirige a /login/empleador
```

### 3.3 Admin

```
SIGNUP
  Sin página pública. Cuentas creadas en Supabase dashboard.
  Trigger SQL asigna role: 'admin' manualmente.

LOGIN
  Footer → "Admin" → /login/admin
    → Solo email + password (sin Google, sin signup link)
    → signInWithPassword
    → Verifica que role === 'admin' en profiles (si no, error + signOut)
    → Redirige a /admin

RESET PASSWORD
  /login/admin → "¿Olvidaste tu contraseña?" → /reset-password?from=admin
    → Después de confirmar redirige a /login/admin
    → (misma página compartida, detecta el param ?from=admin para el back link)
```

---

## 4. Componentes a crear

### 4.1 `LoginClient` — agregar variant `admin`
```typescript
// Agregar a VARIANTS en LoginClient.tsx
admin: {
  title:        'Acceso administrativo',
  subtitle:     'Solo para el equipo Litsea',
  image:        '/ilustracion-bienestar-aprobacion-documentos-ui.png',
  imageAlt:     'Panel administrativo Litsea',
  registerHref: null,   // sin signup
  registerText: null,
  registerCta:  null,
  switchHref:   null,   // sin switch
  switchText:   null,
  switchCta:    null,
  googleOAuth:  false,  // sin Google
}
```

### 4.2 `app/[locale]/(auth)/login/admin/page.tsx`
```typescript
// Misma estructura que terapeuta/empleador
// variant="admin"
// metadata: robots noindex
```

### 4.3 `app/[locale]/auth-confirmado/page.tsx`
Pantalla post-confirmación. Detecta el rol del usuario (session) y muestra:
- Terapeuta: "¡Cuenta confirmada! Completa tu perfil para empezar." → CTA /terapeuta/perfil
- Empleador: "¡Cuenta confirmada! Ya puedes publicar vacantes." → CTA /empleador/dashboard
- Usa `LoginPageShell` para consistencia visual

### 4.4 `app/api/auth/callback/route.ts` — mejorar
```typescript
// Flujo actual: intercambia code por session, redirige a next o a dashboard por rol
// Mejorar:
//   1. Leer ?next= para post-confirmación y post-reset
//   2. Si no hay ?next=, leer role de profiles y redirigir al dashboard correcto
//   3. Manejar errores de OAuth (token inválido, usuario ya existe)
```

### 4.5 `middleware.ts`
```typescript
// Proteger /(dashboard)/** — redirige a /login si no hay sesión
// Proteger /admin/** — verifica role === 'admin', redirige a / si no
// Rutas públicas: /, /login/**, /registro-**, /reset-password/**, /vacantes, /terapeutas
```

---

## 5. Flujos de email (Supabase + Resend)

### 5.1 Emails gestionados por Supabase Auth (automáticos)

| Evento | Destinatario | Cuándo | Plantilla |
|---|---|---|---|
| Confirmación de cuenta | Usuario nuevo | Al registrarse | Supabase template (personalizable) |
| Reset de contraseña | Usuario registrado | Al solicitar reset | Supabase template (personalizable) |
| Cambio de email | Usuario autenticado | Al cambiar email | Supabase template |

**Configuración en Supabase Dashboard → Auth → Email Templates:**
- Personalizar URL de confirmación: `{{ .SiteURL }}/api/auth/callback?code={{ .TokenHash }}&type=email`
- Personalizar URL de reset: `{{ .SiteURL }}/api/auth/callback?code={{ .TokenHash }}&type=recovery`
- From: `empleos@litseacc.edu.mx`
- Reply-to: `empleos@litseacc.edu.mx`

### 5.2 Emails transaccionales con Resend (posteriores al auth)

| Evento | Destinatario | Cuándo disparar | Archivo |
|---|---|---|---|
| Bienvenida terapeuta | Terapeuta | Post-confirmación en /auth-confirmado | `emails/WelcomeEmail.tsx` |
| Bienvenida empleador | Empleador | Post-confirmación en /auth-confirmado | `emails/WelcomeEmail.tsx` |
| Nuevo registro | Admin | Al confirmar cuenta nueva | `emails/NewUserEmail.tsx` |

**Cuándo implementar Resend:** Fase 7 (después de tener los dashboards). Por ahora Supabase maneja la confirmación.

---

## 6. Configuración de Supabase requerida

### 6.1 Variables de entorno (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 6.2 Auth Settings (Supabase Dashboard → Auth → Settings)
- **Site URL:** `https://empleos.litseacc.edu.mx` (prod) / `http://localhost:3000` (dev)
- **Redirect URLs permitidas:**
  - `http://localhost:3000/api/auth/callback`
  - `https://empleos.litseacc.edu.mx/api/auth/callback`
- **Email confirmations:** ON (requerido)
- **Secure email change:** ON
- **Google OAuth:** Configurar Client ID + Secret en Auth → Providers

### 6.3 Trigger SQL (handle_new_user)
Ya definido en PRD-TECNICO.md. Insertar en `profiles` al registrarse.
Debe ejecutarse en Supabase SQL Editor antes de la primera prueba de registro.

### 6.4 RLS mínimo para auth
```sql
-- Lectura de rol propio (necesario para getRoleRedirect)
CREATE POLICY "user reads own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

---

## 7. Validaciones y estados de error

### Login (todos los roles)
| Error | Mensaje al usuario |
|---|---|
| Credenciales incorrectas | "Correo o contraseña incorrectos." |
| Email no confirmado | "Debes confirmar tu correo antes de ingresar. Revisa tu bandeja de entrada." |
| Rol incorrecto (admin ingresa en /login/terapeuta) | Redirige al dashboard correcto según rol, no muestra error |
| Rol incorrecto (terapeuta intenta /login/admin) | "No tienes permisos de administrador." + signOut |
| Google OAuth cancelado | Vuelve al formulario sin error (usuario canceló) |

### Signup
| Error | Mensaje al usuario |
|---|---|
| Email ya registrado | "Este correo ya tiene una cuenta. Inicia sesión." |
| Contraseña < 8 chars | "La contraseña debe tener al menos 8 caracteres." |
| Contraseñas no coinciden | "Las contraseñas no coinciden." |
| Error de red | "Error al crear la cuenta. Intenta de nuevo." |

### Reset password
| Error | Mensaje |
|---|---|
| Email no registrado | Supabase no revela si existe (seguridad). Mostrar siempre: "Si ese correo existe, recibirás un enlace." |
| Token expirado (en /confirm) | "El enlace expiró. Solicita uno nuevo." + botón volver |

---

## 8. Orden de implementación paso a paso

### Paso 1 — Configuración de entorno (bloqueante)
- [ ] Crear `.env.local` con variables de Supabase
- [ ] Aplicar `schema.sql` y trigger `handle_new_user()` en Supabase
- [ ] Configurar Redirect URLs en Supabase Auth Settings
- [ ] Verificar que `/registro-terapeuta` funciona sin errores

### Paso 2 — Mejorar `/api/auth/callback`
- [ ] Leer `?next=` param para post-confirmación
- [ ] Leer `?type=` (email, recovery) para manejar reset vs confirmación
- [ ] Leer rol de `profiles` y redirigir al dashboard correcto
- [ ] Manejar errores (token inválido → /login con mensaje)

### Paso 3 — Página de confirmación `/auth-confirmado`
- [ ] Crear `app/[locale]/auth-confirmado/page.tsx`
- [ ] Leer sesión activa y detectar rol
- [ ] Mostrar mensaje de bienvenida + CTA según rol
- [ ] Usar `LoginPageShell` para consistencia visual

### Paso 4 — Admin login `/login/admin`
- [ ] Agregar variant `admin` a `VARIANTS` en `LoginClient.tsx`
  - Sin Google OAuth
  - Sin links de signup
  - Verificación extra: si role !== 'admin', signOut + error
- [ ] Crear `app/[locale]/(auth)/login/admin/page.tsx`
- [ ] Actualizar link del footer: `/login/admin` (ya era `/login?role=admin`, corregir a ruta real)

### Paso 5 — Mejora del reset password
- [ ] Detectar `?from=terapeuta|empleador|admin` para personalizar el back link
- [ ] Post-confirm: redirigir al login correcto según de dónde vino
- [ ] Mejorar `ResetPasswordConfirmClient`: manejar token expirado con mensaje claro

### Paso 6 — Middleware de protección
- [ ] Crear `middleware.ts` en la raíz
- [ ] Proteger `/(dashboard)/**` → redirige a `/login` si no hay sesión
- [ ] Proteger `/admin/**` → verifica role=admin, redirige a `/` si no
- [ ] Excluir rutas públicas y de auth del middleware

### Paso 7 — Emails (Resend) — posterior a los dashboards
- [ ] Instalar `resend` + `@react-email/components`
- [ ] Crear `WelcomeEmail.tsx` (terapeuta + empleador variants)
- [ ] Disparar desde `/auth-confirmado` (Server Action o API route)
- [ ] Personalizar templates en Supabase Auth (branding Litsea)

---

## 9. Decisiones tomadas

| Decisión | Resolución |
|---|---|
| ¿Un login o tres? | Tres páginas separadas + selector en /login |
| ¿Admin se registra solo? | No. Solo via Supabase dashboard |
| ¿Google OAuth para admin? | No. Solo email + password |
| ¿Reset compartido o separado? | Compartido, detecta origen via query param |
| ¿Email confirm requerido? | Sí, para terapeuta y empleador. Admin no (creado manualmente) |
| ¿Rol en redirect? | getRoleRedirect() lee profiles.role después del login |

---

## 10. Archivos a tocar en cada paso

```
Paso 1: .env.local, Supabase SQL editor
Paso 2: app/api/auth/callback/route.ts
Paso 3: app/[locale]/auth-confirmado/page.tsx (NUEVO)
Paso 4: components/login/LoginClient.tsx
        app/[locale]/(auth)/login/admin/page.tsx (NUEVO)
        components/layout/Footer.tsx (fix link /login/admin)
Paso 5: components/login/ResetPasswordClient.tsx
        components/login/ResetPasswordConfirmClient.tsx
Paso 6: middleware.ts (NUEVO en raíz)
Paso 7: lib/email.ts (NUEVO)
        emails/WelcomeEmail.tsx (NUEVO)
        app/api/email/route.ts (NUEVO)
```
