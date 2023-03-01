class Person {
  name
  bigMessages = 0
  characters = 0
  messages = 0
  messagesByDayOfTheWeek = [0, 0, 0, 0, 0, 0, 0]
  types = {
      image: 0,
      text: 0,
      video: 0,
      audio: 0,
      sticker: 0,
      deleted: 0,
      file: 0,
      media: 0
  }


  constructor(name) {
      this.name = name
  }
}

module.exports = Person
