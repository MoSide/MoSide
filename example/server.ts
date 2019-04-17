import {createServer} from 'http'
import {logger} from '../src/utils/logger'

export const server = createServer()
server.listen(8081, '0.0.0.0')
server.on('error', (err: Error) => {
  logger.error(err)
})

server.on('listening', () => {
  console.log(`Sever is Running`, `http://0.0.0.0:8081`)
})
