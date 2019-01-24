var routeHandlers = require('./route-handlers')
var responseUtils = require('./response')

var bootstrapMiddleware = function (app, argv) {
  if (argv.drakovHeader) {
    app.use(responseUtils.drakovHeaders)
  }
  app.use(responseUtils.corsHeaders(argv.disableCORS, argv.header))
  app.use(responseUtils.delayedResponse(argv.delay))
  app.use(responseUtils.allowMethods(argv.method))
}

exports.init = (app, argv, cb) => {
  bootstrapMiddleware(app, argv)
  const options = {
    sourceFiles: argv.sourceFiles,
    autoOptions: argv.autoOptions,
    ignoreHeaders: argv.ignoreHeader
  }
  routeHandlers(options, (err, middleware) => cb(err, middleware))
}
