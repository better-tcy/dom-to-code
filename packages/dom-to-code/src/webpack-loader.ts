import type { LoaderContext } from 'webpack'
import type { Options } from './core/types'
import { transform } from './core/transform'

/**
 * webpack loader
 */
export default async function (this: LoaderContext<Options>, source: string) {
  const { resourcePath } = this
  const options = this.getOptions()
  const pathBefore = __dirname.substring(0, __dirname.search('node_modules'))
  const filePath = resourcePath.substring(pathBefore.length)

  const result = await transform(source, filePath, options)
  return typeof result === 'string' ? result : ((result as any)?.code || '')
}
