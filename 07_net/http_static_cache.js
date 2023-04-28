const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = require('mime') // 引入mime包

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'static', req.url)
  filePath = path.win32.normalize(url.fileURLToPath(`file:///${filePath}`))

  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }
    if (fs.existsSync(filePath)) {
      const { ext } = path.parse(filePath)
      res.writeHead(200, {
        'Content-Type': mime.getType(ext),
        'Cache-Control': 'max-age=86400', // 缓存一天
      })
      const fileStream = fs.createReadStream(filePath)
      fileStream.pipe(res)
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('<h1>Not Found</h1>')
  }
})

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(8080, () => {
  console.log('opened server on', server.address())
})
