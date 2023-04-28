const Server = require('./lib/server')
const Router = require('./lib/middleware/router')
const param = require('./aspect/param')
const fs = require('fs')

const app = new Server()
const router = new Router()

app.listen({
  port: 9090,
  host: '0.0.0.0',
})

app.use(({ req }, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.use(param)

app.use(
  router.get('/coronavirus/index', async ({ route, res }, next) => {
    const { getCoronavirusKeyIndex } = require('./lib/module/mock')
    const index = getCoronavirusKeyIndex()

    // 以json数据传输

    // res.setHeader('Content-Type', 'application/json')
    // res.body = { data: index }
    // await next()

    // 以模板文件传输
    const handlebars = require('handlebars')

    // 获取模板文件
    const tpl = fs.readFileSync('./views/coronavirus_index.html', { encoding: 'utf-8' })

    // 编译模板
    const template = handlebars.compile(tpl)

    // 将数据和模板结合
    const result = template({ data: index })
    res.setHeader('Content-Type', 'text/html')
    res.body = result
    await next()
  })
)

app.use(
  router.get('/coronavirus/:date', async ({ params, route, res }, next) => {
    const { getCoronavirusByDate } = require('./lib/module/mock')
    const data = getCoronavirusByDate(route.date)

    if (params.type === 'json') {
      res.setHeader('Content-Type', 'application/json')
      res.body = { data }
    } else {
      const handlebars = require('handlebars')
      const tpl = fs.readFileSync('./views/coronavirus_date.html', { encoding: 'utf-8' })

      const template = handlebars.compile(tpl)
      const result = template({ data })

      res.setHeader('Content-Type', 'text/html')
      res.body = result
    }
    await next()
  })
)

app.use(
  router.all('.*', async ({ params, req, res }, next) => {
    res.setHeader('Content-Type', 'text/html')
    res.body = '<h1>Not Found</h1>'
    res.statusCode = 404
    await next()
  })
)
