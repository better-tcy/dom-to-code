const requestService = (filePath) => {
  import('axios').then((res) => {
    const { protocol, host } = window.location
    res.default
      .get(`${protocol}//${host}/code`, {
        params: {
          filePath: `${filePath}`
        }
      })
      .catch(error => {
        console.log(error)
      })
  })
}

function getFilePath(element) {
  if (!element || !element.getAttribute) return null
  if (element.getAttribute('code-location')) {
    return element.getAttribute('code-location')
  }
  return getFilePath(element.parentNode)
}

export default function () {
  let keyCode = ''

  document.addEventListener('keydown', (e) => {
    keyCode = e.key
  })

  document.addEventListener('mousedown', (e) => {
    if (e.button === 1 && (keyCode === 'Control' || keyCode === 'Command')) {
      e.stopImmediatePropagation();
      console.log(e.stopImmediatePropagation)
      const filePath = getFilePath(e.target)
      requestService(filePath)
      keyCode = ''
    }
  }, false)
}