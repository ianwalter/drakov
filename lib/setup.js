var fs = require('fs')
var http = require('http')
var https = require('https')
const log = require('@ianwalter/log')

var version = require('../package.json').version

exports.isSSL = false

exports.startServer = function (argv, app, cb) {
  var server = null

  var startCb = function () {
    log.info(
      `   Drakov ${version}     `.bold.inverse,
      'Listening on port ' + argv.serverPort.toString().bold.red
    )

    if (argv.private) {
      log.info(
        '   PRIVATE MODE     '.grey.bold.inverse,
        'Running on localhost only'.grey
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
