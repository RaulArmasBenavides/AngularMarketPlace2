# Angular Marketplace

Marketplace (plataforma multivendedor) construido con Angular 21, Angular Material y renderizado en servidor (SSR). Un marketplace es un tipo de e-commerce donde varios vendedores independientes publican y venden en una misma plataforma, y esta gestiona búsqueda, carrito, pagos, mensajes entre comprador y vendedor, y disputas.

Funcionalidades principales: catálogo y búsqueda, tiendas de vendedores (`store-list`, `become-a-vendor`), carrito, checkout, cuenta de usuario con compras, ventas, órdenes, lista de deseos, mensajes y disputas.

> No está listo para producción: los pagos son stubs y hay configuración de desarrollo en `src/environments/`. Ver "Estado".

## Requisitos

- Node.js 24 (el mismo que usan los Dockerfiles)
- Backend del marketplace: `../TantooServiceRestNode`, en `http://localhost:3700/api`

## Instalación

```bash
npm install
```

`.npmrc` contiene `legacy-peer-deps=true`. Es necesario: el `package-lock.json` se generó con esa opción y `npm ci` falla sin ella.

## Desarrollo

```bash
npm start          # ng serve en http://localhost:4200 (solo cliente, sin SSR)
```

## Build

```bash
npm run build -- --configuration production
```

Genera `dist/my-app/browser` (cliente) y `dist/my-app/server` (servidor SSR).

## SSR (renderizado en servidor)

Solo las rutas públicas de catálogo se renderizan en servidor (`src/app/app.routes.server.ts`), para que los buscadores indexen productos, tiendas y categorías:

| Ruta | Render |
|------|--------|
| `/`, `/products/:param`, `/product/:param`, `/search/:param`, `/store-list` | Servidor (SSR) |
| Resto (`/account`, `/checkout`, `/shopping-cart`, `/login`, `/register`, etc.) | Cliente |

Ejecutar el servidor SSR después del build:

```bash
node dist/my-app/server/server.mjs
```

Variables de entorno del servidor:

| Variable | Default | Uso |
|----------|---------|-----|
| `PORT` | 4000 | Puerto HTTP |
| `NG_ALLOWED_HOSTS` | (vacío) | Hosts aceptados en la cabecera `Host`, separados por coma. Si no coincide, Angular responde sin SSR. Ej.: `localhost,127.0.0.1` |
| `API_INTERNAL_URL` | (no definida) | URL que el servidor usa para llegar al backend, cuando difiere de `environment.apiUrl` (p. ej. `http://backend:3700/api` en Docker). Solo afecta al render del servidor |

Consideraciones del SSR:
- En el servidor, `localStorage` y `sessionStorage` son un no-op (`src/server-polyfills.ts`): el render es siempre "sin sesión".
- `SweetAlert` no existe en el servidor; sus avisos se omiten allí (`src/app/functions.ts`).
- Si el backend no responde durante el render, la página se sirve igual con los datos disponibles, y las llamadas fallidas quedan en el log del servidor.

## Docker

```bash
docker build -t marketplace-frontend .
docker run --rm -p 4000:4000 -e NG_ALLOWED_HOSTS=localhost,127.0.0.1 marketplace-frontend
```

El stack completo (MongoDB, backend y frontend) está en el `docker-compose.yml` de la carpeta padre `Marketplace2/`. Ver el README de la raíz.

## Pruebas

```bash
npm test           # Karma + Jasmine (ng test)
```

Los archivos `*.spec.ts` están junto al código fuente. La mayoría son plantillas generadas por el CLI y no prueban comportamiento real.

## Configuración y secretos

- `src/environments/environment.ts` (desarrollo) y `environment.prod.ts` (producción) deben tener las mismas claves. Contienen la URL del backend, la configuración de Firebase y las claves de PayU, Mercado Pago y PayPal.
- **Hoy esos valores son de ejemplo o de sandbox y están en el repositorio.** Antes de producción hay que reemplazar `apiUrl`, `paypalClientId` y las claves de pago.
- Angular no lee un `.env` en build de forma nativa. Mover las claves a variables de entorno requiere un paso previo al build que genere `environment.prod.ts`.
- Subida de archivos y envío de correos: scripts PHP en `src/assets/` (`img/`, `email/`, `payu/`), protegidos por `apiKey`.

## Estructura

- `src/app/app-routing.module.ts`: rutas con `loadChildren` (lazy loading).
- `src/app/app.routes.server.ts`: modo de render por ruta (SSR o cliente).
- `src/app/app.module.server.ts`: módulo de arranque del servidor.
- `src/server.ts`: servidor Express con Angular SSR.
- `src/app/pages/`: módulos de página.
- `src/app/core/`: `CoreModule` (cabecera, pie, newsletter) e interceptores HTTP.
- `src/app/services/`: servicios HTTP que usan `config.ts` para las URLs.
- `src/app/guards/auth.guard.ts`: protege `/account` y `/checkout`.

Interceptores (`app.module.ts`):

1. `MockFirebaseInterceptor`: datos de prueba para URLs con el host de ejemplo `project-id.firebaseio.com`.
2. `AuthInterceptor`: añade `?auth=<idToken>` a Firebase Realtime DB y la cabecera `x-token` al backend `TantooServiceRestNode`.
3. `ErrorInterceptor`: en 401/403 limpia `localStorage` y redirige a `/login`; muestra avisos en error de red y 5xx.

Dependencias de interfaz: Bootstrap 5, Angular Material, Swiper, `ng-select`, `ngx-chips`, `ngx-dropzone`, Chart.js (`src/assets/js/plugins/Chart.min.js`) y SweetAlert2 (CDN en `index.html`).

**jQuery fue eliminado por completo**, junto con DataTables, Summernote (el editor de descripción es un `<textarea>`), `ng-starrating` (incompatible con Angular 21) y sus scripts y CSS en `src/assets/`.

## Estado

- **Pagos:** PayU, Mercado Pago y PayPal en sandbox. El backend confirma pagos con un stub que no verifica nada.
- **Datos:** conviven Firebase (Auth REST y Realtime DB) y el backend Node/Mongo. Hay que definir la fuente de verdad.
- **Firebase:** `databaseURL` no lleva `/` final y los servicios concatenan la ruta, lo que genera URLs como `…comcategories.json`. Es un problema previo que aparece en el log del SSR.
- **Configuración:** `paypalClientId` es `TU_CLIENT_ID_AQUI` y el bloque `firebase` usa valores de ejemplo.
- **Pruebas:** specs generadas por el CLI, sin cobertura real.

## Licencia

Sin licencia declarada.
