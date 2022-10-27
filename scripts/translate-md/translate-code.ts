import { createReplacer } from './replacer'
import type { GoogleTranslateOptions } from './utils'
import { betterTranslate } from './utils'

/**
 * 翻译 code 注释配置
 */
interface TranslateCodeOptions extends GoogleTranslateOptions {

  /**
   * code 内容
   */
  codeContent: string

  /**
   * code 语言
   */
  codeLang: string
}

/**
 * 翻译 code 注释
 * @param options 配置
 */
export async function translateCode(options: TranslateCodeOptions): Promise<string> {
  const { codeLang, codeContent, sourceLang, targetLang, useSystemProxy } = options

  const translate = (str: string) => {
    const englishLangReg = /^[\s\w\d\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E?><;,\{\}\[\]\-_\+=!@\#\$%^&\*\|\'\(\)\.\/\*]*$/g

    if (englishLangReg.test(str)) {
      // 如果内容全是全英文，直接返回，防止错误修改英文代码注释
      // console.log('全英文', str)
      return Promise.resolve(str)
    }

    // console.log('要翻译', targetLang, str)

    return betterTranslate(str, {
      sourceLang,
      targetLang,
      useSystemProxy,
    })
  }

  const jsLikeCommentRegExp = /(\/\/\s*)(.*)|(\/\*+\s*)([\s\S]*?)(\s*\*+\/)/g
  const jsLikeCommentReplacer = createReplacer(codeContent, jsLikeCommentRegExp, (matchResult, translateResult) => {
    const isInlineComment = Boolean(matchResult[1])
    const inlineCommentContent = matchResult[2] || ''
    const multiLineCommentContent = matchResult[4] || ''

    const forTranslateContent = isInlineComment ? inlineCommentContent : multiLineCommentContent
    const forReturnReplacerContent = isInlineComment ? `${matchResult[1]}${translateResult}` : `${matchResult[3]}${translateResult}${matchResult[5]}`

    return [forTranslateContent, forReturnReplacerContent]
  }, translate)

  const cssLikeCommentRegExp = /(\/\*+\s*)([\s\S]*?)(\s*\*+\/)/g
  const cssLikeCommentReplacer = createReplacer(codeContent, cssLikeCommentRegExp, (matchResult, translateResult) => {
    const forTranslateContent = matchResult[2] || ''
    const forReturnReplacerContent = `${matchResult[1]}${translateResult}${matchResult[3]}`
    return [forTranslateContent, forReturnReplacerContent]
  }, translate)

  const htmlLikeCommentRegExp = /(<!--+\s*)([\s\S]*?)(\s*-+->)/g
  const htmlLikeCommentReplacer = createReplacer(codeContent, htmlLikeCommentRegExp, (matchResult, translateResult) => {
    const forTranslateContent = matchResult[2] || ''
    const forReturnReplacerContent = `${matchResult[1]}${translateResult}${matchResult[3]}`
    return [forTranslateContent, forReturnReplacerContent]
  }, translate)

  const codeLangCommentContentRegExpMap: Record<string, ReturnType<typeof createReplacer>> = {
    js: jsLikeCommentReplacer,
    ts: jsLikeCommentReplacer,
    jsx: jsLikeCommentReplacer,
    tsx: jsLikeCommentReplacer,
    css: cssLikeCommentReplacer,
    scss: cssLikeCommentReplacer,
    less: cssLikeCommentReplacer,
    html: htmlLikeCommentReplacer,
    md: htmlLikeCommentReplacer,
  }

  const getCommentTranslateResult = codeLangCommentContentRegExpMap[codeLang] || jsLikeCommentReplacer

  return getCommentTranslateResult()
}
