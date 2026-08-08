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
      '#components': resolve(__dirname, 'src/components'),
      '#lib': resolve(__dirname, 'src/lib'),
      '#app': resolve(__dirname, 'src/app'),
      '#core': resolve(__dirname, 'src/core'),
      '#modules': resolve(__dirname, 'src/modules'),
      '#styles': resolve(__dirname, 'src/styles'),
    },
  },
})
