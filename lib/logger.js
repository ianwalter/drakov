const log = require('@ianwalter/log')
require('colors')

exports.log = log.info

exports.stringfy = function (matched) {
  return matched ? 'MATCHED'.green : 'NOT_MATCHED'.red
}
