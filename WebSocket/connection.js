const WebSocket = require('nodejs-websocket')
console.log('WebSocket: ', WebSocket)

class MyWebSocket {
  constructor(url) {
    this.websockStatus = 0
    this.heartBeatTimer = null
    this.websock = null

    this.initWebSocket(url)
  }

  genRadomid() {
    return Number(Math.random().toString().substr(3, 0) + Date.now())
      .toString(36)
      .toUpperCase()
  }

  websocketonopen() {
    console.log('WebSocket连接成功')
    this.websockStatus = 1
  }

  websocketonerror() {
    console.log('WebSocket连接发生错误')
    this.websockStatus = 0
  }

  websocketonmessage(e) {
    console.log(e)
  }

  websocketclose(e) {
    console.log('WebSocket closed')
  }

  heartBeat() {
    this.heartBeatTimer = setInterval(() => {
      this.websock.send(
        JSON.stringify({
          msgid: this.genRadomid(),
          content: 'ping',
          time: parseTime(new Date()),
          type: 'ping',
        })
      )
    }, 1000 * 10)
  }

  initWebSocket(url) {
    this.websock = WebSocket.connect(url)
    this.websock.onopen = this.websocketonopen
    this.websock.onerror = this.websocketonerror
    this.websock.onmessage = this.websocketonmessage
    this.websock.onclose = this.websocketclose

    this.heartBeat()
  }
}

module.exports = MyWebSocket
