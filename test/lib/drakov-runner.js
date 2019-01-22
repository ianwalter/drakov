var drakov = require('../../lib/drakov')
var merge = require('@ianwalter/merge')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

var drakovDefault = {
  sourceFiles: 'test/example/**/*.md',
  serverPort: require('./port'),
  stealthmode: true,
  disableCORS: false
}

module.exports = {
  run: function (args, cb) {
    var asyncCb = function () {
      // prevents async args
      if (cb) {
        cb()
      }
    }
    drakov.run(merge({}, drakovDefault, args), asyncCb)
  },
  stop: function (cb) {
    drakov.stop(cb)
  }
}
