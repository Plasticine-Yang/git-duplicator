/* eslint-disable @typescript-eslint/no-extra-semi */
import type { Mock } from 'vitest'

import { duplicate } from '../../duplicator'
import { execPromise } from '../../node-lib'

describe('duplicate', () => {
  vi.mock('../../node-lib')

  test('happy path', async () => {
    ;(execPromise as Mock).mockResolvedValue({
      stderr: '',
      stdout:
        'b483cf2f141e4b12cf0e7dd47cd91b0c11e24941\tHEAD\nb483cf2f141e4b12cf0e7dd47cd91b0c11e24941\trefs/heads/main',
    })

    const res = await duplicate('Plasticine-Yang/templates', '.')

    expect(res).toMatchInlineSnapshot(
      '"https://github.com/Plasticine-Yang/templates/archive/b483cf2f141e4b12cf0e7dd47cd91b0c11e24941.tar.gz"',
    )
  })
})
