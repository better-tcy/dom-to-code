const requestService = (filePath: string) => {
  import('axios').then((res) => {
    const { protocol, host } = window.location
    res.default
      .get(`${protocol}//${host}/code`, {
        params: {
          filePath: `${filePath}`,
        },
      })
      .catch((error) => {
        console.log(error)
      })
  })
}

function getFilePath(element: HTMLElement | null): string | null {
  if (!element || !element.getAttribute)
    return null
  if (element.getAttribute('code-location'))
    return element.getAttribute('code-location')

  return getFilePath(element.parentNode as HTMLElement)
}

export default function () {
  let keyCode = ''

  document.addEventListener('keydown', (e) => {
    keyCode = e.key
  })

  document.addEventListener('mousedown', (e) => {
    if (e.button === 1 && (keyCode === 'Control' || keyCode === 'Meta')) {
      e.stopImmediatePropagation()
      console.log(e.stopImmediatePropagation)
      const filePath = getFilePath(e.target as HTMLElement)
      filePath && requestService(filePath)
      keyCode = ''
    }
  }, false)
}
