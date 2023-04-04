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
  console.log('-=-=-=-=-= Nova requisição =-=-=-=-=-')
  const start = Date.now()
  const timeControl = [start]

  const data = await chatController.updloadHandler(req, res, timeControl)


  const total = Date.now() - timeControl.shift()
  timeControl.map(row => {
    row['Tempo (%)'] = (row['Tempo (ms)'] / total * 100).toFixed(2)
    return row
  })

  console.table(timeControl)
  console.log(`Tempo Total: ${total}ms`)
  console.log(`Total de Mensagens: ${data.validMessages}`)
  console.log(`Mensagens por segundo: ${(data.validMessages / total * 1000).toFixed(0)} \n`)

  res.render('stats', data)
})

app.listen(port, () => {
  console.log(`ChatStats app listening on http://localhost:${port}`)
})