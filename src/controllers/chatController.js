const fs = require('fs')
const decompress = require('decompress')
const dayjs = require('dayjs')

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const { messageDatePatterns } = require('../../constants.json')

const Data = require('../models/Data')
const Person = require('../models/Person')

const { getMessageType } = require('./messageController')

module.exports = {
  async updloadHandler(req, res) {
    const started = Date.now()
    const file = req.file

    const rawText = await this.readFile(file)
    if (!rawText) return
    const p1 = Date.now()
    console.log(`\t Read File: ${p1 - started}ms`)

    const messages = this.getMessages(rawText)
    if (!messages) return
    const p2 = Date.now()
    console.log(`\t Get Messages: ${p2 - p1}ms`)

    const data = this.getData(messages)
    const p3 = Date.now()
    console.log(`\t Get Data: ${p3 - p1}ms`)

    return data
  },

  async readFile(file) {
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
    const rawText = fs.readFileSync(filePath).toString()

    fs.rm(`${process.cwd()}/uploads/_${filename}`, { recursive: true }, err => {
      if (err) throw err
    })

    return rawText

  },

  getMessages(rawText) {
    rawText = rawText.replace(/\u200e/g, '')
    if (!rawText) return []

    let regExpMessagePatternIdentifier
    if (rawText[0] == '[') {
      // iOS Pattern
      regExpMessagePatternIdentifier = /\[\d(?:\d|)\/\d(?:\d|)\/\d\d(?:\d\d|) \d(?:\d|):\d(?:\d|):\d(?:\d|)(?: PM| AM|)]/
    } else {
      // Android Pattern (Android has many patterns, so this RegEX may not be completed)
      regExpMessagePatternIdentifier = /\d(?:\d|)\/\d(?:\d|)\/\d\d(?:\d\d|), \d(?:\d|):\d(?:\d|)(?::\d(?:\d|)|) (?:PM|AM|) - /
    }
    const regEx = new RegExp(regExpMessagePatternIdentifier, 'gim')

    const rawMessages = rawText.split(regEx)
    rawMessages.shift()

    const messages = [...rawText.matchAll(regEx)].map((a, index) => {
      let stringDate = a[0].replace(/\[|]/g, '').toUpperCase()
      const date = dayjs(stringDate, messageDatePatterns)
      const [sender, content] = rawMessages[index].split(':', 2).map(e => e.trim())

      return { date, sender, content }
    })

    return messages
  },

  getData(messages) {
    const accumulator = new Data()
    const data = messages.reduce(this.countMessages, accumulator)

    const firstMessageDate = messages[0].date
    const lastMessageDate = messages[messages.length - 1].date
    data.daysCounted = lastMessageDate.diff(firstMessageDate, 'days')
    data.messagesPerDay = (data.messages / data.daysCounted).toFixed(2)

    return data
  },

  countMessages(accumulator, message) {
    const { date, sender, content } = message

    if (!date || !sender || !content) {
      return accumulator
    }

    const type = getMessageType(content)
    if (type == 'invalid') {
      return accumulator
    }

    accumulator.messages++

    const person = accumulator.people[sender] || new Person()
    person.messages++

    if (type === 'text') {
      person.words += content.split(' ').length
      person.characters += content.split('').length
    } else {
      accumulator.mediaFiles++
      person.types[type]++
    }

    person.messagesAcrossTheWeek[date.day()]++
    person.messagesAcrossTheDay[date.hour()]++


    accumulator.people[sender] = person
    return accumulator
  }
}
