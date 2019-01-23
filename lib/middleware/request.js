const signale = require('signale')
const log = require('@ianwalter/log')
const onFinished = require('on-finished')

exports.getBody = function (req, res, next) {
  req.body = ''
  req.on('data', function (chunk) {
    req.body += chunk
  })
  req.on('end', next)
}

exports.logger = function (req, res, next) {
  const logger = signale.scope(`${req.method} ${req.url}`)
  req.log = log.create(Object.assign({}, log.options, { logger }))
  logger.time('request')
  onFinished(res, () => logger.timeEnd('request'))
  next()
}
