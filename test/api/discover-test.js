var helper = require('../lib')
var request = helper.getRequest()

describe('Discover', function () {
  before(function (done) {
    helper.drakov.run({ sourceFiles: 'test/example/md/simple-api.md' }, done)
  })

  after(function (done) {
    helper.drakov.stop(done)
  })

  describe('/drakov', function () {
    describe('GET', function () {
      it('should get discover page', function (done) {
        request.get('/drakov')
          .expect(200)
          .expect('Content-type', 'text/html; charset=utf-8')
          .end(helper.endCb(done))
      })
    })
  })
})
