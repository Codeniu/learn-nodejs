const http = require('http')

const server = http.createServer((req, res) => {
  const { pathname } = new URL(`http://${req.headers.host}${req.url}`)
  if (pathname === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
    })
    res.end('<h1>Hello world</h1>')
  } else if (pathname === '/see') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Access-Control-Allow-Origin': req.headers.origin,
      Connection: 'keep-alive',
      'Content-Encoding': 'utf-8',
      'Access-Control-Allow-Credentials': 'true',
    })

    // 相应报文格式
    // event:事件名（可选）
    // data:数据
    // id:可选
    res.write('data:event source建立连接\n\n')

    setInterval(() => {
      res.write('event:sendtime\ndata:服务器时间: ' + new Date() + '\n\n')
    }, 1000)
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('<h1>Not Found</h1>')
  }
})

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(8082, () => {
  console.log('opened server on', server.address())
})
