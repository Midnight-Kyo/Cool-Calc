import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Cool-Calc/',
  plugins: [react()],
  build: {
    outDir: 'docs', // <--- IMPORTANT
  },
})
