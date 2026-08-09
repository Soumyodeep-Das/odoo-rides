import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '#components': resolve(import.meta.dirname, 'src/components'),
      '#lib': resolve(import.meta.dirname, 'src/lib'),
      '#app': resolve(import.meta.dirname, 'src/app'),
      '#core': resolve(import.meta.dirname, 'src/core'),
      '#modules': resolve(import.meta.dirname, 'src/modules'),
      '#styles': resolve(import.meta.dirname, 'src/styles'),
    },
  },
})
