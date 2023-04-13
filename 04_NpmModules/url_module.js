var http = require('http')
var url = require('url')

http
  .createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    const query = url.parse(req.url, true).query
    res.write(query.name)
    res.end('\n Hello World!')
  })
  .listen(8080)

console.log('Server is listening: http://localhost:8080/?name=niu')
