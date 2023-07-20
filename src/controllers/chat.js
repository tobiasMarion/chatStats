const fs = require('fs')
const decompress = require('decompress')

const { chunkSize } = require('../../constants.json')

const Report = require('../models/Report')

const messagesController = require('./messages')
const logsController = require('./logs')



module.exports = {
  async updloadHandler(req, res) {
    const start = Date.now()

    let logObject = {
      completed: false,
      timeToResponse: null,
    }

    try {
      const file = req.file
      const [rawText, readFileLog] = await this.readFile(file)
      if (!rawText) throw 'We were not able to open the file uploaded.'
      logObject = { ...logObject, ...readFileLog }

      const [messages, getMessagesLog] = this.getMessages(rawText)
      if (!messages) throw 'We were not able to get the messages from the file uploaded'
      logObject = { ...logObject, ...getMessagesLog }

      const [data, countMessagesLog] = await this.getData(messages)
      data.daysCounted = data.pastMessage.date.diff(data.firstMessageDate, 'days')
      data.messagesPerDay = (data.messages / data.daysCounted).toFixed(2)
      logObject = { ...logObject, ...countMessagesLog }


      for (person in data.people) {
        data.people[person].timeline = JSON.stringify(data.people[person].timeline)
      }

      return data

    } catch (error) {
      logObject.errorMessage = error

    } finally {
      logObject.timeToResponse = ((Date.now() - start) / 1000).toFixed(2)
      logsController.create(logObject)
    }
  },

  async readFile(file) {
    const startTime = Date.now()

    const { originalname, filename, path } = file
    const extesion = originalname.split('.').splice(-1)[0]

    if (extesion != 'zip' && extesion != 'txt') {
      fs.rm(`${process.cwd()}/${path}`, err => {
        if (err) throw err
      })

      throw 'File not supported.'
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

    logObject = {
      fileExtesion: extesion,
      fileSize: file.size,
      timeToReadFile: Date.now() - startTime
    }

    return [rawText, logObject]
  },

  getMessages(rawText) {
    const startTime = Date.now()

    // Remove LEFT-TO-RIGHT MARK characters
    rawText = rawText.replaceAll('\u200e', '').replaceAll('\r', '')

    if (!rawText) return []

    const lines = rawText.split('\n')

    const timeItTook = Date.now() - startTime

    const logObject = { lines: lines.length, timeToGetMessages: Date.now() - startTime }
    return [lines, logObject]
  },

  getData(messages) {
    const startTime = Date.now()
    let data = new Report()

    data.lines = messages.length
    data.lines = messages.length

    function countAChunck(resolve) {
      if (messages.length === 0) {
        const logObject = {
          completed: true,
          timeToCountMessages: Date.now() - startTime
        }

        resolve([data, logObject])
      } else {
        const chunck = messages.splice(0, chunkSize)

        for (let message of chunck) {
          message = messagesController.formatMessage(message)

          data = messagesController.countMessage(message, data)
        }

        setImmediate(() => countAChunck(resolve))
      }
    }

    return new Promise((resolve, reject) => {
      countAChunck(resolve)
    })
  },
}
