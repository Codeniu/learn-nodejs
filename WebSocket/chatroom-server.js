const ws = require('nodejs-websocket')

// 统计用户数，每当用户访问，函数就会被执行，并给用户创建conncet对象
var count = 0

/*
  type:消息类型 

  0 ： 表示加入聊天室的消息
  1 : 表示用户离开聊天室的消息
  2 ： 正常的聊天消息
**/
const TYPE_ENTER = 0
const TYPE_LEAVE = 1
const TYPE_MSG = 2

const server = ws.createServer(connect => {
  count++
  connect.userName = `用户${count}`

  broadcast({
    type: TYPE_ENTER,
    msg: `${connect.userName}进来了`,
    time: new Date().toLocaleTimeString(),
  })

  connect.on('text', data => {
    // connect.send(data) send 只为当前用户发送数据

    broadcast({
      type: TYPE_MSG,
      msg: data,
      time: new Date().toLocaleTimeString(),
    })
  })

  connect.on('close', () => {
    broadcast({
      type: TYPE_LEAVE,
      msg: `用户${count}离开了`,
      time: new Date().toLocaleTimeString(),
    })
    count--
    console.log('连接关闭。。。')
  })

  connect.on('error', err => {
    console.log('连接异常。。。。', err)
  })
})

//An Array with all connected clients. It's useful for broadcasting a message
function broadcast(msg) {
  server.connections.forEach(connect => {
    connect.send(JSON.stringify(msg))
  })
}

server.listen(3000, () => {
  console.log('websocket running.....')
})
