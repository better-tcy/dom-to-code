import { DOM_ATTR, OPEN_CODE_API } from '../core/constant'

/**
 * 请求打开代码编辑器
 * @param filePath 页面元素代码路径信息
 */
const requestService = (filePath: string) => {
  import('axios').then((res) => {
    const { protocol, host } = window.location
    res.default
      .get(`${protocol}//${host}${OPEN_CODE_API}`, {
        params: {
          filePath: `${filePath}`,
        },
      })
      .catch((error) => {
        console.error('dom-to-code: ', error)
      })
  })
}

/**
 * 获取页面元素代码路径信息
 * @param element 页面元素
 * @returns 页面元素代码路径信息
 */
function getFilePath(element: HTMLElement | null): string | null {
  if (!element || !element.getAttribute)
    return null
  if (element.getAttribute(DOM_ATTR))
    return element.getAttribute(DOM_ATTR)

  return getFilePath(element.parentNode as HTMLElement)
}

/**
 * 初始化 dom-to-code
 */
export function initDomToCode(): void {
  let keyCode = ''

  document.addEventListener('keydown', (e) => {
    keyCode = e.key
  })

  document.addEventListener('mousedown', (e) => {
    if (e.button === 1 && (keyCode === 'Control' || keyCode === 'Meta')) {
      e.stopImmediatePropagation()
      e.preventDefault()
      e.stopPropagation()
      console.log('dom-to-code: open editor.')
      const filePath = getFilePath(e.target as HTMLElement)
      filePath && requestService(filePath)
      keyCode = ''
    }
  }, false)
}
