import constants from '../constants.json' assert {type: 'json'}  
import Message from './Message.js'

function removeSpecialCharacters(value) {
    return value.toLowerCase().replace(/(?:\s+|\r\n)/g, '')
}

export default function formatMessages(text) {
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

        month--

        if (year < 2000) {
            year = Number(year) + 2000
        }

        if (['tarde', 'noite',].includes(shift) && hour < 12) {
            hour += 12
        }

        let date
        
        if (second) {
            date = new Date(year, month, day, hour, minute, second)
            return date
        }

        date = new Date(year, month, day, hour, minute)
        return date
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
