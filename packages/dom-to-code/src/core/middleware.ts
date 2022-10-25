import type { IncomingMessage, ServerResponse } from 'http'
import type { RequestHandler, Response } from 'express'
import launch from 'launch-editor'
import type { Connect } from 'vite'
import { OPEN_CODE_API } from './constant'
import { getPathFromHashMap, getPluginOptions } from './env'

function handleOpenFileRequest(query: Record<string, string | undefined>, res: Response | ServerResponse<IncomingMessage>) {
  const filePathId = typeof query.filePathId === 'string' ? (query.filePathId || '') : ''
  const componentFilePathId = typeof query.componentFilePathId === 'string' ? query.componentFilePathId : ''
  const options = getPluginOptions()
  const shouldOpenFilePathId = options.openComponentFilePath ? (componentFilePathId || filePathId) : filePathId
  const shouldOpenFilePath = getPathFromHashMap(shouldOpenFilePathId)

  if (!shouldOpenFilePath) {
    res.statusCode = 500
    res.end('launch-editor-middleware: required query param "filePath" is missing.')
  }

  else {
    launch(shouldOpenFilePath, () => console.log(
      'To specify an editor, specify the EDITOR env variable',
    ))
    res.end(shouldOpenFilePath)
  }
}

/**
 * webpack 的中间件，基于 express
 * @param req 请求
 * @param res 响应
 * @param next 下一个中间件
 */
export const launchEditorMiddleware: RequestHandler = (req, res, next) => {
  if (req.url.startsWith(OPEN_CODE_API))
    handleOpenFileRequest(req.query as Record<string, string | undefined>, res)

  else
    next()
}

/**
 * vite 的中间件，基于 node 的 http 模块
 * @param req 请求
 * @param res 响应
 * @param next 下一个中间件
 */
export const launchEditorMiddlewareForVite: Connect.NextHandleFunction = (req, res, next) => {
  if (req.url?.startsWith(OPEN_CODE_API)) {
    const url = new URL(req.url, 'http://domain.inspector')
    const query = Object.fromEntries(url.searchParams.entries())
    handleOpenFileRequest(query, res)
  }
  else {
    next()
  }
}
