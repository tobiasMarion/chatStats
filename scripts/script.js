import constants from './constants.json' assert {type: 'json'}
import Person from './Person.js'
import formatMessages from './formatData.js'

const input = document.querySelector('#file')

input.addEventListener('change', async ({ target }) => {
  let text = await target.files[0].text()

  text = text.replace(/\u200e/g, '')

  if (!text) { return }

  const messages = formatMessages(text)

  const data = getData(messages)

  console.log(data)
})

function getData(messages) {
  const people = []

  let lastSender = ''
  let charactersInARow = 0

  messages.forEach(({ timestamp, sender, content, type }) => {
    let person = people.find(({ name }) => name == sender)

    if (!person) {
      person = new Person(sender)
    }

    person.messages++
    person.characters += content.length
    person[type]++

    const date = new Date(timestamp)
    const dayOfTheWeek = date.getDay()
    person.messagesByDayOfTheWeek[dayOfTheWeek]++

    const weekStartSunday = (timestamp - dayOfTheWeek * constants.day) - (timestamp % constants.day)
    let weekStart = new Date(weekStartSunday)

    if (weekStartSunday == person.lastWeekStart) {
      const index = person.messagesByWeek.length - 1
      person.messagesByWeek[index][1]++
    } else {
      let nextWeekStart
      if (person.lastWeekStart) {
        nextWeekStart = person.lastWeekStart + constants.day * 7
      } else {
        nextWeekStart = weekStartSunday
      }


      do {
        let value = 1
        if (person.nextWeekStart < weekStart.getDate()) {
          value = 0
        }
        const key = new Date(nextWeekStart + constants.day).toLocaleDateString()
        person.messagesByWeek.push([key, value])
        person.lastWeekStart = nextWeekStart
      } while (nextWeekStart < weekStartSunday)


    }



    if (lastSender == sender) {
      charactersInARow += content.length
    } else {
      lastSender = sender
      charactersInARow = content.length
    }

    if (charactersInARow >= constants.minimumCharactersToBigMessage) {
      person.bigMessages++
    }


    const index = people.findIndex(({ name }) => name == sender)

    if (index >= 0) {
      people[index] = person
    } else {
      people.push(person)
    }
  })

  return people
}