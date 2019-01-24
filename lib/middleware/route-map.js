const globby = require('globby')
const async = require('async')
const log = require('@ianwalter/log')
const parseBlueprint = require('../parse/blueprint')
const endpointSorter = require('./endpoint-sorter')

module.exports = async function routeMap ({ sourceFiles, autoOptions }, cb) {
  const routeMap = {}

  try {
    const files = await globby(sourceFiles)
    const asyncFunctions = []

    files.forEach(function (filePath) {
      asyncFunctions.push(parseBlueprint(filePath, autoOptions, routeMap))
    })

    async.series(asyncFunctions, function (err) {
      cb(err, endpointSorter.sort(routeMap))
    })
  } catch (err) {
    log.error(err)
  }
}
