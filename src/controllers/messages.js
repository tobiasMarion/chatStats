const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)

const Person = require('../models/Person')

const {
  invalidMessages,
  specialInvalidMessages,
  typeList,
  messageDatePatterns,
  minCharactersToBigMessage,
  minsToChatEnd
} = require('../../constants.json')

module.exports = {
  formatMessage(message) {
    let date, sender, content, type

    // iOS, Android ou Fragment of PastMessage
    if (message.startsWith('[')) {
      // iOS message
      message = message.replace(/\[|/, '').replace('\r', '')
      let dateString = message.split(']')[0]
      const datePatterns = messageDatePatterns.iOS
      date = dayjs(dateString, datePatterns)

      let rawMessage = message.slice(message.indexOf(']') + 2)
      sender = rawMessage.split(':')[0]
      content = rawMessage.slice(rawMessage.indexOf(':') + 2, rawMessage.length)

    } else {
      // Android Pattern (Android has many patterns, so this RegEX may be incomplete)
      const androidDateRegEx = /^\d(?:\d|)\/\d(?:\d|)\/\d\d(?:\d\d|)(?:,|) \d(?:\d|):\d(?:\d|)(?: (?:PM|AM)|)/

      if (!androidDateRegEx.test(message)) {
        return { type: 'pastMessageFragment', content: message }
      }

      const dateString = message.match(androidDateRegEx)[0]
      const rawMessage = message.split(androidDateRegEx)[1]
      let [rawSender, rawContent] = rawMessage.split(':', 2)

      if (!rawSender || !rawContent) {
        return { type: 'pastMessageFragment', content: rawContent }
      }

    }

    type = this.getMessageType(content)
    if (type !== 'text') {
      content = ''
    }

    return { date, sender, content, type }
  },

  countMessage({ date, sender, content, type }, report) {
    if (type === 'invalid') return report

    const person = report.people[sender] || new Person()

    if (!report.firstMessageDate) {
      report.firstMessageDate = date
    }

    if (content === undefined) {
      console.log({ date, sender, content, type })
    }

    if (type === 'pastMessageFragment') {
      person.words += content.split(' ').length
      person.characters += content.length
      return report
    }

    report.messages++
    report.lastMessageDate = date
    person.messages++

    if (type !== 'text') {
      report.mediaFiles++
      person.messageTypes[type]++

    } else {
      person.characters += content.length
      person.words += content.split(' ').length
    }

    const isSameSender = !report.pastMessage || report.pastMessage.sender === sender
    if (isSameSender && type === 'text') {
      report.charactersInARow += content.length
    } else if (!isSameSender) {
      const pastSender = report.pastMessage.sender
      
      if (report.charactersInARow > minCharactersToBigMessage) {
        report.people[pastSender].bigMessages++
      }

      report.charactersInARow = type === 'text' ? content.length : 0
    }

    person.messagesAcrossTheDay[date.hour()]++
    person.messagesAcrossTheWeek[date.day()]++

    person.timeline = this.setWeekMessage(date, person.timeline)

    if (!report.pastMessage) {
      person.firstMessages++
    } else {
      const isNotSameDay = !date.isSame(report.pastMessage.date, 'day')
      const pastEnoughTime = date.diff(report.pastMessage.date, 'minutes') >= minsToChatEnd

      if (isNotSameDay && pastEnoughTime) {
        person.firstMessages++
      }
    }

    report.people[sender] = person

    report.pastMessage = { date, sender, content, type }

    return report
  },

  getMessageType(content) {
    content = content.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase()

    if (invalidMessages.includes(content)) {
      return 'invalid'
    }

    for (const invalidMessage of specialInvalidMessages) {
      if (content.includes(invalidMessage)) return 'invalid'
    }

    const types = Object.keys(typeList)

    for (key of types) {
      if (typeList[key].includes(content)) {
        return key
      }
    }

    return 'text'
  },

  setWeekMessage(date, weeks) {
    let weekStartString = date.startOf('week').format('DD/MM/YYYY')
    const weeksKeys = Object.keys(weeks)

    if (weeksKeys.length == 0) {
      weeks[weekStartString] = 0
    } else if (!weeks[weekStartString]) {
      const lastWeekAddedString = weeksKeys.slice(-1)[0]
      const lastWeekAdded = dayjs(lastWeekAddedString, "DD-MM-YYYY")
      const timeDifference = date.diff(lastWeekAdded, 'week')

      for (let w = 1; w <= timeDifference; w++) {
        const weekToAdd = lastWeekAdded.add(w, 'week').format('DD/MM/YYYY')
        weeks[weekToAdd] = 0
      }
    }

    weeks[weekStartString]++

    return weeks
  }
}