# Deploy Next.js en EasyPanel vía ZIP

## Requisitos previos

- Proyecto Next.js funcionando localmente
- Acceso a EasyPanel: `http://31.97.135.166:3000`
- Subdominio apuntando al VPS: `empleos.litseacc.edu.mx`

---

## Paso 1 — Preparar el ZIP

En tu máquina local, dentro del proyecto Next.js:

```bash
# Instalar dependencias e instalar
npm install

# Generar el build de producción
npm run build
```

Crea el ZIP con estos archivos/carpetas (sin node_modules):

```
mi-proyecto.zip
├── .next/          ← build generado
├── public/         ← assets estáticos
├── package.json
├── package-lock.json
└── next.config.js  ← si existe
```

> En Windows puedes seleccionar esas carpetas, clic derecho → Comprimir en ZIP.
> NO incluir: `node_modules/`, `.env.local`, `.git/`

---

## Paso 2 — Crear el servicio en EasyPanel

1. Ir a `http://31.97.135.166:3000/projects/n8n_kommo/create`
2. Clic en **Aplicación**
3. Nombre del servicio: `empleos`
4. Clic en **Crear**

---

## Paso 3 — Configurar la fuente (ZIP)

Dentro del servicio recién creado:

1. Ir a la pestaña **Fuente** (Source)
2. Seleccionar tipo: **ZIP / Upload**
3. Subir el archivo ZIP preparado en el Paso 1

---

## Paso 4 — Configurar build y arranque

En la pestaña **General** o **Build**:

| Campo | Valor |
|---|---|
| Install command | `npm install --production` |
| Build command | *(dejar vacío — ya viene buildeado)* |
| Start command | `npm start` |
| Puerto | `3000` |

> `npm start` en Next.js arranca el servidor en el puerto 3000 por defecto.

---

## Paso 5 — Configurar el dominio

1. Ir a la pestaña **Dominios**
2. Clic en **Agregar dominio**
3. Dominio: `empleos.litseacc.edu.mx`
4. Puerto: `3000`
5. Activar **HTTPS** (Traefik gestiona el certificado SSL automáticamente)

---

## Paso 6 — Variables de entorno

Si tu app Next.js usa variables de entorno:

1. Ir a la pestaña **Variables de entorno**
2. Agregar cada variable (equivalente a tu `.env.local`):

```
NEXT_PUBLIC_API_URL=https://empleos.litseacc.edu.mx
# ... otras variables
```

> Las variables `NEXT_PUBLIC_*` son visibles en el cliente (browser).
> Las demás solo están disponibles en el servidor.

---

## Paso 7 — Deploy

1. Clic en **Deploy** (o **Guardar y deployar**)
2. Ver los logs en tiempo real en la pestaña **Logs**
3. Esperar que aparezca: `ready - started server on 0.0.0.0:3000`

---

## Actualizar el sitio (re-deploy)

Cada vez que hay cambios:

1. Correr `npm run build` localmente
2. Generar nuevo ZIP (mismas carpetas)
3. En EasyPanel → servicio `empleos` → **Fuente** → subir nuevo ZIP
4. Clic en **Deploy**

---

## Solución de problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `Error: Cannot find module` | Falta `node_modules` del build | Verificar que `.next/` está en el ZIP |
| Puerto no responde | Start command incorrecto | Verificar que el comando es `npm start` y el puerto es `3000` |
| SSL no funciona | DNS no apunta al VPS | Verificar que `empleos.litseacc.edu.mx` apunta a `31.97.135.166` |
| Variables no disponibles | No configuradas en EasyPanel | Agregar en pestaña Variables de entorno |
