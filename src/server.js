require('dotenv/config');

const express = require('express')
const multer = require("multer");

const { updloadHandler } = require('./controllers/chatController')


const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads/" });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/home.html')
})

app.post('/stats', upload.single('chat'), updloadHandler)

app.listen(port, () => {
  console.log(`ChatStats app listening on http://localhost:${port}`)
})