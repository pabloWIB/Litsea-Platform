# 03 · Autenticación — Flujos completos
**Proveedor:** Supabase Auth  
**Métodos:** Email + password · Google OAuth  
**Estado:** UI completa ✅ — Supabase pendiente de configurar

---

## Arquitectura de rutas auth

```
app/[locale]/(auth)/
├── login/
│   ├── page.tsx              → redirige a /login/terapeuta
│   ├── terapeuta/page.tsx    → LoginClient variant="terapeuta"
│   ├── empleador/page.tsx    → LoginClient variant="empleador"
│   └── admin/page.tsx        → AdminLoginClient
├── registro-terapeuta/page.tsx
├── registro-empleador/page.tsx
└── reset-password/
    ├── page.tsx              → ResetPasswordClient
    └── confirm/page.tsx      → ResetPasswordConfirmClient

app/api/auth/
├── callback/route.ts         → Maneja OAuth redirect + email confirm
└── signout/route.ts          → POST → supabase.auth.signOut()
```

El grupo `(auth)` no tiene layout propio — hereda del `[locale]/layout.tsx` pero `TopBar` suprime banner y navbar para todas las rutas que empiezan con `/login`, `/registro-*`, `/reset-password`.

---

## Componente base: `LoginPageShell`

Todas las páginas de auth comparten este shell. Layout de dos paneles:

**Panel izquierdo (32%):** formulario  
**Panel derecho (68%):** imagen fija (`fondo-login-litsea-centro-capacitacion-bienestar.webp`)

Elementos del shell:
- Locale pill (ES 🇲🇽 / EN / FR) — top right
- Back button → "/" — top left
- Copyright — bottom
- Imagen con overlay oscuro y texto descriptivo

---

## Flujo 1: Login Terapeuta

### Ruta: `/login/terapeuta`
**Componente:** `LoginClient` con `variant="terapeuta"`

### UI
```
[Eyebrow] Terapeuta
[Title]   Bienvenido
[Subtitle] Accede a tu panel y gestiona tus aplicaciones

[Botón Google] Continuar con Google
[Divisor]  ─── o ───
[Input]    Correo electrónico
[Input]    Contraseña (con ojo mostrar/ocultar)
[Link]     ¿Olvidaste tu contraseña?
[Botón]    Ingresar

[Texto]    ¿Aún no tienes cuenta? [Crea tu perfil gratis →]
[Texto]    ¿Representas un hotel o spa? [Ingresar como empresa →]
```

### Proceso email + password
1. Usuario llena email + contraseña → clic "Ingresar"
2. `supabase.auth.signInWithPassword({ email, password })`
3. Si error `Invalid login credentials` → mostrar `auth.errorSignIn`
4. Si éxito → leer `profiles.role` desde DB
5. Según rol, redirigir:
   - `therapist` → `/terapeuta/dashboard`
   - `employer` → `/empleador/dashboard`
   - `admin` → `/admin`

### Proceso Google OAuth
1. Usuario clic "Continuar con Google"
2. `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/api/auth/callback' } })`
3. Google muestra pantalla de consentimiento
4. Google redirige a `/api/auth/callback?code=...`
5. Callback intercambia code por session
6. Lee `profiles.role` → redirige al dashboard

### Errores manejados
| Situación | Mensaje mostrado |
|---|---|
| Credenciales incorrectas | "Correo o contraseña incorrectos." |
| Email no confirmado | "Debes confirmar tu correo antes de ingresar." |
| Error de red | "Error al iniciar sesión. Intenta de nuevo." |
| Google cancelado | Sin error (usuario canceló) |

---

## Flujo 2: Login Empleador

### Ruta: `/login/empleador`
**Componente:** `LoginClient` con `variant="empleador"`

Idéntico al login de terapeuta pero con:
- Eyebrow: "Empleador"
- Switch link apunta a `/login/terapeuta`
- Register link apunta a `/registro-empleador`
- Tras login, redirige a `/empleador/dashboard`

---

## Flujo 3: Login Admin

### Ruta: `/login/admin`
**Componente:** `AdminLoginClient`

**Acceso:** Link oculto en el Footer → "Admin"  
**Indexación:** `robots: noindex` — no aparece en Google

