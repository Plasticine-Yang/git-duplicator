import { resolve } from 'path'

import { execPromise } from '../../../node-lib'

describe('execPromise', () => {
  test('should get result from stdout', async () => {
    const fixturePath = resolve(__dirname, 'fixture.txt')

    const { stdout } = await execPromise(`cat '${fixturePath}'`)

    expect(stdout).toMatchInlineSnapshot(`
      "hello world

      hello hello

      hi hi

      world
      "
    `)
  })

  test('should get error from stderr', async () => {
    const notExistFixturePath = resolve(__dirname, 'fixture-not-exist.txt')

    try {
      await execPromise(`cat '${notExistFixturePath}'`)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })
})
