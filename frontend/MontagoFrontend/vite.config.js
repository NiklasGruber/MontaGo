import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // falls du React verwendest

export default defineConfig({
  plugins: [react()],
  base: '/', // wichtig, damit es im Root deployed wird
  build: {
    outDir: 'dist'
  }
})
