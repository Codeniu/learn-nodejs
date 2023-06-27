const MyWebSocket = require('./connection')

const myWebSocket = new MyWebSocket('ws://localhost:3000')
console.log('myWebSocket: ', myWebSocket)

myWebSocket.send('111')
