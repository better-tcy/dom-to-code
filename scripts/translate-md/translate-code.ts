import type { GoogleTranslateOptions } from './translate-utils'
import { betterTranslate } from './translate-utils'

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

  // 判断是否是全英文

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

  type ForTranslateStr = string
  type ForReturnToReplaceStr = string
  type ReplaceFn = (matchResult: string[], translateResult: string) => [ForTranslateStr, ForReturnToReplaceStr]

  const createReplace = (str: string, reg: RegExp, replaceFn: ReplaceFn): () => Promise<string> => {
    return () => new Promise<string>((resolve, reject) => {
      const promises: Promise<string>[] = []

      str.replace(reg, (...args) => {
        const [forTransLateStr] = replaceFn(args, '')
        promises.push(translate(forTransLateStr))
        return ''
      })

      Promise.all(promises).then((results) => {
        resolve(str.replace(reg, (...args) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, forReturnToReplaceStr] = replaceFn(args, results.shift()!)
          return forReturnToReplaceStr
        }))
      }).catch(reject)
    })
  }

  const jsLikeCommentRegExp = /(\/\/\s*)(.*)|(\/\*+\s*)([\s\S]*?)(\s*\*+\/)/g
  const jsLikeCommentReplacer = createReplace(codeContent, jsLikeCommentRegExp, (matchResult, translateResult) => {
    const isInlineComment = Boolean(matchResult[1])
    const inlineCommentContent = matchResult[2] || ''
    const multiLineCommentContent = matchResult[4] || ''

    const forTranslateContent = isInlineComment ? inlineCommentContent : multiLineCommentContent
    const forReturnReplacerContent = isInlineComment ? `${matchResult[1]}${translateResult}` : `${matchResult[3]}${translateResult}${matchResult[5]}`

    return [forTranslateContent, forReturnReplacerContent]
  })

  const cssLikeCommentRegExp = /(\/\*+\s*)([\s\S]*?)(\s*\*+\/)/g
  const cssLikeCommentReplacer = createReplace(codeContent, cssLikeCommentRegExp, (matchResult, translateResult) => {
    const forTranslateContent = matchResult[2] || ''
    const forReturnReplacerContent = `${matchResult[1]}${translateResult}${matchResult[3]}`
    return [forTranslateContent, forReturnReplacerContent]
  })

  const htmlLikeCommentRegExp = /(<!--+\s*)([\s\S]*?)(\s*-+->)/g
  const htmlLikeCommentReplacer = createReplace(codeContent, htmlLikeCommentRegExp, (matchResult, translateResult) => {
    const forTranslateContent = matchResult[2] || ''
    const forReturnReplacerContent = `${matchResult[1]}${translateResult}${matchResult[3]}`
    return [forTranslateContent, forReturnReplacerContent]
  })

  const codeLangCommentContentRegExpMap: Record<string, ReturnType<typeof createReplace>> = {
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
