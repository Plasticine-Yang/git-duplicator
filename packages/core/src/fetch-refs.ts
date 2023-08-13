import type { GitRefs } from '@git-duplicator/types'

import { execPromise } from './node-lib'

async function fetchGitRefs(repoUrl: string): Promise<GitRefs> {
  try {
    const { stdout } = await execPromise(`git ls-remote ${repoUrl}`)

    // hash\tref
    const records = stdout.split('\n')

    const gitRefs: GitRefs = records.reduce((result, current) => {
      const [hash, ref] = current.split('\t')

      if (typeof hash === 'string' && typeof ref === 'string' && !(hash in result)) {
        return {
          ...result,
          [hash]: ref,
        }
      }

      return result
    }, {} as GitRefs)

    return gitRefs
  } catch (error) {
    throw new Error('fetch refs failed', { cause: error })
  }
}

export { fetchGitRefs }
