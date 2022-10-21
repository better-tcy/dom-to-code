import child_process from 'child_process'

function openCodeFile(path: string) {
  const pathBefore = __dirname.substring(0, __dirname.search('node_modules'))
  const filePath = pathBefore + path
  child_process.exec(`code -r -g ${filePath}`)
}

export default function (app: any) {
  app.get('/code', (req: any) => {
    if (req.query.filePath)
      openCodeFile(req.query.filePath)
  })
}
