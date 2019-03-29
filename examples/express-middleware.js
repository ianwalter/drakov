const express = require('express')
const requestUtils = require('../lib/middleware/request')
const drakovMiddleware = require('../index.js').middleware
// you would use the following line for require Drakov properly in your own app
// const drakov = require('drakov')

const app = express()
app.use(requestUtils.getBody) // need to have a body parser for the middleware
// to work

const drakovOptions = {
  sourceFiles: '../test/example/**/*.md'
}

// currently need to initialise the middleware asynchronously due to drafter
// parse in async
drakovMiddleware.init(app, drakovOptions, function (err, middlewareFunction) {
  if (err) {
    throw err
  }
  app.use(middlewareFunction)
  app.listen(8000, function () {
    console.log('server started with Drakov middleware')
  })
})
