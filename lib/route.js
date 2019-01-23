const { blue, gray } = require('chalk')
const specSchema = require('./spec-schema')

exports.getRouteHandlers = function (method, parsedUrl, action) {
  return action.examples.map(function (example) {
    return {
      action: action,
      parsedUrl: parsedUrl,
      response: example.responses[0],
      request: typeof example.requests[0] === 'undefined' ? null : specSchema.validateAndParseSchema(example.requests[0]),
      execute: function (req, res) {
        var buildResponseBody = function (specBody) {
          switch (typeof specBody) {
            case 'boolean':
            case 'number':
            case 'string':
              return Buffer.from(specBody)
            case 'object':
              return Buffer.from(JSON.stringify(specBody))
            default:
              return specBody
          }
        }

        req.log.info(
          gray('Responding with:'),
          blue((this.request && this.request.name) || action.name)
        )
        if (this.request && this.request.description) {
          req.log.debug(this.request.description)
        }

        this.response.headers.forEach(function (header) {
          res.set(header.name, header.value)
        })

        res.status(+this.response.name)
        res.send(buildResponseBody(this.response.body))
      }
    }
  })
}
