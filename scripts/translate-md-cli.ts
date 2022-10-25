import type { Lang } from './translate-md'
import { translateMarkdownFile } from './translate-md'

function cliMain() {
  const args = process.argv.slice(2)
  const sourcePath = args[0]
  const sourceLang: Lang = args[1] as Lang || 'zh-CN'
  const targetLang: Lang = args[2] as Lang || 'en'

  if (!sourcePath || !sourceLang || !targetLang) {
    console.log('Usage: translate-md <sourcePath> <sourceLang> <targetLang>')
    return
  }

  translateMarkdownFile({
    path: sourcePath,
    sourceLang,
    targetLang,
  })
}

cliMain()
