var ws = require('nodejs-websocket')

var server = ws.createServer(connect => {
  connect.on('text', data => {
    connect.send(data)
  })

  connect.on('close', () => {
    console.log('websocket连接断开....')
  })

  connect.on('error', error => {
    console.log('websocket连接异常....', error)
  })
})

server.listen(3000, () => {
  console.log('websocket running')
})
