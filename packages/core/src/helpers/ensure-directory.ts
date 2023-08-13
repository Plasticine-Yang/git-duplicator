import { existsSync } from 'node:fs'
import { mkdir, readdir } from 'node:fs/promises'

/**
 * 确保目录存在且为空目录，不存在则进行创建
 */
async function ensureDirectoryEmpty(path: string) {
  try {
    const isExist = existsSync(path)

    if (!isExist) {
      await mkdir(path)
      return true
    }

    const isEmptyDirectory = (await readdir(path)).length === 0

    return isEmptyDirectory
  } catch (error) {
    console.error('ensureDirectory error', error)
    return false
  }
}

export { ensureDirectoryEmpty }
