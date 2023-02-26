module.exports = {
  updloadHandler(req, res) {
    const file = req.file
    console.log(file)

    res.send('chegou')
  }
}