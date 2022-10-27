type ForTranslateStr = string
type ForReturnToReplaceStr = string
export type ReplaceFn = (matchResult: string[], translateResult: string) => [ForTranslateStr, ForReturnToReplaceStr]

export type processReplaceFn = (forTransLateStr: ForTranslateStr) => Promise<string>

export const createReplacer = (str: string, reg: RegExp, replaceFn: ReplaceFn, processReplace: processReplaceFn): () => Promise<string> => {
  return () => new Promise<string>((resolve, reject) => {
    const promises: Promise<string>[] = []

    str.replace(reg, (...args) => {
      const [forTransLateStr] = replaceFn(args, '')
      promises.push(processReplace(forTransLateStr))
      return ''
    })

    Promise.all(promises).then((results) => {
      resolve(str.replace(reg, (...args) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, forReturnToReplaceStr] = replaceFn(args, results.shift()!)
        return forReturnToReplaceStr
      }))
    }).catch(reject)
  })
}
