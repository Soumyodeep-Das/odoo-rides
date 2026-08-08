import http from 'node:http'
import app from './app'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 8000

const server = http.createServer(app)
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
