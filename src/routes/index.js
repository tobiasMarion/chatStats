const express = require('express')
const multer = require("multer")
const router = express.Router()
const upload = multer({ dest: "uploads/" })

const chatController = require('../controllers/chatController')


router.get('/', (req, res) => {
  res.render('home')
})

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