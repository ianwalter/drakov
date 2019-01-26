const log = require('@ianwalter/log')
const signale = require('signale')
const express = require('express')
const { gray } = require('chalk')

const requestUtils = require('./middleware/request')
const setup = require('./setup')
const middleware = require('./middleware')
const notFoundHandler = require('./notFoundHandler')
const discover = require('./middleware/discover')
const { version } = require('../package.json')

let server = null

exports.run = function (argv, cb) {
  signale.config({ displayTimestamp: true })
  log.update({
    level: argv.log,
    logger: signale.scope('DRAKOV'),
    types: Object.keys(signale._types)
  })

  log.success('Server started')
  log.debug(gray('Drakov version:'), version)

  const app = express()

  // REQUEST MIDDLEWARE
  app.use(requestUtils.logger)
  app.use(requestUtils.getBody)

  // SETUP RESPONSE MIDDLEWARE
  argv.drakovHeader = true
  middleware.init(app, argv, function (err, middlewareFunction) {
    if (err) {
      throw err
    }

    // Add a route to the app that renders information about how the server is
    // set up as a HTML page.
    app.get('/drakov', discover)

    app.use(middlewareFunction)
    server = setup.startServer(argv, app, cb)

    // 404
    app.use(notFoundHandler)
  })
}

exports.stop = function (cb) {
  var runCb = function () {
    if (cb) {
      cb()
    }
  }
  try {
    server.close(function () {
      log.complete('Server stopped')
      runCb()
    })
  } catch (e) {
    runCb()
  }
}
