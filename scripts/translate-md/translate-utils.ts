import translate from '@vitalets/google-translate-api'
import deepl from 'deepl'
import type { Options as GotOptions } from 'got'

const langsMap = {
  'auto': 'Automatic',
  'af': 'Afrikaans',
  'sq': 'Albanian',
  'am': 'Amharic',
  'ar': 'Arabic',
  'hy': 'Armenian',
  'as': 'Assamese',
  'ay': 'Aymara',
  'az': 'Azerbaijani',
  'bm': 'Bambara',
  'eu': 'Basque',
  'be': 'Belarusian',
  'bn': 'Bengali',
  'bho': 'Bhojpuri',
  'bs': 'Bosnian',
  'bg': 'Bulgarian',
  'ca': 'Catalan',
  'ceb': 'Cebuano',
  'ny': 'Chichewa',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'co': 'Corsican',
  'hr': 'Croatian',
  'cs': 'Czech',
  'da': 'Danish',
  'dv': 'Dhivehi',
  'doi': 'Dogri',
  'nl': 'Dutch',
  'en': 'English',
  'eo': 'Esperanto',
  'et': 'Estonian',
  'ee': 'Ewe',
  'tl': 'Filipino',
  'fi': 'Finnish',
  'fr': 'French',
  'fy': 'Frisian',
  'gl': 'Galician',
  'ka': 'Georgian',
  'de': 'German',
  'el': 'Greek',
  'gn': 'Guarani',
  'gu': 'Gujarati',
  'ht': 'Haitian Creole',
  'ha': 'Hausa',
  'haw': 'Hawaiian',
  'iw': 'Hebrew',
  'hi': 'Hindi',
  'hmn': 'Hmong',
  'hu': 'Hungarian',
  'is': 'Icelandic',
  'ig': 'Igbo',
  'ilo': 'Ilocano',
  'id': 'Indonesian',
  'ga': 'Irish',
  'it': 'Italian',
  'ja': 'Japanese',
  'jw': 'Javanese',
  'kn': 'Kannada',
  'kk': 'Kazakh',
  'km': 'Khmer',
  'ko': 'Korean',
  'kri': 'Krio',
  'ku': 'Kurdish (Kurmanji)',
  'ckb': 'Kurdish (Sorani)',
  'ky': 'Kyrgyz',
  'lo': 'Lao',
  'la': 'Latin',
  'lv': 'Latvian',
  'ln': 'Lingala',
  'lt': 'Lithuanian',
  'lg': 'Luganda',
  'lb': 'Luxembourgish',
  'mk': 'Macedonian',
  'mai': 'Maithili',
  'mg': 'Malagasy',
  'ms': 'Malay',
  'ml': 'Malayalam',
  'mt': 'Maltese',
  'mi': 'Maori',
  'mr': 'Marathi',
  'mni-Mtei': 'Meiteilon (Manipuri)',
  'lus': 'Mizo',
  'mn': 'Mongolian',
  'my': 'Myanmar (Burmese)',
  'ne': 'Nepali',
  'no': 'Norwegian',
  'ps': 'Pashto',
  'fa': 'Persian',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'pa': 'Punjabi',
  'qu': 'Quechua',
  'ro': 'Romanian',
  'ru': 'Russian',
  'sm': 'Samoan',
  'sa': 'Sanskrit',
  'gd': 'Scots Gaelic',
  'nso': 'Sepedi',
  'sr': 'Serbian',
  'st': 'Sesotho',
  'sn': 'Shona',
  'sd': 'Sindhi',
  'si': 'Sinhala',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'so': 'Somali',
  'es': 'Spanish',
  'su': 'Sundanese',
  'sw': 'Swahili',
  'sv': 'Swedish',
  'tg': 'Tajik',
  'ta': 'Tamil',
  'tt': 'Tatar',
  'te': 'Telugu',
  'th': 'Thai',
  'ti': 'Tigrinya',
  'ts': 'Tsonga',
  'tr': 'Turkish',
  'tk': 'Turkmen',
  'ak': 'Twi',
  'uk': 'Ukrainian',
  'ur': 'Urdu',
  'ug': 'Uyghur',
  'uz': 'Uzbek',
  'vi': 'Vietnamese',
  'cy': 'Welsh',
  'xh': 'Xhosa',
  'yi': 'Yiddish',
  'yo': 'Yoruba',
  'zu': 'Zulu',
} as const

