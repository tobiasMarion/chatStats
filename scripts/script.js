import constants from './constants.json' assert {type: 'json'}
import Message from './Message.js'
import Person from './Person.js'

const input = document.querySelector('#file')

input.addEventListener('change', async ({ target }) => {
  let text = await target.files[0].text()

  text = text.replace(/\u200e/g, '')

  if (!text) { return }

  const messages = formatMessages(text)

  const data = getData(messages)
})

function formatMessages(text) {
  let regExpString

  if (text[0] == '[') {
    regExpString = /\[(?:\d\d|\d)\/(?:\d\d|\d)\/\d(?:\d|\d\d\d) \d\d:\d\d:\d\d]/
  } else {
    regExpString = /\d\d\/\d\d\/\d(?:\d|\d\d\d) (?:\d|\d\d):\d\d da (?:manhã|tarde|noite) - /
  }

  const regExp = new RegExp(regExpString, 'gim')

  const dates = [...text.matchAll(regExp)].map(a => {
    let stringDate = a[0].replace(/(?:\[|\]|da | - )/g, '')

    let [day, month, year, time, shift] = stringDate.split(/(?:\/| )/)
    let [hour, minute, second] = time.split(':')

    if (year < 2000) {
      year = Number(year) + 2000
    }

    if (['tarde', 'noite',].includes(shift) && hour < 12) {
      hour += 12
    }

    if (second) {
      return Date.UTC(year, month - 1, day, hour, minute, second)
    }
    return Date.UTC(year, month - 1, day, hour, minute)
  })

  let messages = text.split(regExp)
  messages.shift()

  messages = messages.map((message, index) => {
    let [sender, content] = message.split(':', 2)

    
    for (let errorMessage of constants.errorMessages) {
      if (removeSpecialCharacters(message).includes(errorMessage)) {
        return
      }
    }
    
    sender = sender.trim()
    content = content.trim()
    
    let type = 'text'

    const types = constants.types
    const value = content.replace(/\W/g, '').toLowerCase()

    for (const key in types) {
      if (types[key].find(element => element == value)) {
        type = key
        content = ''
        break
      } else if (key == 'file') {
        types.file.forEach(element => {
          if (value.includes(element)) {
            type = key
            content = ''
          }
        })
      }
    }

    return new Message(dates[index], sender, content, type)
  })

  messages = messages.filter(value => value != undefined)
  return messages
}

function removeSpecialCharacters(value) {
  return value.toLowerCase().replace(/(?:\s+|\r\n)/g, '')
}

function getData(messages) {
  const people = []

  messages.forEach(({ sendingTime, sender, content, type }) => {
    let person = people.find(({ name }) => name == sender)

    if (!person) {
      person = new Person(sender)
    }

    person.messages++
    person.characters += content.length
    person[type]++


    const index = people.findIndex(({ name }) => name == sender)

    if (index >= 0) {
      people[index] = person
    } else {
      people.push(person)
    }
  })

  console.log(people)
}