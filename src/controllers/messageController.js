const { invalidMessages, specialInvalidMessages, typeList } = require('../../constants.json')

module.exports = {
  getMessageType(content) {
    content = content.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase()

    if (invalidMessages.includes(content)) {
      return 'invalid'
    }

    for (const invalidMessage of specialInvalidMessages) {
      if (invalidMessage.includes(content)) return 'invalid'
    }

    const types = Object.keys(typeList)
    for (key of types) {
      if (typeList[key].includes(content)) {
        return key
      }
    }

    return 'text'
  },
}