var buildRouteMap = require('./route-map')

module.exports = function (argv) {
  return function (req, res, next) {
    if (res.headersSent) {
      return next()
    }
    buildRouteMap(argv, function (err, routeMap) {
      if (err) {
        return next(err)
      } else {
        res.render('discover', {
          routes: Object.keys(routeMap)
        })
      }
    })
  }
}
