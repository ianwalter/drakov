const contentTypeChecker = require('./content-type')

function getBody (req) {
  if (contentTypeChecker.isJson(req.get('Content-Type'))) {
    try {
      return JSON.parse(req.body)
    } catch (err) {
      req.log.error('Error trying to JSON parse mismatched request', err)
      return req.body
    }
  }
  return req.body
}

module.exports = function notFoundHandler (req, res) {
  if (!res.headersSent) {
    const debug = {
      req: {
        originalUrl: req.originalUrl,
        body: getBody(req),
        method: req.method,
        headers: req.headers,
        query: req.query
      },
      closest: {
        // TODO: add closeset match.
      }
    }
    const message = `No match found for ${req.method} ${req.originalUrl}`
    req.log.warn(message)
    req.log.debug(JSON.stringify(debug, null, 2))
    res.status(404).json({ message, ...debug })
  }
}
