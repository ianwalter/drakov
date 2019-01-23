const chokidar = require('chokidar')
const log = require('@ianwalter/log')
const drakov = require('./drakov')
const { gray } = require('chalk')

// Save these for replay later
let CACHED_ARGV = []
let RESTART_COUNT = 0

// TODO: Debounce and format log
const changeHandler = function (filePath) {
  RESTART_COUNT++
  log.info('[CHANGE]', filePath, ('Restarting ' + RESTART_COUNT))
  drakov.stop(function () {
    drakov.run(CACHED_ARGV)
  })
}

module.exports = function (argv) {
  if (!argv.watch) {
    return
  }

  log.debug(gray('Passed --watch flag:'), 'restarting server on file changes')

  CACHED_ARGV = argv

  const watcher = chokidar.watch(argv.sourceFiles)
  watcher.on('change', changeHandler)
}
