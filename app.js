const cors = require('cors')
const express = require('express')
require('express-async-errors')
const app = express()
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


const morgan = require('morgan')

morgan.token('body', function getBody (req) {
    return JSON.stringify( req.body )
  })

  const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true})
.then(result => {
  logger.info('connected to MongoDB')
})
.catch((error) => {
  logger.info('error connecting to MongoDB:', error.message)
})

  app.use(cors())
  app.use(express.json())
  app.use(middleware.tokenExtrator)
  app.use('/api/blogs', blogsRouter)
  app.use('/api/users', usersRouter)
  app.use('/api/login', loginRouter)

  if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
  }

  app.use(middleware.unknownEndpoint)
  app.use(middleware.errorHandler)

  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

  module.exports = app
