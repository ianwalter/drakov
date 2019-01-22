require('colors')

var stealthMode = false

exports.setStealthMode = function (isStealthMode) {
  stealthMode = isStealthMode
}

exports.log = stealthMode ? () => {} : console.log

exports.stringfy = function (matched) {
  return matched ? 'MATCHED'.green : 'NOT_MATCHED'.red
}
