const mongoose = require('mongoose')

const LogSchema = mongoose.Schema({
  requestPlatform: {
    browser: String,
    os: String, 
    isMobile: Boolean
  },
  file: {
    size: Number,
    extension: String,
  },
  lines: Number,
  timeToReadFile: Number,
  timeToGetMessages: Number,
  timeToCountMessages: Number,
  timeToResponse: Number,
  completed: Boolean,
  errorMessage: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const LogModel = mongoose.model('Log', LogSchema)
module.exports = LogModel