const dayjs = require('dayjs')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

const { invalidMessages, specialInvalidMessages, typeList } = require('../../constants.json')

module.exports = {
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