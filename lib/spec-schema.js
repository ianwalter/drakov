const Ajv = require('ajv')
const log = require('@ianwalter/log')

const ajv = new Ajv()

function validateSchema (schema) {
  try {
    ajv.validate(schema)
  } catch (err) {
    log.error(err, schema)
    throw err
  }
}

exports.matchWithSchema = function (schema, json) {
  if (schema) {
    return { match: ajv.validate(schema, json), errors: ajv.errors }
  }
  return { match: false }
}

exports.validateAndParseSchema = function (spec) {
  if (spec.schema) {
    if (typeof spec.schema === 'string') {
      spec.schema = JSON.parse(spec.schema)
    }
    validateSchema(spec.schema)
  }
  return spec
}
