import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from "vite-plugin-singlefile"
import { cpSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    viteSingleFile(),
    {
      closeBundle: () => {
        cpSync('./dist/', '../ui/.base_/loading', {recursive: true});
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  ssr: false,
})
