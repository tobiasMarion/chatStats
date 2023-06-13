const glob = require('glob')

module.exports = (req, res, next) => {
  const supportedLanguages = glob.sync('languages/*.json').map(fileName => {
    return fileName.substring(10).replace('.json', '')
  })

  const lang = req.acceptsLanguages(...supportedLanguages)
  if (lang) {
    req.lang = lang
  } else {
    req.lang = 'en'
  } 
  next()
}