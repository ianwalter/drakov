const log = require('@ianwalter/log')
const { gray, blue } = require('chalk')
const route = require('../route')

module.exports = function (parsedUrl, action, routeMap) {
  var key = parsedUrl.url

  routeMap[key].methods[action.method] = routeMap[key].methods[action.method] || []

  var routeHandlers = route.getRouteHandlers(key, parsedUrl, action)
  routeMap[key].methods[action.method] = routeMap[key].methods[action.method].concat(routeHandlers)
  log.debug(gray('Adding route:'), `${action.method} ${key}`, blue(action.name))
}
