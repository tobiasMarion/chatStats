class Message {
  date
  type
  sender
  content

  constructor(date, type, sender, content) {
    this.date = date
    this.type = type
    this.sender = sender
    this.content = content
  }
}

module.exports = Message