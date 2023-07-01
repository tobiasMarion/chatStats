const fs = require('fs')
const decompress = require('decompress')

const { chunkSize } = require('../../constants.json')

const Report = require('../models/Report')

const messageController = require('./messages')


module.exports = {
  async updloadHandler(req, res) {
    const start = Date.now()
    const file = req.file

    const [rawText, timeToReadFile] = await this.readFile(file)
    if (!rawText) throw 'We were not able to open the file uploaded.'

    const [messages, timeToGetMessages] = this.getMessages(rawText)
    if (!messages) throw 'We were not able to get the messages from the file uploaded'

    const [data, timeToCountMessages] = await this.getData(messages)
    data.daysCounted = data.pastMessage.date.diff(data.firstMessageDate, 'days')
    data.messagesPerDay =  (data.messages / data.daysCounted).toFixed(2)

    console.log(data)
    console.table({ timeToReadFile, timeToGetMessages, timeToCountMessages })

    return data
  },

  async readFile(file) {
    const startTime = Date.now()

    const { originalname, filename, path } = file
    const extesion = originalname.split('.').splice(-1)[0]

    if (extesion != 'zip' && extesion != 'txt') {
      fs.rm(`${process.cwd()}/${path}`, err => {
        if (err) throw err
      })
      return
    }

    if (extesion === 'zip') {
      const renamedFile = `uploads/${filename}.zip`

      fs.renameSync(path, renamedFile)
      await decompress(renamedFile, `uploads/_${filename}`)
      fs.unlinkSync(renamedFile)

    } else if (extesion === 'txt') {
      const renamedFile = `uploads/_${filename}/_chat.txt`

      fs.mkdirSync(`uploads/_${filename}`)
      fs.renameSync(`uploads/${filename}`, renamedFile)
    }

    const filePath = `uploads/_${filename}/_chat.txt`
    const rawText = fs.readFileSync(filePath, 'utf-8')

    fs.rm(`${process.cwd()}/uploads/_${filename}`, { recursive: true }, err => {
      if (err) throw err
    })

    const timeItTook = Date.now() - startTime

    return [rawText, timeItTook]
  },

  getMessages(rawText) {
    const startTime = Date.now()

    // Remove LEFT-TO-RIGHT MARK characters
    rawText = rawText.replaceAll('\u200e', '').replaceAll('\r', '')

    if (!rawText) return []

    const lines = rawText.split('\n')

    const timeItTook = Date.now() - startTime

    return [lines, timeItTook]
  },

  getData(messages) {
    const startTime = Date.now()
    let data = new Report()

    data.lines = messages.length
    data.lines = messages.length

    function countAChunck(resolve) {
      if (messages.length === 0) {
        const timeItTook = Date.now() - startTime
        resolve([data, timeItTook])
      } else {
        const chunck = messages.splice(0, chunkSize)

        for (let message of chunck) {
          message = messageController.formatMessage(message)

          data = messageController.countMessage(message, data)
        }

        setImmediate(() => countAChunck(resolve))
      }
    }

    return new Promise((resolve, reject) => {
      countAChunck(resolve)
    })
  },
}
