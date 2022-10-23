import path from 'path'

export const pathResolve = (...paths: string[]) => path.resolve(__dirname, ...paths)
