import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// Two entry points so both designs build and deploy together:
//   /         → Design A, Daylight
//   /b.html   → Design B, Cinematic
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        b: resolve(import.meta.dirname, 'b.html'),
      },
    },
  },
})
