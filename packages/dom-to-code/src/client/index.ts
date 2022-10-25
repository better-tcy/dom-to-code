import { DOM_ATTR, OPEN_CODE_API } from '../core/constant'

/**
 * 请求打开代码编辑器
 * @param filePath 页面元素代码路径信息
 */
const requestService = (filePath: string) => {
  const { origin } = window.location
  fetch(`${origin}${OPEN_CODE_API}?filePath=${filePath}`).catch((error) => {
    console.error('dom-to-code: ', error)
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

function findFilePathByDom(dom: any) {
  // Host Element
  if (dom.getAttribute(DOM_ATTR))
    return dom.getAttribute(DOM_ATTR)

  // Vue3 Component
  if (dom.__vnode) {
    let vComponent = dom.__vueParentComponent
    while (!vComponent.attrs[DOM_ATTR]) vComponent = vComponent.parent
    return vComponent.attrs[DOM_ATTR]
  }

  // React Component
  const fiberKey = Object.keys(dom).find(
    key => key.startsWith('__react') && (dom as any)[key]?.stateNode === dom,
  )
  if (fiberKey) {
    let fiber = dom[fiberKey] as any
    while (!fiber.memoizedProps[DOM_ATTR]) fiber = fiber.return
    return fiber.memoizedProps[DOM_ATTR]
  }

  // Vue2 Component
  let vComponent: any = null
  let el = dom
  while (!el.__vue__ && el.parentElement) el = el.parentElement
  vComponent = el.__vue__
  if (vComponent) {
    while (!vComponent.$attrs[DOM_ATTR]) vComponent = vComponent.$parent
    return vComponent.$attrs[DOM_ATTR]
  }

  return getFilePath(dom)
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
    if ((e.button === 1 || e.button === 2) && (keyCode === 'Control' || keyCode === 'Meta')) {
      e.stopImmediatePropagation()
      e.preventDefault()
      e.stopPropagation()
      console.log('dom-to-code: open editor.')
      const filePath = findFilePathByDom(e.target)
      filePath && requestService(filePath)
      keyCode = ''
    }
  }, false)
}
