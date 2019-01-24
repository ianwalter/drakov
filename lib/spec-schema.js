const Ajv = require('ajv')
const tv4 = require('tv4')
const metaSchema = require('./json/meta-schema-v4')
const log = require('@ianwalter/log')

const ajv = new Ajv()

function validateSchema (schema) {
  if (metaSchema.$schema) {
    tv4.addSchema('', metaSchema)
    tv4.addSchema(metaSchema.$schema, metaSchema)
  }

  if (!tv4.validate(schema, metaSchema)) {
    log.error('JSON schema is not valid!', JSON.stringify(schema, null, 2))
    throw tv4.error
  }
}

exports.hasSchema = function (spec) {
  return !!spec.schema
}

exports.matchWithSchema = function (json, schema) {
  return schema && ajv.compile(schema)(json)
}

exports.validateAndParseSchema = function (spec) {
  if (this.hasSchema(spec)) {
    spec.schema = JSON.parse(spec.schema)
    validateSchema(spec.schema)
  }
  return spec
}
