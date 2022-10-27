import fs from 'fs'
import path from 'path'
import type { Code, HTML, Text } from 'mdast'
import { translateHtml } from './translate-html'
import type { BetterTranslateOptions, Lang } from './utils'
import { betterTranslate } from './utils'
import { translateCode } from './translate-code'

/**
 * 翻译 markdown 内容配置
 */
interface TranslateMarkdownOptions extends BetterTranslateOptions {

  /**
   * markdown 内容
   */
  markdownContent: string
}

/**
 * 翻译 markdown 内容
 * @param options 配置
 */
// translate markdown content
export async function translateMarkdown(options: TranslateMarkdownOptions): Promise<string> {
  const { markdownContent, sourceLang, targetLang, useSystemProxy } = options

  const { unified } = await import('unified')
  const { default: markdownParse } = await import('remark-parse')
  const { default: stringify } = await import('remark-stringify')
  const { visit } = await import('unist-util-visit')
  const { default: gfm } = await import('remark-gfm')
  const { default: math } = await import('remark-math')

  const processor = unified()
    .use(markdownParse)
    .use(gfm)
    .use(math)
    .use(stringify)

  const tree = processor.parse(markdownContent)

  // markdown 里的纯文字节点
  const translateTextNodes: Text[] = []

  // markdown 里的 html 文本
  const translateHtmlNodes: HTML[] = []

  // markdown 里的 code 节点
  const translateCodeNodes: Code[] = []

  // 收集纯文字文本
  visit(tree, ['text', 'html', 'code'], (node) => {
    node.type === 'text' && translateTextNodes.push(node)
    node.type === 'html' && translateHtmlNodes.push(node)
    node.type === 'code' && translateCodeNodes.push(node)
  })

  // 翻译纯文字文本
  const translateTextsResult: string[] = await Promise.all(translateTextNodes.map((text) => {
    return betterTranslate(text.value, {
      sourceLang,
      targetLang,
      useSystemProxy,
    })
  }))

  // 翻译 html 里的文本
  const translateHtmlsResult: string[] = await Promise.all(translateHtmlNodes.map((html) => {
    return translateHtml({
      htmlContent: html.value,
      sourceLang,
      targetLang,
      useSystemProxy,
    })
  }))

  // 翻译 code 里的注释
  const translateCodesResult: string[] = await Promise.all(translateCodeNodes.map((code) => {
    return translateCode({
      codeContent: code.value,
      codeLang: code.lang || 'js',
      sourceLang,
      targetLang,
      useSystemProxy,
    })
  }))

  // 把翻译后的文字覆盖回原位置
  let textIndex = 0
  let htmlIndex = 0
  let codeIndex = 0
  visit(tree, ['text', 'html', 'code'], (node) => {
    if (node.type === 'text') {
      node.value = translateTextsResult[textIndex]
      textIndex++
    }

    if (node.type === 'html') {
      node.value = translateHtmlsResult[htmlIndex]
      htmlIndex++
    }

    if (node.type === 'code') {
      node.value = translateCodesResult[codeIndex]
      codeIndex++
    }
  })

  return processor.stringify(tree)
}

/**
 * 翻译 markdown 文件配置
 */
export interface TranslateMarkdownFileOptions extends BetterTranslateOptions {
  /**
   * 文件路径
   */
  path: string

  /**
   * 计算最终输出的文件路径函数
   * @param sourceDirPath 原文件目录
   * @param sourceName 原文件名
   * @param targetLang 目标语言
   */
  buildOutputPath?: (sourceDirPath: string, sourceName: string, targetLang: Lang) => string
}

/**
 * 翻译 markdown 文件
 */
export async function translateMarkdownFile(options: TranslateMarkdownFileOptions) {
  const {
    path: sourcePath,
    sourceLang,
    targetLang,
    buildOutputPath = (sourceDirPath, sourceName, targetLang) => path.resolve(sourceDirPath, `${sourceName}_${targetLang}.md`),
  } = options

  const sourceDirPath = path.dirname(sourcePath)
  const sourceName = path.basename(sourcePath, path.extname(sourcePath))
  const outputPath = buildOutputPath(sourceDirPath, sourceName, targetLang)

  const markdownContent = fs.readFileSync(sourcePath, 'utf8')
  const translatedContent = await translateMarkdown({ markdownContent, sourceLang, targetLang })

  fs.writeFileSync(outputPath, translatedContent)
}
