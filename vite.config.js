import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// API calls use apiUrl() with VITE_API_BASE_URL, falling back to http://localhost:8080.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
