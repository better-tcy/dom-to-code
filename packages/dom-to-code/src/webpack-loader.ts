import type { LoaderContext } from 'webpack'
import { getOptions } from 'loader-utils'
import type { Options } from './core/types'
import { transform } from './core/transform'

/**
 * webpack loader
 */
export default async function (this: LoaderContext<Options>, source: string) {
  const { resourcePath } = this
  // webpack 5 用 this.getOptions()， webpack 4 用 getOptions(this)
  const options = typeof this.getOptions === 'function' ? this.getOptions() : getOptions(this as any)

  const result = await transform(source, resourcePath, options)
  return typeof result === 'string' ? result : ((result as any)?.code || '')
}
