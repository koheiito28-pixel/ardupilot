import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split the heavy 3D / animation libraries into their own chunks so the
    // initial bundle stays light and the page paints fast.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
          lottie: ['lottie-web'],
        },
      },
    },
  },
});
