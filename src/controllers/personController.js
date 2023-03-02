const dayjs = require('dayjs')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')

dayjs.extend(isSameOrBefore)

const Person = require('../models/Person')
const { minimumCharactersToBigMessage } = require('../../constants.json')

module.exports = {
  countMessages(messages) {
    const people = []
    const dateTable = [['Semana']]

    let lastPersonIndex
    let charactersInARow
    let lastMessageDate

    messages.forEach(({ date, type, sender, content }) => {
      const foundPerson = people.find(person => person.name === sender)
      const personIndex = people.findIndex(person => person.name === sender)

      const person = foundPerson || new Person(sender)

      person.characters += content.length
      person.messages++
      person.types[type]++

      if (lastPersonIndex == null || people[lastPersonIndex].name === sender) {
        charactersInARow += content.length
      } else {
        if (charactersInARow >= minimumCharactersToBigMessage) {
          people[lastPersonIndex].bigMessages++
        }
        charactersInARow = content.length
      }

      const sameWeek = date.isSame(lastMessageDate, 'week')
      if (sameWeek) {
        const row = dateTable.length - 1
        if (foundPerson) {
          const messagesThisWeek = dateTable[row][personIndex + 1]

          dateTable[row][personIndex + 1] = messagesThisWeek == null ? 1 : messagesThisWeek + 1
        } else {
          const column = dateTable[0].push(sender)
          dateTable[row][column] = 1
        }
      } else {
        if (lastMessageDate) {
          let weekStart = lastMessageDate.add(1, 'week').startOf('week')
          
          while (weekStart.isBefore(date, 'week')) {
            let dateString = weekStart.startOf('week').format('DD/MM/YY')
            dateTable.push([dateString])

            weekStart = weekStart.add(1, 'week')
          }

          let newRow = [weekStart.format('DD/MM/YY')]
          if (foundPerson) {
            newRow[personIndex] = 1
          } else {
            const indexToAdd = people.length + 1
            newRow[indexToAdd] = 1
          }
          dateTable.push(newRow)

        } else {
          dateTable[0].push(sender)

          const dateString = date.startOf('week').format('DD/MM/YY')
          dateTable.push([dateString, 1])
        }
      }

      lastMessageDate = date

      const dayOfTheWeek = date.day()
      person.messagesByDayOfTheWeek[dayOfTheWeek]++

      if (foundPerson) {
        people[personIndex] = person
        lastPersonIndex = personIndex
      } else {
        people.push(person)
        lastPersonIndex = people.length - 1
      }
    })

    return { validMessages: messages.length, people, dateTable }
  }
}