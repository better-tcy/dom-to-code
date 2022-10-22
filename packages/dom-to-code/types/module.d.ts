declare module 'launch-editor' {
  /**
   * 启动任意编辑器
   * @param filePath 文件全路径
   * @param specifiedEditor 指定编辑器或错误回调
   * @param onErrorCallback 错误回调
   */
  const launch: (filePath: string, specifiedEditor?: string | ((error: Error) => void), onErrorCallback?: (error: Error) => void) => void
  export default launch
}

declare module '@babel/plugin-transform-typescript' {
  const plugin: any
  export default plugin
}

declare module '@babel/plugin-syntax-import-meta' {
  const plugin: any
  export default plugin
}