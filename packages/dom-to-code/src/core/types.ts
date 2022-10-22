import type { FilterPattern } from '@rollup/pluginutils'
import type { SUPPORT_MODE } from './constant'

/**
 * 支持的模式
 */
export type SupportMode = (typeof SUPPORT_MODE)[number]

/**
 * 插件配置选项
 */
export interface Options {
  /**
   * 模式
   */
  mode?: SupportMode

  /**
   * 包含的文件规则
   */
  include?: FilterPattern

  /**
   * 排除的文件规则
   */
  exclude?: FilterPattern
}

export interface VueQuery {
  vue?: boolean
  src?: boolean
  type?: 'script' | 'template' | 'style' | 'custom'
  index?: number
  lang?: string
  raw?: boolean
  from?: string
  isJsx?: boolean
}
