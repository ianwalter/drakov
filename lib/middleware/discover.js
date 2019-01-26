const { html } = require('common-tags')

const toRouteList = route => `<li>${route}</li>`

module.exports = function discover (req, res, next) {
  if (res.headersSent) {
    return next()
  }

  res.send(html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Drakov Information</title>
      </head>
      <body>

        <h1>Drakov Information</h1>

        <section>

          <h2>Available Endpoints</h2>

          <p>
            <ul>
              ${Object.keys(req.app.locals.routeMap).map(toRouteList)}
            </ul>
          </p>

        </section>

      </body>
    </html>
  `)
}
