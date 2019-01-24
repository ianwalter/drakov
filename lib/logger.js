const { green, red, yellow, cyan, gray, blue } = require('chalk')

exports.comparison = (type, { seeking, comparing, name, match }) => {
  let out = gray('Matching by ') + type
  if (seeking) {
    out += gray(', seeking: ') + cyan(seeking)
  }
  if (comparing || name) {
    out += gray(', comparing: ') + (comparing ? yellow(comparing) : blue(name))
  }
  if (comparing && name) {
    out += gray(' of ') + blue(name)
  }
  return out + gray(' => ') + (match ? green('MATCH') : red('NO MATCH'))
}
