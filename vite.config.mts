import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver, VantResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import _package from './package.json'
import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import { deltaComic } from 'delta-comic-core/vite'
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      dts: true,
      resolvers: [
        NaiveUiResolver(),
        VantResolver()
      ],
    }),
    tailwindcss(),
    deltaComic({
      name: 'cosav',
      displayName: 'cos天堂',
      version: _package.version,
      supportCoreVersion: '^0.5',
      author: _package.author.name,
      description: _package.description,
      require: ['core', {
        id: 'layout',
        download: 'gh:delta-comic/delta-comic-plugin-layout'
      }]
    }, command, _package)
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('> 1%, last 2 versions, not ie <= 8'))
    }
  },
  build: {
    sourcemap: false,
    // minify: true,
    // cssMinify: true
  },
  server: {
    port: 6173
  },
  base: "/",
} satisfies UserConfigExport))
