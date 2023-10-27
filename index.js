import express from 'express'
import path from 'path'
import morgan from 'morgan'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use('/service-worker.js', express.static(__dirname + '/service-worker.js'))
app.use('/public', express.static(__dirname + '/public'))
app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.listen(3000, () => {
  console.log('server started')
})
