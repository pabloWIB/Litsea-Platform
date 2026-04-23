# Litsea Bolsa de Trabajo — Qué vamos a construir
**Fecha:** 2026-03-31

---

## La idea en una línea

Una plataforma web donde los egresados de Litsea publican su perfil profesional y los hoteles y spas de la Riviera Maya encuentran al terapeuta que necesitan.

---

## Para quién es

Tres tipos de usuario:

1. **Terapeutas** — egresados de Litsea que buscan trabajo en spas y hoteles de lujo.
2. **Empleadores** — hoteles y spas que necesitan contratar talento certificado.
3. **Equipo Litsea (admin)** — gestiona todo desde un panel interno.

---

## Qué puede hacer cada uno

### Terapeuta

- Crea su cuenta con correo o con Google.
- Llena su perfil: nombre, foto, especialidades, zonas donde puede trabajar, bio.
- Sube sus certificados de Litsea.
- Ve las vacantes disponibles y aplica con un clic.
- Cuando Litsea aprueba su aplicación, puede chatear directamente con el empleador.
- Tiene un dashboard donde ve el estado de sus aplicaciones y sus mensajes.

### Empleador

- Crea su cuenta (o Litsea la crea por él).
- Publica vacantes: título, descripción, ubicación, tipo de contrato, especialidades que busca.
- Ve los terapeutas que aplicaron a cada vacante.
- Cuando Litsea habilita el contacto, puede chatear con el terapeuta.
- Tiene un dashboard con sus vacantes activas y las aplicaciones recibidas.

### Equipo Litsea (admin)

- Ve todo: terapeutas, empleadores, vacantes, aplicaciones.
- Verifica que un terapeuta sea egresado real de Litsea.
- Revisa certificados subidos y los marca como válidos.
- Decide cuándo habilitar el chat entre un terapeuta y un empleador.
- Puede suspender cuentas, destacar vacantes en el home, eliminar lo que sea necesario.
- Tiene un historial de todas las acciones realizadas en la plataforma.
- Puede cambiar los textos del home y activar o desactivar nuevos registros.

---

## Pantallas del sistema

En total son **26 pantallas**. Aquí el resumen:

### Parte pública (lo que ve cualquier visitante)

| Pantalla | Qué es |
|---|---|
| Home / Landing | Presenta la plataforma, muestra vacantes y terapeutas destacados, explica cómo funciona |
| Listado de vacantes | Todas las vacantes activas, con filtros por zona y especialidad |
| Detalle de vacante | Info completa de la vacante y botón para aplicar |
| Directorio de terapeutas | Terapeutas verificados con sus especialidades |
| Perfil de terapeuta | Foto, bio, especialidades, certificaciones |
| Login | Entrar con correo/contraseña o con Google |
| Registro terapeuta | Formulario para crear cuenta como terapeuta |
| Registro empleador | Formulario para crear cuenta como empleador |

### Área del terapeuta (requiere cuenta)

| Pantalla | Qué es |
|---|---|
| Dashboard | Resumen de aplicaciones activas y mensajes nuevos |
| Mi perfil | Editar datos personales, especialidades, zonas |
| Mis aplicaciones | Ver a qué vacantes aplicó y en qué estado están |
| Mis certificados | Subir y ver certificados de Litsea |
| Mensajes | Chat con empleadores (solo los habilitados por admin) |

### Área del empleador (requiere cuenta)

| Pantalla | Qué es |
|---|---|
| Dashboard | Resumen de vacantes y aplicaciones |
| Mis vacantes | Crear, editar y gestionar vacantes |
| Aplicaciones recibidas | Ver quién aplicó a cada vacante |
| Mensajes | Chat con terapeutas habilitados |

### Panel admin (solo equipo Litsea)

| Pantalla | Qué es |
|---|---|
| Dashboard | Métricas: total de terapeutas, empleadores, vacantes, aplicaciones |
| Terapeutas | Ver, verificar, suspender o editar cualquier terapeuta |
| Empleadores | Ver, suspender o editar cualquier empleador |
| Vacantes | Ver todas las vacantes, destacarlas o eliminarlas |
| Aplicaciones | Ver estado de cada aplicación y habilitar el chat |
| Certificados | Revisar y validar certificados subidos |
| Mensajes | Ver todas las conversaciones activas |
| Auditoría | Historial de todo lo que hizo el equipo admin |
| Configuración | Textos del home, activar/desactivar registros |

---

## Cómo funciona el flujo completo

1. El terapeuta se registra y completa su perfil.
2. Ve las vacantes disponibles y aplica a las que le interesan.
3. El equipo de Litsea recibe una notificación y revisa la aplicación.
4. Si todo está bien, Litsea habilita el chat entre el terapeuta y el empleador.
5. El empleador y el terapeuta se contactan por la plataforma.
6. El empleador decide si contrata o no.

Litsea controla ese paso 4. Nada pasa sin su aprobación.

---

## Qué servicios usamos y por qué

| Servicio | Para qué |
|---|---|
| **Supabase** | Base de datos, login, almacenamiento de archivos (certificados, fotos) |
| **Google** | Login con cuenta de Google (opcional para los usuarios) |
| **Resend** | Emails automáticos: bienvenida, notificaciones de aplicaciones, aviso de chat habilitado |
| **Vercel** | Donde vive el sitio web, garantiza que esté siempre disponible |

---

## Emails automáticos que el sistema envía

- Bienvenida cuando alguien se registra.
- Notificación al admin cuando llega una nueva aplicación.
- Aviso al terapeuta y al empleador cuando se habilita el chat.
- Notificación al terapeuta cuando cambia el estado de su aplicación.

---

## Lo que NO incluye esta versión

- App móvil (es web, funciona bien desde el celular).
- Pagos o suscripciones.
- Sistema de reseñas o calificaciones.
- Video llamadas integradas.

Eso puede venir en versiones futuras si tiene sentido.

---

## Preguntas que necesitamos responder antes de arrancar

1. ¿Los empleadores se registran solos o el equipo Litsea crea sus cuentas?
2. ¿Cuántas vacantes puede publicar un empleador al mismo tiempo?
3. ¿El terapeuta puede aplicar a varias vacantes del mismo hotel?
4. ¿Los emails de notificación van a una dirección específica del equipo Litsea?
5. ¿Hay fecha de lanzamiento en mente?
