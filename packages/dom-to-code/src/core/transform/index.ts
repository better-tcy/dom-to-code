import type { Thenable, TransformResult } from 'unplugin'
import type { Options } from './../types'
import { transformReact } from './react'
import { transformVue } from './vue'

/**
 * 转换代码
 * @param code 要转换的代码
 * @param id 该文件的全路径
 * @param options 插件配置选项
 * @returns 构建结果 {code: string, map: any}
 */
export function transform(code: string, id: string, options: Options): Thenable<TransformResult> {
  if (options.mode === 'vue')
    return transformVue(code, id)

  else if (options.mode === 'react')
    return transformReact(code, id)

  else
    return code
}
