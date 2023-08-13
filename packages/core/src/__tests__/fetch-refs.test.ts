/* eslint-disable @typescript-eslint/no-extra-semi */
import type { Mock } from 'vitest'

import { fetchGitRefs } from '../fetch-refs'
import { execPromise } from '../node-lib'

describe('fetchGitRefs', () => {
  vi.mock('../node-lib')

  test('should get result when repo does exists', async () => {
    ;(execPromise as Mock).mockResolvedValue({
      stderr: '',
      stdout:
        'b483cf2f141e4b12cf0e7dd47cd91b0c11e24941\tHEAD\nb483cf2f141e4b12cf0e7dd47cd91b0c11e24941\trefs/heads/main',
    })

    const refs = await fetchGitRefs('https://github.com/Plasticine-Yang/templates')
    expect(refs).toMatchInlineSnapshot(`
      {
        "b483cf2f141e4b12cf0e7dd47cd91b0c11e24941": "HEAD",
      }
    `)
  })

  test('should get error when repo does not exist', async () => {
    ;(execPromise as Mock).mockRejectedValue(new Error('execPromise error'))

    try {
      await fetchGitRefs('https://github.com/xxx/xxx')
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: fetch refs failed]')
      expect((error as Error).cause).toMatchInlineSnapshot('[Error: execPromise error]')
    }
  })
})
