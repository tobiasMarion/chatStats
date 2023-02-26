const fs = require('fs')
const decompress = require('decompress')

module.exports = {
  updloadHandler(req, res) {
    const file = req.file

    this.formatFile(file)

    res.send('chegou')
  },

  async formatFile(file) {
    const { originalname, filename } = file
    const extesion = originalname.split('.').splice(-1)[0]
    const renamedFile = `uploads/${filename}.${extesion}`

    fs.rename(`uploads/${filename}`, renamedFile, (err) => {
      if (err) throw err;
    })

    if (extesion === 'zip') {
      await decompress(renamedFile, `uploads/${filename}`)

      fs.unlink(renamedFile, (err) => {
        if (err) throw err;
      })
    } else if (extesion === 'txt') {
      //mover para a pasta
      //renomear
    }
  }
}