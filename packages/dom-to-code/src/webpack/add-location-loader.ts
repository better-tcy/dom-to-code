function addLineAttr(lineStr: string, line: number | string, resourcePath: string) {
  let newLineStr = lineStr
  const reg = /<[\w-]+/g
  let leftTagList = newLineStr.match(reg)

  if (leftTagList) {
    leftTagList = Array.from(new Set(leftTagList))
    leftTagList.forEach((item) => {
      if (item && !item.includes('template')) {
        const regx = new RegExp(`${item}`, 'g')
        const location = `${item} code-location="${resourcePath}:${line}"`
        newLineStr = newLineStr.replace(regx, location)
      }
    })
  }
  return newLineStr
}

function codeLineTrack(str: string, resourcePath: string) {
  const lineList = str.split('\n')
  const newList: string[] = []
  lineList.forEach((item, index) => {
    newList.push(addLineAttr(item, index + 1, resourcePath))
  })
  return newList.join('\n')
}

export function addLocationLoader(this: { resourcePath: string }, source: string) {
  const { resourcePath } = this
  const pathBefore = __dirname.substring(0, __dirname.search('node_modules'))
  const filePath = resourcePath.substring(pathBefore.length)
  return codeLineTrack(source, filePath)
}
