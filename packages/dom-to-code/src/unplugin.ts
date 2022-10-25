import { createFilter } from '@rollup/pluginutils'
import { createUnplugin } from 'unplugin'
import type { Compiler, RuleSetRule } from 'webpack'
import type { Plugin as VitePlugin } from 'vite'
import { resolveOption } from './core/helpers'
import { launchEditorMiddleware, launchEditorMiddlewareForVite } from './core/middleware'
import type { Options } from './core/types'
import { transform } from './core/transform'
import { pathResolve } from './shared-utils'
import { savePluginOptions } from './core/env'

/**
 * 构建 unplugin
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default createUnplugin<Options | undefined>((userOptions: Options = {}, meta) => {
  // 配置选项
  const options = resolveOption(userOptions)

  // 构建过滤器
  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'unplugin-dom-to-code',
    enforce: 'pre',

    buildStart() {
      savePluginOptions(options)
    },

    transformInclude(id) {
      // 因为 webpack 的 transform 没能覆盖原有代码，所以 webpack 不走 transform, 走 loaders
      if (meta.framework === 'webpack')
        return false

      return filter(id)
    },

    transform(code, id) {
      try {
        return transform(code, id, options)
      }
      catch (e: any) {
        this.error(e)
      }
    },

    vite: {
      configureServer(server) {
        server.middlewares.use(launchEditorMiddlewareForVite)
      },
    } as VitePlugin,

    webpack(compiler: Compiler) {
      const isWebpack5 = Number(compiler.webpack?.version?.[0]) >= 5 || false

      // 使用 loaders 转换代码
      compiler.options.module.rules.push({
        test: options.include as RuleSetRule['test'],
        use: [
          {
            loader: pathResolve('./webpack-loader.cjs'),
            options: {
              ...options,
            },
          },
        ],
      })

      if (!compiler.options.devServer)
        compiler.options.devServer = {}

      const { devServer } = compiler.options

      /**
       * 不知道 before 和 setupMiddlewares 为什么在 vue cli 里老是被抹掉，所以这段代码基本没用，但是 create-react-app 可能有用，所以保留
       */
      if (isWebpack5) {
        // 如果 webpack 版本大于等于 5.0.0
        const originSetup = devServer.setupMiddlewares
        devServer.setupMiddlewares = (middlewares: any[], devServer: any): any[] => {
          const result = originSetup
            ? originSetup(middlewares, devServer)
            : middlewares
          result.unshift(launchEditorMiddleware)
          return result
        }
      }
      else {
        // 如果 webpack 版本小于 5.0.0
        const originBefore = devServer.before
        devServer.before = (app: any, server: any, compiler: Compiler) => {
          app.use(launchEditorMiddleware)
          originBefore?.(app, server, compiler)
        }
      }
    },
  }
})
