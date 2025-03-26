require('dotenv/config')

const express = require('express')
const mongoose = require('mongoose')
const useragent = require('express-useragent')
const getLanguageMiddleware = require('./utils/getLanguageMiddleware')
const routes = require('./routes/')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', './src/views')

console.log(process.env)
mongoose.connect(process.env['chatstats-db-uri'])

app.use(getLanguageMiddleware)
app.use(useragent.express())
app.use('/', routes)

app.listen(port, () => {
  console.log(`ChatStats app listening on http://localhost:${port}`)
})