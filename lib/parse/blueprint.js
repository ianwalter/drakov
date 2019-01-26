const fs = require('fs')
const { parse } = require('@ianwalter/blueline')
const _ = require('lodash')
const log = require('@ianwalter/log')
const urlParser = require('./url')
const parseParameters = require('./parameters')
const parseAction = require('./action')
const autoOptionsAction = require('../json/auto-options-action.json')

module.exports = function (filePath, autoOptions, routeMap) {
  return function (cb) {
    parse(fs.readFileSync(filePath, 'utf8'))
      .then(resourceGroups => {
        var allRoutesList = []
        resourceGroups.forEach(function (resourceGroup) {
          resourceGroup.resources.forEach(setupResourceAndUrl)
        })

        // add OPTIONS route where its missing - this must be done after all
        // routes are parsed
        if (autoOptions) {
          addOptionsRoutesWhereMissing(allRoutesList)
        }

        cb()

        function setupResourceAndUrl (resource) {
          var parsedUrl = urlParser.parse(resource.uriTemplate)
          var key = parsedUrl.url
          routeMap[key] = routeMap[key] || { urlExpression: key, methods: {} }
          parseParameters(parsedUrl, resource.parameters, routeMap)
          resource.actions.forEach(function (action) {
            var actionUrl = setupActionUrl(action, parsedUrl, routeMap)
            parseAction(actionUrl, action, routeMap)
            saveRouteToTheList(actionUrl, action)
          })
        }

        function setupActionUrl (action, resourceUrl, routeMap) {
          if (action.attributes.uriTemplate !== '') {
            var actionUrl = urlParser.parse(action.attributes.uriTemplate)
            var actionKey = actionUrl.url
            routeMap[actionKey] = routeMap[actionKey] ||
              { urlExpression: actionKey, methods: {} }
            return actionUrl
          }
          return resourceUrl
        }

        /**
         * Adds route and its action to the allRoutesList. It appends the action
         * when route already exists in the list.
         * @param resource Route URI
         * @param action HTTP action
         */
        function saveRouteToTheList (parsedUrl, action) {
          // used to add options routes later
          if (typeof allRoutesList[parsedUrl.url] === 'undefined') {
            allRoutesList[parsedUrl.url] = []
          }
          allRoutesList[parsedUrl.url].push(action)
        }

        function addOptionsRoutesWhereMissing (allRoutes) {
          var routesWithoutOptions = []
          // extracts only routes without OPTIONS
          _.forIn(allRoutes, function (actions, route) {
            var containsOptions = _.reduce(actions, (acc, action) => {
              return acc || (action.method === 'OPTIONS')
            }, false)
            if (!containsOptions) {
              routesWithoutOptions.push(route)
            }
          })

          routesWithoutOptions.forEach(uriTemplate => parseAction(
            // adds prepared OPTIONS action for route
            urlParser.parse(uriTemplate),
            autoOptionsAction,
            routeMap
          ))
        }
      })
      .catch(err => {
        log.error(err)
        return cb(err)
      })
  }
}
