var assert = require('assert')
var specSchema = require('../../lib/spec-schema')

var schema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'number' },
    title: { type: 'string' }
  }
}

describe('Spec Schema', function () {
  describe('matchWithSchema', function () {
    it('Should return true when json is validated against schema', () => {
      const { match } = specSchema.matchWithSchema(schema, { id: 1 })
      assert.equal(match, true)
    })

    it('Should return false when json is not validated against schema', () => {
      const { match } = specSchema.matchWithSchema(schema, { idea: 1 })
      assert.equal(match, false)
    })
  })

  describe('validateAndParseSchema', function () {
    it('Should parse and validate schema', function () {
      var spec = specSchema.validateAndParseSchema({ schema: JSON.stringify(schema) })
      assert.deepEqual(spec.schema, schema)
    })

    it('Should throw error when spec schema is not a valid JSON Schema V4 Schema', function () {
      assert.throws(function () {
        specSchema.validateAndParseSchema({ schema: JSON.stringify({ type: 'passionfruit' }) })
      }, Error)
    })
  })
})
