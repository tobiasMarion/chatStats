const glob = require('glob')

module.exports = (req, res, next) => {
  supportedLanguages = glob.sync('languages/*.json').map(file => {
    return file.substring(10).replace('.json', '')
  })

  const lang = req.acceptsLanguages(...supportedLanguages)
  if (lang) req.lang = lang
  else req.lang = 'en'
  next()
}