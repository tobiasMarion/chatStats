class Person {
  messages = 0
  words = 0
  characters = 0
  bigMessages = 0
  firstMessages = 0

  timeline = {}
  messagesAcrossTheWeek = new Array(7).fill(0)
  messagesAcrossTheDay = new Array(24).fill(0)

  messageTypes = {
    images: 0,
    videos: 0,
    audios: 0,
    stickers: 0,
    deleteds: 0,
    files: 0,
    medias: 0
  }
}

module.exports = Person
