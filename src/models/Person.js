class Person {
  name
  bigMessages = 0
  characters = 0
  messages = 0
  
  messagesByDayOfTheWeek = [0, 0, 0, 0, 0, 0, 0]
  messagesByPartOfTheDay = {
    dawn: 0,
    morning: 0,
    afternoon: 0,
    night: 0
  }

  types = {
      images: 0,
      texts: 0,
      videos: 0,
      audios: 0,
      stickers: 0,
      deleteds: 0,
      files: 0,
      medias: 0
  }


  constructor(name) {
      this.name = name
  }
}

module.exports = Person
