import path from 'node:path'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import viteUnocss from 'unocss/vite'
import { domToCodePlugin } from 'dom-to-code/vite'

const pathResolve = (..._path: string[]) => path.resolve(__dirname, ..._path)

export default defineConfig({
  root: pathResolve('./'),
  plugins: [
    domToCodePlugin({
      mode: 'react',
    }),

    viteReact(),

    // https://github.com/antfu/unocss
    // 有关配置，请参见 unocss.config.ts
    viteUnocss(),
  ],
  server: {
    host: true,
  },
})
