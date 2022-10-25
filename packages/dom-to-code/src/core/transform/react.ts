// see: https://github.com/sudongyuer/vite-plugin-react-inspector/blob/master/packages/vite-plugin-react-inspector/src/index.ts
import { parseSync, traverse } from '@babel/core'
import MagicString from 'magic-string'
import { createDomInfoHashAttr, getJsxElementName, parseJSXIdentifier } from '../helpers'

/**
 * 转换 react 项目
 * @param code 代码
 * @param id 代码对应的文件全路径
 * @returns 构建结果 {code: string, map: any}
 */
export const transformReact = (code: string, id: string) => {
  if ((id.endsWith('.tsx') || id.endsWith('.jsx'))) {
    const transformedCode = code
    const s = new MagicString(transformedCode)
    const ast = parseSync(code, {
      configFile: false,
      filename: id,
      ast: true,
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
    })
    traverse(ast, {
      enter({ node }) {
        if (node.type === 'JSXElement' && !getJsxElementName(node.openingElement).endsWith('Fragment')) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          if (node?.openingElement?.name?.object?.name === 'React')
            return

          const { start } = node
          const { column, line } = node?.loc?.start as any
          const toInsertPosition = (start || 0) + parseJSXIdentifier(node.openingElement.name as any).length + 1
          const content = ` ${createDomInfoHashAttr(id, line, column)}`
          s.appendLeft(toInsertPosition, content)
        }
      },
    })
    const sourceMap = s.generateMap({
      source: id,
      includeContent: true,
    })
    return {
      code: s.toString(),
      map: sourceMap,
    }
  }
}
