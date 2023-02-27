const fs = require('fs')
const decompress = require('decompress')

module.exports = {
  async updloadHandler(req, res) {
    const file = req.file

    const rawText = await this.readFile(file)

    const messages = this.formatMessages(rawText)

    res.send('<a href="http://localhost:3000">Return<a/>')
  },

  async readFile(file) {
    const { originalname, filename, path } = file
    const extesion = originalname.split('.').splice(-1)[0]

    if (extesion === 'zip') {
      const renamedFile = `uploads/${filename}.zip`

      fs.renameSync(path, renamedFile)
      await decompress(renamedFile, `uploads/_${filename}`)
      fs.unlinkSync(renamedFile)

    } else if (extesion === 'txt') {
      const renamedFile = `uploads/_${filename}/_chat.txt`

      fs.mkdirSync(`uploads/_${filename}`)
      fs.renameSync(`uploads/${filename}`, renamedFile)
    }

    const filePath = `uploads/_${filename}/_chat.txt`
    const rawText = fs.readFileSync(filePath).toString()
    
    fs.unlinkSync(filePath, err => {
      if (err) throw err

      fs.rmdirSync(`uploads/_${filename}`)
    })
    

    return rawText

  },

  formatMessages(rawText) {

    return []
  }
}