const chokidar = require('chokidar')
const log = require('@ianwalter/log')
const { gray } = require('chalk')
const drakov = require('./drakov')

let cachedArgv = []
let restartInProgress = false

const changeHandler = function (filePath) {
  if (restartInProgress) {
    log.info(gray('File changed but restart already in progress:'), filePath)
  } else {
    restartInProgress = true
    log.info(gray('Restarting server after file change:'), filePath)
    drakov.stop(() => drakov.run(cachedArgv, () => (restartInProgress = false)))
  }
}

module.exports = argv => {
  if (argv.watch) {
    log.debug(gray('Passed --watch flag:'), 'restarting server on file changes')
    cachedArgv = argv
    chokidar.watch(argv.sourceFiles).on('change', changeHandler)
  }
}
