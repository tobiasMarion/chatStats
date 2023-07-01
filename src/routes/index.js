const express = require('express')
const multer = require("multer")
const glob = require('glob')
const fs = require('fs')
const router = express.Router()
const upload = multer({ dest: "uploads/" })

const chatController = require('../controllers/chat')

const languages = {}

glob.sync('languages/*.json').forEach(fileName => {
  const lang = fileName.substring(10, fileName.length - 5)
  languages[lang] = JSON.parse(fs.readFileSync(fileName, 'utf-8'))
})

router.get('/', (req, res) => {
  res.render('home', { ...languages[req.lang].home, language: req.lang })
})

router.get('/stats', (req, res) => res.redirect('../'))

router.post('/stats', upload.single('chat'), async (req, res) => {
  console.log('New Resquest')
  const started = Date.now()

  try {
    const data = await chatController.updloadHandler(req, res)
    res.render('stats', data)
  } catch (error) {
    res.status(500).send(`<h1>ERROR!</h1><p>${error}<p>`)
    console.log(`\tError: ${error}`)
  } finally {
    console.log(`Request took ${(Date.now() - started).toLocaleString()}ms to complete\n`)
  }
})

module.exports = router