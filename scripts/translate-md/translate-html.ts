import type { GoogleTranslateOptions } from './translate-utils'
import { googleTranslate } from './translate-utils'

/**
 * 翻译 html 内容配置
 */
interface TranslateHtmlOptions extends GoogleTranslateOptions {

  /**
   * html 内容
   */
  htmlContent: string
}

/**
 * 翻译 html 内容
 * @param options 配置
 */
export async function translateHtml(options: TranslateHtmlOptions): Promise<string> {
  const { htmlContent, sourceLang, targetLang, useSystemProxy } = options

  const { unified } = await import('unified')
  const { default: parse } = await import('rehype-parse')
  const { default: stringify } = await import('rehype-stringify')
  const { visit } = await import('unist-util-visit')

  const processor = unified()
    .use(parse, {
      fragment: true,
      verbose: true,
    })
    .use(stringify, {
      allowDangerousHtml: true,
    })

  const tree = processor.parse(htmlContent)

  // html 里的纯文字文本
  const translateTexts: string[] = []

  // 收集纯文字文本
  visit(tree, 'text', (node) => {
    translateTexts.push(node.value)
  })

  // 翻译纯文字文本
  const translateTextsResult: string[] = await Promise.all(translateTexts.map((text) => {
    return googleTranslate(text, {
      sourceLang,
      targetLang,
      useSystemProxy,
    })
  }))

  // 替换纯文字文本
  let index = 0
  visit(tree, 'text', (node) => {
    node.value = translateTextsResult[index]
    index++
  })

  return processor.stringify(tree)
}

