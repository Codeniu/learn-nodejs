const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = require('mime') // 引入mime包

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'static', req.url)
  filePath = path.win32.normalize(url.fileURLToPath(`file:///${filePath}`))
  console.log('filePath: ', filePath)

  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath)
    const isDir = stats.isDirectory()
    if (isDir) {
      filePath = path.join(filePath, 'index.html')
    }
    if (!isDir || fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath) // 读取文件内容
      const { ext } = path.parse(filePath)

      // 判断请求的url的文件的后缀 以返回不同的 Content-type

      // if (ext === '.png') {
      //   res.writeHead(200, { 'Content-Type': 'image/png' })
      // } else {
      //   res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      // }

      // 通过 mime 库返回 Content-type

      res.writeHead(200, { 'Content-Type': mime.getType(ext) })

      return res.end(content) // 返回文件内容
    }
  }
  res.writeHead(404, { 'Content-Type': 'text/html' })
  res.end('<h1>Not Found</h1>')
})

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(8080, () => {
  console.log('opened server on', server.address())
})
