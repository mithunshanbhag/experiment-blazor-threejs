import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'wwwroot/js',
    lib: {
      entry: 'ThreeJS/threejs-interop.ts',
      formats: ['es'],
      fileName: 'threejs-interop'
    }
  }
});