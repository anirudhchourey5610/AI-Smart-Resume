/**
 * Spring Boot API origin. Requests go directly to the backend (not to the Vite dev server).
 * Override with env: VITE_API_BASE_URL=https://your-api.example.com
 */
const DEFAULT_API_ORIGIN = "http://localhost:8080";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_ORIGIN
).replace(/\/$/, "");

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}
