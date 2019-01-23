const { green, red, yellow, cyan, gray } = require('chalk')

exports.comparison = (type, { seeking, comparing, match }) => {
  let out = gray('Matching by ') + type
  if (seeking) {
    out += gray(', seeking: ') + cyan(seeking)
  }
  if (comparing) {
    out += gray(', comparing: ') + yellow(comparing)
  }
  return out + gray(' => ') + (match ? green('MATCH') : red('NO MATCH'))
}
