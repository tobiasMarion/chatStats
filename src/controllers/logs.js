const Log = require('../models/Log')

module.exports = {
  async create(logObject) {
    const log = new Log(logObject)

    try {
      log.save()
    } catch (error) {
      console.log(error)
    }
  }
}