/**
 * Spring Boot API origin. Requests go directly to the backend (not to the Vite dev server).
 * Override with env: VITE_API_BASE=https://your-api.example.com
 */
const DEFAULT_API_ORIGIN = "http://localhost:8080";

export function apiUrl(path) {
  const base = (import.meta.env.VITE_API_BASE ?? DEFAULT_API_ORIGIN).replace(
    /\/$/,
    ""
  );
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
