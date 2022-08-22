import constants from '../constants.json' assert {type: 'json'}  
import Person from './Person.js'

export default function getData(messages) {
    const people = []

    let lastSender = ''
    let charactersInARow = 0

    messages.forEach(({ date, sender, content, type }) => {
        let person = people.find(({ name }) => name == sender)

        if (!person) {
            person = new Person(sender)
        }

        // Counting messages, characters, media and deleted messages
        person.messages++
        person.characters += content.length
        person.type[type]++

        // Messages by day of the week
        const day = date.getDay()
        person.messagesByDayOfTheWeek[day]++

        // Messages by week
        const sunday = date
        sunday.setDate(sunday.getDate() - day)
        const weekStart = sunday.toLocaleDateString()

        if (person.messagesByWeek.length > 0) {
            const notSameWeek = weekStart != person.lastWeekStarts

            if (notSameWeek) {
                while (weekStart != person.lastWeekStarts) {
                    let [day, month, year] = person.lastWeekStarts.split('/')
                    month--
                    const emptyWeek = new Date(year, month, day)
                    emptyWeek.setDate(emptyWeek.getDate() + 7)
                    const emptyWeekString = emptyWeek.toLocaleDateString()
                    person.messagesByWeek.push([emptyWeekString, 0])
                    person.lastWeekStarts = emptyWeekString
                }
            }

            const index = person.messagesByWeek.length - 1
            person.messagesByWeek[index][1]++

        } else {
            person.messagesByWeek.push([weekStart, 1])
            person.lastWeekStarts = sunday.toLocaleDateString()
        }

        // Counting big messages
        if (lastSender == sender) {
            charactersInARow += content.length
        } else {
            lastSender = sender
            charactersInARow = content.length
        }

        if (charactersInARow >= constants.minimumCharactersToBigMessage) {
            person.bigMessages++
        }

        // Update person on people
        const index = people.findIndex(({ name }) => name == sender)

        if (index >= 0) {
            people[index] = person
        } else {
            people.push(person)
        }
    })

    return people
}