### UI
```
[Eyebrow]  Administrador
[Title]    Acceso interno
[Subtitle] Solo para el equipo Litsea

[Input]    Correo electrónico
[Input]    Contraseña
[Botón]    Ingresar

Sin Google OAuth
Sin link de registro
Sin selector de idioma
```

### Proceso
1. `signInWithPassword({ email, password })`
2. Si éxito → leer `profiles.role`
3. Si `role !== 'admin'`:
   - `supabase.auth.signOut()` inmediato
   - Mostrar error: "Esta cuenta no tiene permisos de administrador."
4. Si `role === 'admin'` → redirigir a `/admin`

### Importante
El admin NO puede crear su propia cuenta. Las cuentas admin se crean manualmente:
1. En Supabase Dashboard → Authentication → Users → Create User
2. Luego en SQL Editor:
```sql
INSERT INTO public.profiles (id, email, role, full_name)
SELECT id, email, 'admin'::user_role, 'Nombre Admin'
FROM auth.users
WHERE email = 'admin@litseacc.edu.mx';
```

---

## Flujo 4: Registro Terapeuta

### Ruta: `/registro-terapeuta`
**Componente:** `RegisterTerapeutaClient`

### UI
```
[Eyebrow]  Terapeuta
[Title]    Crear cuenta
[Subtitle] Crea tu perfil y accede a vacantes en spas y hoteles de lujo

[Botón Google] Registrarse con Google
[Divisor]  ─── o ───
[Input]    Nombre completo *
[Input]    Correo electrónico *
[Input]    Contraseña * (con strength bar)
           → Muy corta / Débil / Regular / Fuerte
[Botón]    Crear cuenta de terapeuta

[Texto]    ¿Representas un hotel o spa? [Regístrate aquí →]
```

### Proceso email + password
1. Validación client-side:
   - Nombre: requerido
   - Email: formato válido
   - Contraseña: mínimo 8 caracteres
2. `supabase.auth.signUp({ email, password, options: { data: { role: 'therapist', full_name } } })`
3. Trigger `handle_new_user` crea:
   - `profiles` con `role='therapist'`, `full_name`
   - `therapist_profiles` vacío
4. Supabase envía email de confirmación al usuario
5. Mostrar pantalla: "¡Revisa tu correo! Enviamos un enlace de confirmación a {email}."

### Proceso Google OAuth (registro)
1. `signInWithOAuth({ provider: 'google', options: { redirectTo: '/api/auth/callback' } })`
2. Google redirige a callback
3. Si es usuario nuevo: trigger crea profiles con `role='therapist'` (por defecto)
4. Redirige a `/terapeuta/dashboard`

### Errores
| Situación | Mensaje |
|---|---|
| Email ya registrado | "Este correo ya tiene una cuenta. Inicia sesión." |
| Contraseña < 8 chars | "La contraseña debe tener al menos 8 caracteres." |
| Error de red | "Error al crear la cuenta. Intenta de nuevo." |

---

## Flujo 5: Registro Empleador

### Ruta: `/registro-empleador`
**Componente:** `RegisterEmpleadorClient`

### UI
```
[Eyebrow]  Empleador
[Title]    Crear cuenta
[Subtitle] Publica vacantes y conecta con terapeutas certificados

[Botón Google] Registrarse con Google
[Divisor]  ─── o ───
[Input]    Hotel / Spa * (company_name)
[Input]    Correo electrónico *
[Input]    Contraseña *
[Botón]    Crear cuenta de empleador

[Texto]    ¿Eres terapeuta? [Regístrate aquí →]
```

### Proceso
1. `signUp({ email, password, options: { data: { role: 'employer', full_name: company_name, company_name } } })`
2. Trigger crea:
   - `profiles` con `role='employer'`
   - `employer_profiles` con `company_name`
3. Email de confirmación
4. Pantalla "Revisa tu correo"

---

## Flujo 6: Confirmación de email

### Ruta handler: `/api/auth/callback`

Cuando el usuario hace clic en el link del email de confirmación, Supabase redirige a:
```
/api/auth/callback?code=XXXX&type=email
```

### Proceso en `route.ts`
1. Leer `code` y `type` de los query params
2. `supabase.auth.exchangeCodeForSession(code)`
3. Si tipo es `email` (confirmación de cuenta):
   - Leer `?next=` param (si existe)
   - Si no hay `next`: leer `profiles.role` → redirigir a dashboard correspondiente
