var http = require('http')
var fs = require('fs')
http
  .createServer(function (req, res) {
    try {
      fs.readFile('hello.html', function (err, data) {
        console.log('err, data: ', err, data)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(data)
        return res.end()
      })
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/html' })
      res.write(error)
      return res.end()
    }
  })
  .listen(8080)
console.log('Server is listening: http://localhost:8080')
