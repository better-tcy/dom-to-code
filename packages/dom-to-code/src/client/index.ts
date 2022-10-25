import { DOM_ATTR, OPEN_CODE_API } from '../core/constant'

/**
 * 请求打开代码编辑器
 * @param filePathId 页面元素代码路径 hash id
 * @param componentFilePathId 页面元素对应的组件文件路径 hash id
 */
const requestService = (filePathId: string, componentFilePathId: string) => {
  const { origin } = window.location
  fetch(`${origin}${OPEN_CODE_API}?filePathId=${filePathId}&componentFilePathId=${componentFilePathId}`).catch((error) => {
    console.error('dom-to-code: ', error)
  })
}

/**
 * 获取页面元素代码路径 hash id
 * @param element 页面元素
 * @returns 页面元素代码路径信息
 */
function getFilePathId(element: HTMLElement | null): string | null {
  if (!element || !element.getAttribute)
    return null
  if (element.getAttribute(DOM_ATTR))
    return element.getAttribute(DOM_ATTR)

  return getFilePathId(element.parentNode as HTMLElement)
}

/**
 * 根据页面元素获取组件文件路径 hash id
 * @param dom 页面元素
 * @returns 返回组件对应的路径
 */
function findComponentFilePathIdByDom(dom: any) {
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

  return getFilePathId(dom)
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
      const filePathId = getFilePathId(e.target as HTMLElement)
      const componentFilePathId = findComponentFilePathIdByDom(e.target)
      filePathId && requestService(filePathId, componentFilePathId)
      keyCode = ''
    }
  }, true)
}
