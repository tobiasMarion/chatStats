const express = require('express')
const multer = require("multer")
const glob = require('glob')
const fs = require('fs')
const router = express.Router()
const upload = multer({ dest: "uploads/" })

const chatController = require('../controllers/chatController')

const languages = {}

glob.sync('languages/*.json').forEach(fileName => {
  const lang = fileName.substring(10, fileName.length - 5)
  languages[lang] = JSON.parse(fs.readFileSync(fileName, 'utf-8'))
})

router.get('/', (req, res) => {
  res.render('home', languages[req.lang].home )
})

router.get('/stats', (req, res) => res.redirect('../'))

router.post('/stats', upload.single('chat'), async (req, res) => {
  const started = Date.now()
  console.log('-> New Resquest')

  try {
    const data = await chatController.updloadHandler(req, res)
    if (!data) throw 'File not suported'
    res.render('stats', data)

  } catch (error) {
    res.send(`<h1>ERROR!</h1><p>${error}<p>`)
  } finally {
    console.log(`Request took ${(Date.now() - started).toLocaleString()}ms to complete \n`)
  }

})

module.exports = router