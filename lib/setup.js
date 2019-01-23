var fs = require('fs')
var http = require('http')
var https = require('https')
const log = require('@ianwalter/log')
const { gray } = require('chalk')

exports.isSSL = false

exports.startServer = function (argv, app, cb) {
  var server = null

  var startCb = function () {
    if (argv.private) {
      log.debug(
        gray('Passed --private flag:'),
        'binding to localhost (not IP address)'
      )
    }

    if (cb) {
      cb()
    }
  }

  if (argv.sslKeyFile && argv.sslCrtFile) {
    exports.isSSL = true
    var sslOptions = {
      key: fs.readFileSync(argv.sslKeyFile, 'utf8'),
      cert: fs.readFileSync(argv.sslCrtFile, 'utf8'),
      rejectUnauthorized: false
    }
    server = https.createServer(sslOptions, app)
  } else {
    // server = app;
    server = http.createServer(app)
  }

  if (argv.private) {
    return server.listen(argv.serverPort, 'localhost', startCb)
  }
  return server.listen(argv.serverPort, startCb)
}
