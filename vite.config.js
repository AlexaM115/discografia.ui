import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/discografia.ui/',   // 👈 nombre EXACTO del repo (sensible a mayúsculas)
})
