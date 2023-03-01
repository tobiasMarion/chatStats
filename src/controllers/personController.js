const Person = require('../models/Person')
const { minimumCharactersToBigMessage } = require('../../constants.json')

module.exports = {
  countMessages(messages) {
    const people = []
    const dateTable = []

    let lastPersonIndex
    let charactersInARow

    messages.forEach(({ date, type, sender, content }) => {
      const foundPerson = people.find(person => person.name === sender)

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

      const dayOfTheWeek = date.day()
      person.messagesByDayOfTheWeek[dayOfTheWeek]++

      if (foundPerson) {
        const index = people.findIndex(person => person.name === sender)
        people[index] = person
        lastPersonIndex = index
      } else {
        people.push(person)
        lastPersonIndex = people.length - 1
      }
    })

    return { people, dateTable }
  }
}