/**
 * Node no tiene localStorage/sessionStorage. En el servidor no hay sesión:
 * se renderiza siempre como "sin sesión", por eso el storage es un no-op que
 * nunca guarda nada (así no se filtra estado entre peticiones de distintos usuarios).
 */
const noopStorage = {
  length: 0,
  getItem: (): string | null => null,
  setItem: (): void => {},
  removeItem: (): void => {},
  clear: (): void => {},
  key: (): string | null => null
};

const g = globalThis as any;
if (typeof g.localStorage === 'undefined') {
  g.localStorage = noopStorage;
}
if (typeof g.sessionStorage === 'undefined') {
  g.sessionStorage = noopStorage;
}
