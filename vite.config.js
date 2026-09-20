import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// Two entry points so both design versions build and deploy together:
//   /          → v2, the light lead-first rework
//   /v1.html   → v1, the original film-hero concept
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        v1: resolve(import.meta.dirname, 'v1.html'),
      },
    },
  },
})
