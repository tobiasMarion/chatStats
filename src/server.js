require('dotenv/config')

const express = require('express')
const multer = require("multer")

const chatController = require('./controllers/chatController')


const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', './src/views')


const upload = multer({ dest: "uploads/" })

app.get('/', (req, res) => {
  res.render('home')
})

app.post('/stats', upload.single('chat'), async (req, res) => {
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

app.listen(port, () => {
  console.log(`ChatStats app listening on http://localhost:${port}`)
})