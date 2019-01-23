const path = require('path')
const log = require('@ianwalter/log')
const signale = require('signale')
const express = require('express')
const { gray } = require('chalk')

var requestUtils = require('./middleware/request')
var setup = require('./setup')
var middleware = require('./middleware')
const notFoundHandler = require('./notFoundHandler')
const discover = require('./middleware/discover')
const { version } = require('../package.json')

var server = null

exports.run = function (argv, cb) {
  signale.config({ displayTimestamp: true })
  log.update({
    level: argv.log,
    logger: signale.scope('DRAKOV'),
    types: Object.keys(signale._types)
  })

  log.success('Server started')
  log.debug(gray('Drakov version:'), version)

  var app = express()

  // REQUEST MIDDLEWARE
  app.use(requestUtils.logger)
  app.use(requestUtils.getBody)

  // SETUP RESPONSE MIDDLEWARE
  argv.drakovHeader = true
  middleware.init(app, argv, function (err, middlewareFunction) {
    if (err) {
      throw err
    }

    app.use(middlewareFunction)
    server = setup.startServer(argv, app, cb)

    app.set('views', path.join(__dirname, '..', 'views'))
    app.set('view engine', 'jade')
    app.get('/drakov', discover(argv))

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
