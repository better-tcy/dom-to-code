import fs from 'fs'
import path from 'path'
import { debounce } from './helpers'

export interface FileStorageOptions {
  storageFilePath: string
}

export class FileStorage implements Storage {
  private storageFilePath: string
  private map: Record<string, string> = {}

  public get length(): number {
    return Object.keys(this.map).length
  }

  constructor(options: FileStorageOptions) {
    this.storageFilePath = options.storageFilePath

    // 确保文件夹存在
    const storageFileDirPath = path.dirname(this.storageFilePath)
    if (!fs.existsSync(storageFileDirPath))
      fs.mkdirSync(storageFileDirPath, { recursive: true })

    // 确保文件存在
    if (!fs.existsSync(this.storageFilePath))
      fs.writeFileSync(this.storageFilePath, '{}', 'utf8')

    this.map = this.jsonParse(fs.readFileSync(this.storageFilePath, 'utf8'))
  }

  private jsonParse(str: string) {
    try {
      return JSON.parse(str)
    }
    catch (error) {
      return {}
    }
  }

  /**
   * 将 map 写入文件
   */
  private saveMap() {
    fs.writeFileSync(this.storageFilePath, JSON.stringify(this.map), 'utf8')
  }

  /**
   * 防抖地将 map 写入文件，减少磁盘频繁读写
   */
  private saveMapDebounce = debounce(this.saveMap, 500)

  public setItem(key: string, value: string): void {
    this.map[key] = value ?? ''
    this.saveMapDebounce()
  }

  public getItem(key: string): string | null {
    return this.map[key] ?? null
  }

  public removeItem(key: string): void {
    delete this.map[key]
    this.saveMapDebounce()
  }

  public clear(): void {
    this.map = {}
    this.saveMapDebounce()
  }

  public key(index: number): string | null {
    return Object.keys(this.map)[index] ?? null
  }
}

export const cachePath = path.resolve(process.cwd(), './node_modules/.cache/dom-to-code')
export const createCachePath = (filePath: string) => path.resolve(cachePath, filePath)

export const filePathHashMapStorage = new FileStorage({ storageFilePath: createCachePath('./FILE_PATH_HASH_MAP.json') })

