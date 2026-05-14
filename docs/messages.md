# Messages i18n — Litsea Empleos
**Última actualización:** 2026-05-13  
**Archivos:** `messages/es.json` · `messages/en.json` · `messages/fr.json`  
**Idiomas:** Español (default, `as-needed`) · English · Français

---

## Namespaces implementados ✅

| Namespace | Usado en | Keys |
|---|---|---|
| `nav` | TopBar, Navbar, HeroSection | 7 |
| `banner` | TopBar | 3 |
| `hero` | HeroSection | 8 |
| `vacantesDestacadas` | Home sections | 4 |
| `terapeutasDestacados` | Home sections | 5 |
| `redEmpleadores` | Home sections | 4 |
| `howItWorks` | HowItWorksSection | 13 |
| `paraEmpleadores` | Home sections | 8 |
| `ctaFinal` | CtaSectionHome | 11 |
| `pageTitles` | Metadata de cada page | 8 |
| `whatsapp` | WhatsAppChat | 4 |
| `footer` | Footer (pendiente) | 13 |
| `resetPassword` | ResetPasswordClient, ResetPasswordConfirmClient | 28 |

---

## Namespaces por crear — por fase

### Fase 3 — Páginas públicas

```json
"vacantesPage": {
  "title": "Vacantes disponibles",
  "subtitle": "Oportunidades en hoteles y spas de lujo en la Riviera Maya",
  "filtroZona": "Zona",
  "filtroEspecialidad": "Especialidad",
  "filtroContrato": "Tipo de contrato",
  "sinResultados": "No hay vacantes que coincidan con tu búsqueda.",
  "verDetalle": "Ver vacante",
  "aplicar": "Aplicar ahora",
  "publicadaHace": "Publicada hace {days} días"
}

"terapeutasPage": {
  "title": "Directorio de terapeutas",
  "subtitle": "Talento certificado por Litsea Centro de Capacitación",
  "filtroEspecialidad": "Especialidad",
  "filtroZona": "Zona",
  "verificado": "Verificado",
  "verPerfil": "Ver perfil",
  "sinResultados": "No hay terapeutas que coincidan."
}

"comoFuncionaPage": {
  "title": "Cómo funciona",
  "subtitle": "Conectamos talento con oportunidades en 4 pasos simples"
}
```

### Fase 4-5 — Dashboard común

```json
"dashboard": {
  "bienvenido": "Bienvenido, {name}",
  "perfilIncompleto": "Completa tu perfil para aparecer en búsquedas",
  "completarPerfil": "Completar perfil",
  "aplicacionesActivas": "Aplicaciones activas",
  "mensajesNuevos": "Mensajes nuevos",
  "vacantesActivas": "Vacantes activas",
  "aplicacionesRecibidas": "Aplicaciones recibidas hoy",
  "cerrarSesion": "Cerrar sesión"
}
```

### Fase 4 — Dashboard terapeuta

```json
"perfil": {
  "title": "Mi perfil",
  "subtitle": "Así te ven los empleadores",
  "nombre": "Nombre completo",
  "bio": "Biografía profesional",
  "bioPlaceholder": "Describe tu experiencia y especialidades...",
  "especialidades": "Especialidades",
  "zonas": "Zonas de trabajo",
  "experiencia": "Años de experiencia",
  "foto": "Foto de perfil",
  "guardar": "Guardar cambios",
  "guardando": "Guardando...",
  "guardado": "Perfil actualizado correctamente"
}

"aplicacionesTerapeuta": {
  "title": "Mis aplicaciones",
  "subtitle": "Estado de tus postulaciones a vacantes",
  "estadoNew": "Nueva",
  "estadoReviewing": "En revisión",
  "estadoChatEnabled": "Chat habilitado",
  "estadoHired": "Contratado",
  "estadoRejected": "No seleccionado",
  "sinAplicaciones": "Aún no has aplicado a ninguna vacante.",
  "verVacante": "Ver vacante"
}

"certificados": {
  "title": "Mis certificados",
  "subtitle": "Sube tus certificados de Litsea para verificar tu perfil",
  "subir": "Subir certificado",
  "nombreCurso": "Nombre del curso",
  "fechaEmision": "Fecha de emisión",
  "verificado": "Verificado por Litsea",
  "pendiente": "Pendiente de revisión",
  "rechazado": "No verificado",
  "sinCertificados": "Aún no has subido certificados."
}

"mensajesChat": {
  "title": "Mensajes",
  "sinConversaciones": "No tienes conversaciones activas.",
  "escribeUnMensaje": "Escribe un mensaje...",
  "enviar": "Enviar",
  "chatHabilitadoPor": "Chat habilitado por Litsea"
}
```

### Fase 5 — Dashboard empleador

```json
"misVacantes": {
  "title": "Mis vacantes",
  "nuevaVacante": "Publicar vacante",
  "activa": "Activa",
  "inactiva": "Inactiva",
  "aplicaciones": "{count} aplicaciones",
  "editar": "Editar",
  "desactivar": "Desactivar",
  "sinVacantes": "Aún no has publicado vacantes."
}

"vacanteForm": {
  "titulo": "Título del puesto",
  "descripcion": "Descripción",
  "ubicacion": "Ubicación",
  "tipoContrato": "Tipo de contrato",
  "tiempoCompleto": "Tiempo completo",
  "porTemporada": "Por temporada",
  "freelance": "Freelance",
  "especialidadesRequeridas": "Especialidades requeridas",
  "publicar": "Publicar vacante",
  "guardarBorrador": "Guardar borrador",
  "publicando": "Publicando..."
}

"aplicacionesEmpleador": {
  "title": "Aplicaciones recibidas",
  "verPerfil": "Ver perfil completo",
  "habilitarChat": "Habilitar chat",
  "sinAplicaciones": "Aún no hay aplicaciones para esta vacante."
}
```

### Fase 6 — Panel admin

```json
"admin": {
  "title": "Panel de administración",
  "terapeutas": "Terapeutas",
  "empleadores": "Empleadores",
  "vacantes": "Vacantes",
  "aplicaciones": "Aplicaciones",
  "certificados": "Certificados",
  "mensajes": "Mensajes",
  "auditoria": "Auditoría",
  "configuracion": "Configuración",
  "verificar": "Verificar",
  "suspender": "Suspender",
  "reactivar": "Reactivar",
  "eliminar": "Eliminar",
  "destacar": "Destacar",
  "habilitarChat": "Habilitar chat",
  "cambiarEstado": "Cambiar estado",
  "accionRegistrada": "Acción registrada en auditoría"
}
```

---

## Convenciones

- **Plurales:** usar `{count}` como variable — `"{count} aplicaciones"`
- **Nombres propios:** siempre interpolar con `{name}` — `"Bienvenido, {name}"`
- **Rich text:** solo en `useTranslations().rich()` — nunca `dangerouslySetInnerHTML`
- **Namespace por dominio:** un namespace por sección/feature, no por página
- **pageTitles:** centraliza todos los `<title>` y `<meta description>` de las pages

---

## Cómo agregar un namespace nuevo

1. Agregar el namespace a `messages/es.json` primero
2. Copiar la misma estructura a `messages/en.json` (traducir valores)
3. Copiar a `messages/fr.json` (traducir valores)
4. Usar en el componente:
   ```tsx
   const t = useTranslations('nombreNamespace')  // Client Component
   const t = await getTranslations('nombreNamespace')  // Server Component / generateMetadata
   ```
