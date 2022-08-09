import constants from './constants.json' assert {type: 'json'}
import Message from './Message.js'

const input = document.querySelector('#file')

input.addEventListener('change', async ({ target }) => {
  const text = await target.files[0].text()

  if (!text) { return }

  const messages = formatMessages(text)

  console.log(messages)
})

function formatMessages(text) {
  let regExpString

  if (text[0] == '[') {
    regExpString = /\[(?:\d\d|\d)\/(?:\d\d|\d)\/\d\d\s\d\d:\d\d:\d\d]/
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

    for (let key in constants.types) {
      if (constants.types[key].includes(removeSpecialCharacters(content))) {
        type = key
        content = ''
        break
      } else if (key == 'file') {
        for (let index in constants.types[key]) {
          if (removeSpecialCharacters(content).includes(constants.types[key][index])) {
            type = key
            content = ''
            break
          }
        }
      }
    }

    return new Message(dates[index], sender, content, type)
  })

  messages = messages.filter(value => value != undefined)

  return messages
}

function removeSpecialCharacters(text) {
  return text.toLowerCase().replace(/\s+/g, "")
}