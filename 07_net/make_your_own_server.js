const net = require('net')
const fs = require('fs')
const p = require('node:path')

// HTTP 响应报文的基础格式
function responseData(str, status = 200, desc = 'OK') {
  return `HTTP/1.1 ${status} ${desc} \r\nContent-Length: ${str.length}\r\nContent-Type: text/plain\r\n\r\n${str}`
}

class HTTPRequest {
  constructor(method, path, headers) {
    this.method = method
    this.path = path
    this.headers = headers
  }
}

function parseRequest(requestData) {
  const [request, ...requestHeaders] = requestData.split('\r\n')
  let body = null
  const n = requestHeaders.length
  /*
    This if statement is used to handle POST requests with content in the body.
    Data splitted by \r\n will result in empty string and body in the last two elements of the array;
    Example:
      POST / HTTP/1.1
      Host: localhost:4221
      User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.207.132.170 Safari/537.36
      Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*\/*;q=0.8,application/signed-exchange;v=b3;q=0.9
      Accept-Encoding: gzip, deflate
      Accept-Language: en-US,en;q=0.9
      Connection: keep-alive
      BODY
  */
  if (requestHeaders[n - 2] == '') {
    body = requestHeaders.pop()
    requestHeaders.pop()
  }
  const [method, path, version] = request.split(' ')
  const headers = {}
  requestHeaders.forEach(header => {
    if (!header) return
    const [key, value] = header.split(': ')
    headers[key] = value
  })
  return { method, path, version, headers, body }
}

const server = net.createServer(socket => {
  socket.on('close', () => {
    socket.end()
    server.close()
  })

  socket.on('data', data => {
    const requestData = data.toString()
    const request = parseRequest(requestData)
    console.log('requestData: ', requestData)
    console.log('request: ', request)

    const { path, method, body } = request

    if (path === '/') {
      socket.write(responseData('ok'))
    } else if (path.startsWith('/echo/')) {
      socket.write(responseData(path.slice('/echo/'.length)))
    } else if (path === '/user-agent') {
      const userAgent = request.headers['User-Agent']
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`
      )
    } else if (path.startsWith('/files/')) {
      if (method === 'GET') {
        try {
          const fileName = path.slice('/files/'.length)
          const directory = process.argv[3]

          const fullPath = p.resolve(directory, fileName)
          const content = fs.readFileSync(fullPath, 'utf8')

          if (fs.existsSync(fullPath)) {
            socket.write(
              `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`
            )
          } else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
          }
        } catch (error) {
          socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
        }
      }

      if (method === 'POST') {
        console.log('POST')
        try {
          const fileName = path.slice('/files/'.length)
          const directory = process.argv[3]
          const fullPath = p.resolve(directory, fileName)

          fs.writeFileSync(fullPath, body)

          socket.write(
            `HTTP/1.1 201 OK\r\nContent-Type: text/plain\r\nContent-Length: 0\r\n\r\n`
          )
        } catch (error) {
          socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
        }
      }
    } else {
      // 否则返回404状态
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
    }

    socket.end()
  })

  socket.on('end', () => {
    socket.end()
    console.log('SERVER: socket end')
  })
})

server.listen(4221, 'localhost')
