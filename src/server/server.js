import http from 'http'
import express from 'express'
import routes from './routes'

const app = express()
const PORT_NUM=9000

export const start = () => {
    const server = http.createServer(app)
    routes(app)
    server.listen(PORT_NUM,()=>{console.log(`now listening on ${PORT_NUM}`)})
}