4. Si tipo es `recovery` (reset de contraseña):
   - Redirigir a `/reset-password/confirm`
5. Si error (token inválido, expirado):
   - Redirigir a `/login` con mensaje de error en query params

### Templates de email (Supabase Dashboard → Auth → Email Templates)
Los templates HTML están en `public/tamplates/`:
- `confirm.html` — confirmación de cuenta (ES)
- `confirma.html` — confirmación de cuenta (variante)
- `reset.html` — recuperación de contraseña
- `invite.html` — invitación
- `security/password.html` — cambio de contraseña de seguridad

**Configuración requerida:**
- From: `empleos@litseacc.edu.mx`
- Reply-to: `empleos@litseacc.edu.mx`
- URL confirmación: `{{ .SiteURL }}/api/auth/callback?code={{ .TokenHash }}&type=email`
- URL reset: `{{ .SiteURL }}/api/auth/callback?code={{ .TokenHash }}&type=recovery`

---

## Flujo 7: Reset de contraseña

### Paso 1: Solicitar enlace
**Ruta:** `/reset-password`  
**Componente:** `ResetPasswordClient`

```
[Title]   Recuperar contraseña
[Subtitle] Ingresa tu correo y te enviaremos un enlace

[Input]   Correo electrónico
[Botón]   Enviar enlace

Estado éxito:
[Title]   Revisa tu correo
[Msg]     Enviamos un enlace a {email} para restablecer tu contraseña.
[Link]    ¿No lo recibiste? Intentar de nuevo
```

**Proceso:**
1. `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/api/auth/callback?type=recovery' })`
2. Supabase envía email con link
3. **Nota de seguridad:** Supabase NO revela si el email existe. Siempre se muestra la pantalla de éxito.

### Paso 2: Nueva contraseña
**Ruta:** `/reset-password/confirm`  
**Componente:** `ResetPasswordConfirmClient`

Tiene 3 estados:
- **`loading`**: verificando el token de la URL
- **`invalid`**: token expirado o inválido → "El enlace ha expirado. Solicita uno nuevo." + botón volver
- **`form`**: formulario para la nueva contraseña

```
[Title]    Nueva contraseña
[Subtitle] Ingresa y confirma tu nueva contraseña.

[Input]    Nueva contraseña (con strength bar)
[Input]    Confirmar contraseña
[Botón]    Guardar contraseña

Estado éxito:
[Title]    ¡Contraseña actualizada!
[Msg]      Redirigiendo al inicio de sesión...
```

**Proceso:**
1. Al cargar la página, Supabase extrae el token de la URL automáticamente
2. `supabase.auth.updateUser({ password: newPassword })`
3. Si éxito → redirigir a `/login` (o a `/login/terapeuta`, `/login/empleador` según de dónde vino)
4. Si token inválido → mostrar estado `invalid`

---

## Flujo 8: Cierre de sesión

**Ruta:** `POST /api/auth/signout`

Desde el sidebar → botón "Cerrar sesión":
1. `supabase.auth.signOut()`
2. Redirigir a `/login`
3. Invalidar cookies de sesión

---

## Configuración Supabase requerida

### Auth Settings (Dashboard → Authentication → Settings)
```
Site URL:     https://empleos.litseacc.edu.mx
Redirect URLs:
  - http://localhost:3000/api/auth/callback
  - https://empleos.litseacc.edu.mx/api/auth/callback

Email Confirmations: ON (obligatorio para terapeuta y empleador)
Secure Email Change: ON
Phone Auth: OFF
```

### Google OAuth (Dashboard → Authentication → Providers → Google)
```
Client ID:     [Google Cloud Console]
Client Secret: [Google Cloud Console]
```

Configurar en Google Cloud Console:
- Authorized redirect URIs: `https://xxx.supabase.co/auth/v1/callback`

### SMTP personalizado (para usar `empleos@litseacc.edu.mx`)
Dashboard → Authentication → SMTP Settings:
```
Host:     smtp.resend.com (si se usa Resend)
Port:     465
User:     resend
Password: [RESEND_API_KEY]
From:     empleos@litseacc.edu.mx
```
