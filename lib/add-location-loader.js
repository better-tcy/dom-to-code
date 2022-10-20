function addLineAttr(lineStr, line, resourcePath) {
  let newLineStr = lineStr
  const reg = /<[\w-]+/g
  let leftTagList = newLineStr.match(reg)

  if (leftTagList) {
    leftTagList = Array.from(new Set(leftTagList))
    leftTagList.forEach(item => {
      if (item && item.indexOf('template') === -1) {
        const regx = new RegExp(`${item}`, 'g')
        const location = `${item} code-location="${resourcePath}:${line}"`
        newLineStr = newLineStr.replace(regx, location)
      }
    })
  }
  return newLineStr
}

function codeLineTrack(str, resourcePath) {
  const lineList = str.split('\n')
  const newList = []
  lineList.forEach((item, index) => {
    newList.push(addLineAttr(item, index + 1, resourcePath))
  })
  return newList.join('\n')
}

module.exports = function (source) {
  const { resourcePath } = this
  const pathBefore = __dirname.substring(0, __dirname.search('node_modules'))
  const filePath = resourcePath.substring(pathBefore.length)
  return codeLineTrack(source, filePath)
}