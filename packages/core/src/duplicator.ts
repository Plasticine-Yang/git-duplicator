import { mkdir } from 'fs/promises'
import { rimraf } from 'rimraf'
import { extract } from 'tar'

import type { DuplicateOptions } from '@git-duplicator/types'

import { fetchGitRefs } from './fetch-refs'
import { ensureDirectoryEmpty } from './helpers'
import { fetch } from './node-lib'

const DEFAULT_OPTIONS: Required<DuplicateOptions> = {
  shouldOverwrite: false,
}

/**
 * ## 复制源码到指定目录下
 *
 * @param src Plasticine-Yang/templates
 * @param dest .
 * @param options {}
 */
async function duplicate(src: string, dest: string, options?: DuplicateOptions) {
  const { shouldOverwrite } = resolveOptions(options)

  // 1. 下载仓库源码的 tar 包到临时目录中
  const repoUrl = `https://github.com/${src}`
  const gitRefs = await fetchGitRefs(repoUrl)
  const headRefHash = Object.entries(gitRefs)
    .find(([, ref]) => ref === 'HEAD')
    ?.at(0)

  if (headRefHash !== undefined) {
    let shouldWrite = false
    const tarballUrl = `${repoUrl}/archive/${headRefHash}.tar.gz`

    const [response, ensured] = await Promise.all([
      // 获取源码 tar 包
      fetch(tarballUrl),

      // 确保 dest 目录存在且为空目录
      ensureDirectoryEmpty(dest),
    ])

    if (ensured) {
      // 确认是空目录 or 目录不存在但创建了一个空目录
      shouldWrite = true
    } else if (shouldOverwrite) {
      // 目录不为空但确认进行覆盖
      const removed = await rimraf(dest)
      if (removed) {
        await mkdir(dest)
        shouldWrite = true
      }
    }

    if (shouldWrite) {
      response
        .pipe(
          extract({
            cwd: dest,
            strip: 1,
          }),
        )
        .on('close', () => {
          console.log('duplicate successfully!')
        })
        .on('error', (error) => {
          console.error('duplicate error', error)
        })
    }
  } else {
    throw new Error("Can't find HEAD ref hash")
  }

  // 2. 解压 tar 包
}

function resolveOptions(options?: DuplicateOptions): Required<DuplicateOptions> {
  return {
    shouldOverwrite: options?.shouldOverwrite ?? DEFAULT_OPTIONS.shouldOverwrite,
  }
}

export { duplicate }
