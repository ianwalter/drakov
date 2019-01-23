var lodash = require('lodash')
const log = require('@ianwalter/log')
const specSchema = require('./spec-schema')
const contentTypeChecker = require('./content-type')
const { comparison } = require('./logger')

const isJson = contentTypeChecker.isJson
const mediaTypeRe = /^\s*([^;]+)/i

function getMediaType (contentType) {
  return contentType.match(mediaTypeRe)[0].toLowerCase()
}

function getMediaTypeFromSpecReq (specReq) {
  if (specReq && specReq.headers) {
    for (var i = 0; i < specReq.headers.length; i++) {
      if (/content-type/i.test(specReq.headers[i].name)) {
        return getMediaType(specReq.headers[i].value)
      }
    }
  }
  return null
}

function getMediaTypeFromHttpReq (httpReq) {
  var contentTypeHeader = getHeaderFromHttpReq(httpReq, 'content-type')
  if (contentTypeHeader) {
    return getMediaType(contentTypeHeader)
  }
  return null
}

function getHeaderFromHttpReq (httpReq, header) {
  if (header in httpReq.headers) {
    return httpReq.headers[header]
  }
  return null
}

function getBodyContent (req, parseToJson) {
  let body = null
  if (req && req.body) {
    body = req.body.trim()
  }

  if (parseToJson) {
    try {
      body = JSON.parse(body)
    } catch (err) {
      log.error('JSON body could not be parsed. Using body as is.', err)
    }
  }

  return body
}

function areContentTypesSame (httpReq, specReq) {
  const seeking = getMediaTypeFromHttpReq(httpReq)
  const comparing = getMediaTypeFromSpecReq(specReq)
  const match = !comparing || seeking === comparing
  httpReq.log.debug(comparison('content type', { seeking, comparing, match }))
  return match
}

exports.contentTypeComparator = function (specA) {
  function hasContentTypeHeader (spec) {
    if (spec.request && spec.request.headers) {
      return spec.request.headers.filter(header => (
        header.name.toLowerCase() === 'content-type'
      )).length > 0
    }
    return false
  }

  return !hasContentTypeHeader(specA) ? 1 : -1
}

exports.matchesBody = function (httpReq, specReq) {
  if (!specReq) {
    return true
  }

  var contentType = getMediaTypeFromHttpReq(httpReq)

  if (contentTypeChecker.isMultipart(contentType)) {
    return true
  }

  var reqBody = getBodyContent(httpReq, isJson(contentType))
  var specBody = getBodyContent(specReq, isJson(contentType))
  var match = lodash.isEqual(reqBody, specBody)

  httpReq.log.debug(comparison('body content', { match }))
  return match
}

exports.matchesSchema = function (httpReq, specReq) {
  if (!specReq) {
    return true
  }

  var contentType = getMediaTypeFromHttpReq(httpReq)
  var reqBody = getBodyContent(httpReq, isJson(contentType))
  var match = specSchema.matchWithSchema(reqBody, specReq.schema)
  httpReq.log.debug(comparison('body schema', { match }))
  return match
}

exports.matchesHeader = function (httpReq, specReq, ignoreHeaders) {
  if (!specReq || !specReq.headers) {
    return true
  }

  ignoreHeaders = (ignoreHeaders && ignoreHeaders.map(function (header) {
    return header.toLowerCase()
  })) || []

  function shouldIgnoreHeader (headerName) {
    return ignoreHeaders.indexOf(headerName.toLowerCase()) > -1
  }

  function headersForEvaluation (header) {
    return header.name &&
                (header.name.toLowerCase() !== 'content-type' &&
                !shouldIgnoreHeader(header.name))
  }

  function containsHeader (header) {
    const httpReqHeader = header.name.toLowerCase()
    const match = httpReq.headers.hasOwnProperty(httpReqHeader) &&
          httpReq.headers[httpReqHeader] === header.value
    const seeking = `${httpReqHeader}: ${header.value}`
    httpReq.log.debug(comparison('header', { seeking, match }))
    return match
  }

  return specReq.headers.filter(headersForEvaluation).every(containsHeader) &&
    (shouldIgnoreHeader('content-type') || areContentTypesSame(httpReq, specReq))
}
