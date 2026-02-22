import { fileURLToPath, URL } from 'node:url'

import { deltaComic } from '@delta-comic/vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import browserslist from 'browserslist'
import { browserslistToTargets } from 'lightningcss'
import { NaiveUiResolver, VantResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, type UserConfigExport } from 'vite'

import _package from './package.json'
export default defineConfig(
  ({ command }) =>
    ({
      plugins: [
        vue(),
        vueJsx(),
        Components({ dts: true, resolvers: [NaiveUiResolver(), VantResolver()] }),
        tailwindcss(),
        deltaComic(
          {
            name: 'cosav',
            displayName: 'cos天堂',
            version: _package.version,
            supportCoreVersion: '^1.2',
            author: _package.author.name,
            description: _package.description,
            require: [
              'core',
              { id: 'layout', download: 'gh:delta-comic/delta-comic-plugin-layout' }
            ]
          },
          command,
          _package
        )
      ],
      resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
      css: {
        transformer: 'lightningcss',
        lightningcss: {
          targets: browserslistToTargets(browserslist('> 1%, last 2 versions, not ie <= 8'))
        }
      },
      build: { sourcemap: false, minify: true, cssMinify: true },
      server: { port: 6173, host: true },
      base: '/'
    }) satisfies UserConfigExport
)