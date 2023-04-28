const fs = require('fs')
const decompress = require('decompress')
const dayjs = require('dayjs')

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const { messageDatePatterns, minCharactersToBigMessage, minsToChatEnd } = require('../../constants.json')

const Person = require('../models/Person')

const { getMessageType, setWeekMessage } = require('./messageController')

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
    let datePatterns
    if (rawText[0] == '[') {
      // iOS Pattern
      regExpMessagePatternIdentifier = /\[\d(?:\d|)\/\d(?:\d|)\/\d\d(?:\d\d|) \d(?:\d|):\d(?:\d|):\d(?:\d|)(?: PM| AM|)]/
      datePatterns = messageDatePatterns.iOS
    } else {
      // Android Pattern (Android has many patterns, so this RegEX may not be completed)
      regExpMessagePatternIdentifier = /\d(?:\d|)\/\d(?:\d|)\/\d\d(?:\d\d|)(?:,|) \d(?:\d|):\d(?:\d|)(?: (?:PM|AM)|) - /
      datePatterns = messageDatePatterns.android

    }
    const regEx = new RegExp(regExpMessagePatternIdentifier, 'gim')

    const rawMessages = rawText.split(regEx)
    rawMessages.shift()

    const messages = [...rawText.matchAll(regEx)].map((a, index) => {
      let stringDate = a[0].replace(/\[|]/g, '').toUpperCase()
      const date = dayjs(stringDate, datePatterns)
      const [sender, content] = rawMessages[index].split(':', 2).map(e => e.trim())

      return { date, sender, content }
    })

    return messages
  },

  getData(messages) {
    const accumulator = {
      messages: 0,
      mediaFiles: 0,
      charactersInARow: 0,
      people: {}
    }
    const data = messages.reduce(this.countMessages, accumulator)

    const firstMessageDate = messages[0].date
    const lastMessageDate = messages[messages.length - 1].date
    data.daysCounted = lastMessageDate.diff(firstMessageDate, 'days')
    data.messagesPerDay = (data.messages / data.daysCounted).toFixed(2)

    Object.keys(data.people).forEach(name => {
      data.people[name].timeline = JSON.stringify(data.people[name].timeline)
    })

    return data
  },

  countMessages(accumulator, message) {
    const { date, sender } = message
    let { content } = message

    if (!date || !sender || !content) {
      return accumulator
    }

    const type = getMessageType(content)
    if (type == 'invalid' || 'Usuário adicionado' === sender) {
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
      content = ''
    }

    person.messagesAcrossTheWeek[date.day()]++
    person.messagesAcrossTheDay[date.hour()]++

    const previousSender = accumulator.previousMessage ? accumulator.previousMessage.sender : false

    if (!previousSender || previousSender == sender) {
      accumulator.charactersInARow += content.length
    } else {
      if (accumulator.charactersInARow >= minCharactersToBigMessage) {
        accumulator.people[previousSender].bigMessages++
      }
      accumulator.charactersInARow = content.length
    }

    person.timeline = setWeekMessage(date, person.timeline)

    if (!previousSender) {
      person.firstMessage++
      accumulator.yesterdayDate = date
    } else {
      const sameDay = date.isSame(accumulator.previousMessage.date, 'day')
      const enoughTime = date.diff(accumulator.yesterdayDate, 'minute') > minsToChatEnd

      if (sameDay) {
        accumulator.yesterdayDate = date
      } else if (enoughTime) {
        person.firstMessage++
      }
    }


    accumulator.people[sender] = person
    accumulator.previousMessage = message

    return accumulator
  }
}