/**
 * 谷歌翻译支持的语言
 */
export type Lang = keyof typeof langsMap

export interface BaseTranslateOption {
  /**
   * 源文件语言
   */
  sourceLang: Lang

  /**
   * 目标文件语言
   */
  targetLang: Lang
}

/**
 * 谷歌翻译配置
 */
export interface GoogleTranslateOptions extends BaseTranslateOption {
  /**
   * 是否自动使用系统代理
   * @default true
   */
  useSystemProxy?: boolean
}

/**
 * 谷歌翻译文本
 * @param content 要翻译的文本
 * @param options 翻译配置
 * @returns 翻译后的文本
 */
export async function googleTranslate(content: string, options: GoogleTranslateOptions) {
  const { HttpsProxyAgent } = await import('hpagent')
  const { sourceLang, targetLang, useSystemProxy = true } = options

  if (!content || !content.trim())
    return content || ''

  // 系统环境变量 http 代理
  const HTTP_PROXY = process.env.HTTP_PROXY || process.env.http_proxy || ''

  // 系统环境变量 https 代理
  const HTTPS_PROXY = process.env.HTTPS_PROXY || process.env.https_proxy || ''

  // 谷歌翻译使用系统代理
  const gotOpt: Partial<GotOptions> = useSystemProxy && HTTP_PROXY
    ? {
        agent: {
          http: new HttpsProxyAgent({
            keepAlive: true,
            keepAliveMsecs: 1000,
            maxSockets: 256,
            maxFreeSockets: 256,
            scheduling: 'lifo',
            proxy: HTTP_PROXY,
          }),
          https: new HttpsProxyAgent({
            keepAlive: true,
            keepAliveMsecs: 1000,
            maxSockets: 256,
            maxFreeSockets: 256,
            scheduling: 'lifo',
            proxy: HTTPS_PROXY,
          }),
        },
      }
    : {}

  return new Promise<string>((resolve, reject) => {
    translate(content, { from: sourceLang, to: targetLang }, gotOpt).then(res => resolve(res.text)).catch(reject)
  })
}

export interface DeeplTranslateOptions extends BaseTranslateOption {
}

/**
 * deepl 翻译文本
 * @param content 要翻译的文本
 * @param options 翻译配置
 * @returns 翻译后的文本
 */
export async function deeplTranslate(content: string, options: GoogleTranslateOptions) {
  const googleLangDeeplLangMap = {
    'en': 'EN',
    'zh-CN': 'ZH',
    'zh-TW': 'ZH',
    'ja': 'JA',
    'fr': 'FR',
    'es': 'ES',
    'pt': 'PT',
    'de': 'DE',
    'it': 'IT',
    'ru': 'RU',
    'pl': 'PL',
    'nl': 'NL',
    'el': 'EL',
    'bg': 'BG',
    'cs': 'CS',
    'da': 'DA',
    'et': 'ET',
    'fi': 'FI',
    'hu': 'HU',
    'lt': 'LT',
    'lv': 'LV',
    'ro': 'RO',
    'sk': 'SK',
    'sl': 'SL',
    'sv': 'SV',
  } as Record<Lang, deepl.DeeplLanguages>

  return deepl({
    free_api: true,
    auth_key: process.env.DEEPL_AUTH_KEY || '',
    target_lang: googleLangDeeplLangMap[options.targetLang] || 'EN',
    source_lang: googleLangDeeplLangMap[options.sourceLang] || 'ZH',
    text: content,
  }).then(res => Promise.resolve(res.data?.translations?.map?.(t => t.text).join('') ?? content))
}

export type BetterTranslateOptions = {
  /**
   * 翻译接口
   * @default deepl
   */
  type?: 'google' | 'deepl'
} & GoogleTranslateOptions & DeeplTranslateOptions

export async function betterTranslate(content: string, options: BetterTranslateOptions) {
  const { type = 'deepl', ...otherOptions } = options
  if (type === 'deepl')
    return deeplTranslate(content, otherOptions)

  else
    return googleTranslate(content, otherOptions)
}
