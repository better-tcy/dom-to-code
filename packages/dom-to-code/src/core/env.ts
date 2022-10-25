import { resolveOption, valToHash } from './helpers'
import type { Options } from './types'

declare global {
  namespace NodeJS {
    interface Process {
      DOM_TO_CODE_OPTIONS?: Options
      DOM_TO_CODE_HASH_PATH_MAP?: Record<string, string>
    }
  }
}

/**
 * 保存插件配置
 * @param options 插件配置
 */
export const savePluginOptions = (options: Options) => {
  process.DOM_TO_CODE_OPTIONS = options
}

/**
 * 获取插件配置
 * @returns 返回插件用户配置
 */
export const getPluginOptions = () => process.DOM_TO_CODE_OPTIONS || resolveOption({ mode: 'vue' })

/**
 * 保存文件路径信息
 * @param filePath 文件路径信息
 * @return 返回哈希值
 */
export const savePathToHashMap = (filePath: string): string => {
  if (!process.DOM_TO_CODE_HASH_PATH_MAP)
    process.DOM_TO_CODE_HASH_PATH_MAP = {}
  const hashPathMap = process.DOM_TO_CODE_HASH_PATH_MAP

  const pathHash = valToHash(filePath)
  if (pathHash && !hashPathMap[pathHash])
    hashPathMap[pathHash] = filePath

  return pathHash
}

/**
 * 获取文件路径
 * @param hash 文件路径 hash 值
 * @returns 返回文件路径
 */
export const getPathFromHashMap = (hash: string): string => {
  const hashPathMap = process.DOM_TO_CODE_HASH_PATH_MAP || {}
  return hashPathMap[hash] || ''
}
