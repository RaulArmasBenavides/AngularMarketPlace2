import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * SSR solo para las rutas públicas de catálogo (indexables por buscadores).
 * El resto (cuenta, checkout, carrito, login, etc.) se renderiza en el cliente,
 * porque dependen de la sesión guardada en localStorage.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: 'products/:param', renderMode: RenderMode.Server },
  { path: 'product/:param', renderMode: RenderMode.Server },
  { path: 'search/:param', renderMode: RenderMode.Server },
  { path: 'store-list', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Client }
];
