const mongoose = require('mongoose')

const LogSchema = mongoose.Schema({
  requestDateTime: Date,
  fileSize: Number,
  fileExtension: String,
  lines: Number,
  completed: Boolean,
  timeToReadFile: Number,
  timeToGetMessages: Number,
  timeToCountMessages: Number,
  timeToResponse: Number,
  errorMessage: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const LogModel = mongoose.model('Log', LogSchema)
module.exports = LogModel