import { IncomingMessage } from 'node:http'
import { get } from 'node:https'

function fetch(url: string) {
  return new Promise<IncomingMessage>((resolve, reject) => {
    get(url, (response) => {
      const statusCode = response.statusCode
      const statusMessage = response.statusMessage

      const cause = {
        statusCode,
        statusMessage,
      }

      if (statusCode !== undefined) {
        if (statusCode >= 400) {
          reject(new Error('http statusCode >= 400', { cause }))
        } else if (statusCode >= 300) {
          response.headers.location && fetch(response.headers.location).then(resolve, reject)
        } else {
          resolve(response)
        }
      }
    }).on('error', reject)
  })
}

export { fetch }
