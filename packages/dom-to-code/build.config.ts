import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/shared-utils', 'src/unplugin', 'src/esbuild', 'src/nuxt', 'src/rollup', 'src/vite', 'src/webpack', 'src/webpack-loader'],
  externals: ['esbuild', 'webpack', 'rollup', 'vite', 'nuxt'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    cjsBridge: true,
  },
})
