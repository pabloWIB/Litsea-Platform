# Pendientes — Litsea Empleos
**Última actualización:** 2026-05-14  
**Estado del código:** ✅ Completo — 0 errores TypeScript, 26 pantallas, i18n ES/EN/FR

---

## 🔴 Bloqueantes para producción (fuera del código)

### ~~1. Google OAuth~~ ✅ CONFIGURADO

---

### 2. Supabase Auth — URL Configuration
En **Supabase Dashboard** → Authentication → URL Configuration:

```
Site URL:
  https://empleos.litseacc.edu.mx

Additional Redirect URLs:
  http://localhost:3000/api/auth/callback
  https://empleos.litseacc.edu.mx/api/auth/callback
```

> Sin esto, el email de confirmación y el reset de contraseña no funcionan.

---

### 3. Supabase Auth — Email Templates
En **Supabase Dashboard** → Authentication → Email Templates, actualizar cada template con las URLs de `public/tamplates/`:

| Template | URL a configurar |
|---|---|
| Confirm signup | `{{ .SiteURL }}/api/auth/callback?code={{ .TokenHash }}&type=email` |
| Reset password | `{{ .SiteURL }}/api/auth/callback?code={{ .TokenHash }}&type=recovery` |
| From address | `informes@litseacc.edu.mx` |

---

### 4. Supabase Storage — Crear buckets
En **Supabase Dashboard** → Storage → New bucket:

| Bucket | Visibilidad | Uso |
|---|---|---|
| `avatars` | Público | Fotos de perfil terapeutas |
| `certificates` | Privado | PDFs certificados (signed URL) |
| `logos` | Público | Logos empleadores |

---

### 5. SMTP / Resend en Supabase (para emails de auth)
En **Supabase Dashboard** → Authentication → SMTP Settings:
```
Host:     smtp.resend.com
Port:     465
User:     resend
Password: re_EWRnnfyp_Gb342vcsrS7ezKh41ycupJHW
From:     informes@litseacc.edu.mx
```

> Sin esto, los emails de confirmación se envían desde el dominio genérico de Supabase.

---

## 🟡 Mejoras de código (no bloqueantes)

### 6. Número de WhatsApp
Verificar que `529842337294` en `components/ui/WhatsAppChat.tsx` es el número correcto de Litsea.
Si no, actualizar la constante `WHATSAPP_NUMBER` en ese archivo.

### 7. Borrar ruta de auth vieja
`app/auth/callback/route.ts` es código muerto — la ruta correcta está en `app/api/auth/callback/route.ts`.
Se puede eliminar sin consecuencias.

### 8. VacantesDestacadas y TerapeutasDestacados — datos reales
`components/home/VacantesDestacadas.tsx` y `TerapeutasDestacados.tsx` usan datos estáticos de placeholder.
Para conectarlos a DB: convertir `HomeClient.tsx` en Server Component que pase props, o hacer fetch desde esos componentes directamente.

### 9. Dominio de email verificado en Resend
Para que los emails lleguen desde `informes@litseacc.edu.mx` sin caer en spam:
- Verificar el dominio `litseacc.edu.mx` en **Resend Dashboard** → Domains
- Agregar los registros DNS (SPF, DKIM) que Resend proporciona

---

## 🟢 Deploy en EasyPanel

Una vez resueltos los puntos 1-5:

1. **Variables de entorno** en EasyPanel:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   RESEND_API_KEY=re_EWRnnfyp_Gb342vcsrS7ezKh41ycupJHW
   RESEND_FROM=informes@litseacc.edu.mx
   NEXT_PUBLIC_SITE_URL=https://empleos.litseacc.edu.mx
   CRON_SECRET=
   ```

2. **Build command:** `npm run build`
3. **Start command:** `npm run start`
4. **Puerto:** 3000
5. Apuntar dominio `empleos.litseacc.edu.mx` al servidor

---

## ✅ Lo que está 100% listo (no tocar)

| Área | Detalle |
|---|---|
| Código completo | 26 pantallas, todas las mutaciones con Server Actions |
| TypeScript | 0 errores |
| i18n | 20 namespaces, 343 claves — ES/EN/FR perfectamente alineados |
| Auth UI | Login, registro, reset password, admin — completo |
| Dashboard terapeuta | Dashboard, perfil wizard, vacantes, aplicaciones, certificados, mensajes, configuración |
| Dashboard empleador | Dashboard, vacantes CRUD, candidatos, mensajes, configuración |
| Panel admin | Dashboard, terapeutas, empleadores, vacantes, aplicaciones, certificados, mensajes, opiniones, auditoría, configuración |
| Páginas públicas | Home, /vacantes, /vacantes/[id], /terapeutas, /terapeutas/[slug], /como-funciona, privacidad, términos, cookies |
| API routes | /api/opiniones (GET+POST), /api/opiniones/[id] (PATCH), /api/auth/callback |
| Emails Resend | ChatEnabledEmail, ApplicationStatusEmail — se envían al habilitar chat / cambiar estado |
| Sistema de opiniones | Formulario público, moderación admin, sección home con modal |
| Audit log | logAudit() en todas las acciones admin |
| SQL | schema.sql + rls.sql + seed.sql aplicados |
| SEO | robots.ts, sitemap.ts, JSON-LD JobPosting/Person en vacantes y terapeutas |
