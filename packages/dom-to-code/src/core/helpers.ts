import type { JSXIdentifier, JSXMemberExpression, JSXNamespacedName, JSXOpeningElement } from '@babel/types'
import type { FilterPattern } from '@rollup/pluginutils'
import type MagicString from 'magic-string'
import type { TransformResult } from 'unplugin'
import { savePathToHashMap } from './env'
import { DOM_ATTR, REGEX_JSX_FILE, REGEX_SETUP_SFC, REGEX_VUE_SFC, SUPPORT_MODE } from './constant'
import type { Options, SupportMode } from './types'

/**
 * 创建 dom attr=文件代码路径信息哈希字符串
 * @param filePath 文件路径
 * @param line 行号
 * @param column 列号
 * @returns 返回一个文件代码路径信息字符串，将会存储在 dom 元素的某个 attr 中
 */
export function createDomInfoHashAttr(filePath: string, line: number, column = 0) {
  const path = `${filePath}:${line}:${column}`
  const hash = savePathToHashMap(path)
  return `${DOM_ATTR}="${hash}"`
}

export type OptionsResolved = Omit<Required<Options>, 'exclude'> & {
  exclude?: FilterPattern
}

/**
 * 解析插件配置选项
 * @param options 插件配置选项
 * @returns 返回一个解析后的配置选项
 */
export function resolveOption(options: Options): OptionsResolved {
  const mode = options.mode || 'vue'
  if (!SUPPORT_MODE.includes(mode))
    throw new Error(`dom-to-code: mode ${mode} is not supported`)

  const defaultIncludeMap: Record<SupportMode, FilterPattern> = {
    vue: [REGEX_VUE_SFC, REGEX_SETUP_SFC, REGEX_JSX_FILE],
    react: [REGEX_JSX_FILE],
  }

  return {
    mode,
    openComponentFilePath: options.openComponentFilePath ?? false,
    include: options.include || defaultIncludeMap[mode],
    exclude: options.exclude || [/node_modules/, /\.git/, /\.nuxt/],
  }
}

/**
 * 处理 jsx ast
 */
export function parseJSXIdentifier(name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName): string {
  if (name.type === 'JSXIdentifier')
    return name.name || ''
  else if (name.type === 'JSXNamespacedName')
    return parseJSXIdentifier(name.name) || ''
  else
    return `${parseJSXIdentifier(name.object)}.${parseJSXIdentifier(name.property)}`
}

/**
 * 获取 jsx 元素 tag 名称
 * @param openingElement jsx 元素
 * @returns jsx 元素名称 <div></div> 返回 div, <React.Fragment></React.Fragment> 返回 React.Fragment
 */
export function getJsxElementName(openingElement: JSXOpeningElement) {
  return parseJSXIdentifier(openingElement.name)
}

/**
 * 判断对象是否拥有某个 key
 * @param obj 对象
 * @param key key
 * @returns 返回一个布尔值，表示对象是否拥有某个 key
 */
export function hasOwn(obj: any, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * 根据编译后的魔法字符串，生成代码和 sourceMap
 * @param s 魔法字符串
 * @param id 文件路径
 * @returns 返回一个包含代码和 sourceMap 的对象
 */
export const getTransformResult = (
  s: MagicString | undefined,
  id: string,
): TransformResult => {
  return {
    code: s?.toString() || '',
    get map() {
      return s?.generateMap({
        source: id,
        includeContent: true,
        hires: true,
      })
    },
  }
}

/**
 * 字符串、数字或对象转成哈希字符串
 * @param val 字符串、数字或对象
 * @returns 哈希字符串
 */
export function valToHash(val: string | number | Object): string {
  const str = typeof val === 'string' ? val : JSON.stringify(val)
  let hash = 0
  if (str.length === 0)
    return `h${hash}`
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `h${hash}`
}
