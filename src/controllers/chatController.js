const fs = require('fs')
const decompress = require('decompress')
const dayjs = require('dayjs')

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const { messageDatePatterns, typeList, errorMessages } = require('../../constants.json')
const { countMessages } = require('./personController')

const Message = require('../models/Message')



module.exports = {
  async updloadHandler(req, res) {
    const file = req.file

    const rawText = await this.readFile(file)

    const messages = this.formatMessages(rawText)

    const data = countMessages(messages)

    return data
  },

  async readFile(file) {
    const { originalname, filename, path } = file
    const extesion = originalname.split('.').splice(-1)[0]

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

  formatMessages(rawText) {
    rawText = rawText.replace(/\u200e/g, '')

    if (!rawText) return []

    let regExpMessagePatternIdentifier

    if (rawText[0] == '[') {
      // iOS Pattern
      regExpMessagePatternIdentifier = /\[\d(?:\d|)\/\d(?:\d|)\/\d\d(?:\d\d|) \d(?:\d|):\d(?:\d|):\d(?:\d|)(?: PM| AM|)]/
    } else {
      // Android Pattern

      // marco's file
      regExpMessagePatternIdentifier = /\d(?:\d|)\/\d(?:\d|)\/\d\d(?:\d\d|), \d(?:\d|):\d(?:\d|) (?:PM|AM|) - /
    }

    const regEx = new RegExp(regExpMessagePatternIdentifier, 'gim')

    const dates = [...rawText.matchAll(regEx)].map(a => {
      let stringDate = a[0].replace(/\[|]/g, '').toUpperCase()

      const date = dayjs(stringDate, messageDatePatterns)

      return date
    })

    let messages = rawText.split(regEx)
    messages.shift()

    const types = Object.keys(typeList)

    messages = messages.map((rawMessage, index) => {
      let [sender, content] = rawMessage.split(':', 2)

      sender = sender.trim()
      content = content.trim()

      let type

      const normalizedContent = content.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase()

      if (errorMessages.includes(normalizedContent)) {
        return null
      } 
      
      // Special error messages (it contains Person 2 name)
      if (normalizedContent.includes(errorMessages[0]) || normalizedContent.includes(errorMessages[1])) {
        return null
      }

      for (key of types) {

        if (typeList[key].includes(normalizedContent)) {
          type = key
          content = ''
          break
        }
      }

      type = type || 'text'

      const message = new Message(dates[index], type, sender, content)


      return message
    })

    messages = messages.filter(element => element != null)

    return messages
  }
}
