import type { RequestHandler } from 'express'
import launch from 'launch-editor'
import type { Connect } from 'vite'
import { OPEN_CODE_API } from './constant'

/**
 * webpack 的中间件，基于 express
 * @param req 请求
 * @param res 响应
 * @param next 下一个中间件
 */
export const launchEditorMiddleware: RequestHandler = (req, res, next) => {
  if (req.url.startsWith(OPEN_CODE_API)) {
    const filePath = typeof req.query.filePath === 'string' ? req.query.filePath : ''

    if (!filePath) {
      res.statusCode = 500
      res.end('launch-editor-middleware: required query param "filePath" is missing.')
    }
    else {
      launch(filePath, () => console.log(
        'To specify an editor, specify the EDITOR env variable',
      ))
      res.end()
    }
  }
  else {
    next()
  }
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
    const filePath = typeof query.filePath === 'string' ? query.filePath : ''

    if (!filePath) {
      res.statusCode = 500
      res.end('launch-editor-middleware: required query param "filePath" is missing.')
    }
    else {
      launch(filePath, () => console.log(
        'To specify an editor, specify the EDITOR env variable',
      ))
      res.end()
    }
  }
  else {
    next()
  }
}
