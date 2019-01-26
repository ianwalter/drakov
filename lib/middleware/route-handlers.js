const pathToRegexp = require('path-to-regexp')
const buildRouteMap = require('./route-map')
const filter = require('../handler-filter')
const { comparison } = require('../logger')

module.exports = (options, app, cb) => {
  buildRouteMap(options, (err, routeMap) => {
    if (err) {
      return cb(err)
    }

    // Create a local app variable to contain the routeMap.
    app.locals.routeMap = routeMap

    const middleware = (req, res, next) => {
      let handler = null

      Object.keys(routeMap).forEach(function (urlPattern) {
        if (handler) {
          return // continue if we've already got handlers
        }
        var regex = pathToRegexp(urlPattern)

        // req.path allows us to delegate query string handling to the route
        // handler functions
        const match = regex.exec(req.path)
        req.log.debug(comparison('URL', { comparing: urlPattern, match }))
        if (match) {
          var handlers = routeMap[urlPattern].methods[req.method.toUpperCase()]
          handler = filter.filterHandlers(req, handlers, options.ignoreHeaders)
        }
      })

      if (handler) {
        handler.execute(req, res)
      }

      next()
    }
    cb(null, middleware)
  })
}
