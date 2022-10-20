const child_process = require('child_process')

function openCodeFile(path) {
  const pathBefore = __dirname.substring(0, __dirname.search('node_modules'))
  const filePath = pathBefore + path
  child_process.exec(`code -r -g ${filePath}`)
}

module.exports = function (app) {
  app.get('/code', function (req) {
    if (req.query.filePath) {
      openCodeFile(req.query.filePath)
    }
  })
}