import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import nodePolyfills from 'rollup-plugin-polyfill-node';


// https://vitejs.dev/config/
export default defineConfig({
  base: "/chain-thought/",
  plugins: [
    react(),
    nodePolyfills({
      include: ['stream']
    })
  ],
  resolve: {
    alias: {
      'stream': 'stream-browserify',
    },
  },
})
