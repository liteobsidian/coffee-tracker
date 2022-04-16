import path from 'path'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import log from './logger'
import passport from './auth'
import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.enable('trust proxy')
app.use(morgan('dev'))

app.use(passport.initialize())
// app.use(passport.authenticate('user', { session: false }))

app.options('*', cors())
app.use(routes)

app.get('/*', function (req, res, next) {
  res.setHeader('Last-Modified', new Date().toUTCString())
  next()
})
app.disable('etag')
app.get('/*', function (req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', 0)
  next()
})

app.use(express.static(path.join(__dirname, 'public')))

app.use((err, req, res, next) => {
  log.error(err.message || err.stack)
  next(err)
})

app.use((err, req, res, next) => {
  res.status(res.statusCode !== 200 ? res.statusCode : 500).send({ success: false, message: err.message || 'Internal Server Error' })
})

export default app
