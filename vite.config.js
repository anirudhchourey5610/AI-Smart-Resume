import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// API calls use apiUrl() → http://localhost:8080 (see src/config/api.js), not this server.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
