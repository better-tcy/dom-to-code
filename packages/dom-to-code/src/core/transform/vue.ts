// see: https://github.com/webfansplz/vite-plugin-vue-inspector/blob/main/src/compiler/template.ts
import MagicString from 'magic-string'
import { parse as vueParse, transform as vueTransform } from '@vue/compiler-dom'
import { parse as babelParse, traverse as babelTraverse } from '@babel/core'
import vueJsxPlugin from '@vue/babel-plugin-jsx'
import typescriptPlugin from '@babel/plugin-transform-typescript'
import importMeta from '@babel/plugin-syntax-import-meta'
import type { Thenable, TransformResult } from 'unplugin'
import { createDomAttrLineInfo, getTransformResult, hasOwn, parseJSXIdentifier } from '../helpers'
import type { VueQuery } from '../types'
import { DOM_ATTR } from '../constant'

const EXCLUDE_TAG = ['template', 'script', 'style']
interface CompileSFCTemplateOptions {
  code: string
  id: string
  type: 'template' | 'jsx'
}

/**
 * 编译 vue 代码文件
 * @param code 代码
 * @param id 代码对应的文件全路径
 * @param type 文件类型
 * @returns 构建结果 {code: string, map: any}
 */
async function compileSFCTemplate(
  { code, id, type }: CompileSFCTemplateOptions,
): Promise<TransformResult> {
  const s = new MagicString(code)

  switch (type) {
    case 'template': {
      const ast = vueParse(code, { comments: true })
      vueTransform(ast, {
        nodeTransforms: [
          (node) => {
            if (node.type === 1) {
              if (node.tagType === 0 && !EXCLUDE_TAG.includes(node.tag)) {
                if (node.loc.source.includes(DOM_ATTR))
                  return

                const insertPosition = node.loc.start.offset + node.tag.length + 1
                const { line, column } = node.loc.start

                // const content = ` data-v-inspector-file="${id}" data-v-inspector-line=${line} data-v-inspector-column=${column} data-v-inspector-title="${base}"`
                const content = ` ${createDomAttrLineInfo(id, line, column)}`

                s.prependLeft(
                  insertPosition,
                  content)
              }
            }
          },
        ],
      })

      break
    }

    case 'jsx': {
      const ast = babelParse(code, {
        babelrc: false,
        comments: true,
        plugins: [
          importMeta,
          [vueJsxPlugin, {}],
          [
            typescriptPlugin,
            { isTSX: true, allowExtensions: true },
          ],
        ],
      })

      babelTraverse(ast, {
        enter({ node }) {
          if (node.type === 'JSXElement') {
            if (node.openingElement.attributes.some(attr => attr.type !== 'JSXSpreadAttribute' && attr.name.name === DOM_ATTR,
            ))
              return

            const insertPosition = (node.start || 0) + parseJSXIdentifier(node.openingElement.name as any).length + 1
            const { line = 1, column = 0 } = node.loc?.start || {}

            // const content = ` data-v-inspector-file="${id}" data-v-inspector-line={${line}} data-v-inspector-column={${column}} data-v-inspector-title="${base}"`
            const content = ` ${createDomAttrLineInfo(id, line, column)}`

            s.prependLeft(
              insertPosition,
              content)
          }
        },
      })
      break
    }

    default:
      break
  }

  return getTransformResult(s, id)
}

/**
 * 解析文件路径
 * @param id 要解析的文件路径
 * @returns 返回文件路径和其它信息
 */
function parseVueRequest(id: string) {
  // 文件全路径
  const [filename] = id.split('?', 2)

  const url = new URL(id, 'http://domain.inspector')

  // vite 的 query  参数
  const query = Object.fromEntries(url.searchParams.entries()) as VueQuery
  if (query.vue != null)
    query.vue = true

  if (query.src != null)
    query.src = true

  if (query.index != null)
    query.index = Number(query.index)

  if (query.raw != null)
    query.raw = true

  if (hasOwn(query, 'lang.tsx') || hasOwn(query, 'lang.jsx'))
    query.isJsx = true

  return {
    filename,
    query,
  }
}

/**
 * 转换 vue 项目
 * @param code 代码
 * @param id 代码对应的文件全路径
 * @returns 构建结果 {code: string, map: any}
 */
export function transformVue(code: string, id: string): Thenable<TransformResult> {
  const { filename, query } = parseVueRequest(id)

  const isJsx = filename.endsWith('.jsx') || filename.endsWith('.tsx') || (filename.endsWith('.vue') && query.isJsx)
  const isTpl = filename.endsWith('.vue') && query.type !== 'style'

  if (isJsx || isTpl)
    return compileSFCTemplate({ code, id: filename, type: isJsx ? 'jsx' : 'template' })

  return { code }
}
