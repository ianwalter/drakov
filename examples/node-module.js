const drakov = require('../index.js')
// you would use the following line for require Drakov properly in your own app
// const drakov = require('drakov')

const drakovOptions = {
  sourceFiles: '../test/example/**/*.md',
  serverPort: 3000
}

drakov.run(drakovOptions, function (err) {
  console.log('-- STARTED --')

  if (err) {
    throw err
  }

  drakov.stop(function (err) {
    console.log('-- STOPPED --')

    if (err) {
      throw err
    }
  })
})
