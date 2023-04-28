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
  const data = await chatController.updloadHandler(req, res)
  if (!data) {
    res.send('ERROR: File not supported')
    return
  }

  res.render('stats', data)
  console.log(`Request took ${(Date.now() - started).toLocaleString()}ms to complete \n`)
})

module.exports = router