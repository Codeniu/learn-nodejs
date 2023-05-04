const fs = require('fs');
const path = require('path');
const url = require('url');
const mime = require('mime');
const zlib = require('zlib');
const sqlite3 = require('sqlite3');
const {open} = require('sqlite');
const {Server, Router} = require('./lib/interceptor');

const dbFile = path.resolve(__dirname, '../database/todolist.db');
let db = null;

const app = new Server();
const router = new Router();

app.use(async ({req}, next) => {
  console.log(`=> ${req.method}  ${req.url}`); // eslint-disable-line no-console
  await next();
});

const param = require('./aspect/param');
app.use(param);

const cookie = require('./aspect/cookie');
app.use(cookie);

app.use(async (ctx, next) => {
  if(!db) {
    db = await open({
      filename: dbFile,
      driver: sqlite3.cached.Database,
    });
  }
  ctx.database = db;

  await next();
});

async function checkLogin(ctx) {
  const {getSession} = require('./model/session');
  const userInfo = await getSession(ctx.database, ctx, 'userInfo');
  ctx.userInfo = userInfo;
  return ctx.userInfo;
}

app.use(async ({cookies, res}, next) => {
  let id = cookies.interceptor_js;
  if(!id) {
    id = Math.random().toString(36).slice(2);
  }
  res.setHeader('Set-Cookie', `interceptor_js=${id}; Path=/; Max-Age=${7 * 86400}`); // 设置cookie的有效时长一周
  await next();
});

app.use(router.get('/list', async (ctx, next) => {
  const {database, res} = ctx;
  const userInfo = await checkLogin(ctx);
  res.setHeader('Content-Type', 'application/json');
  if(userInfo) {
    const {getList} = require('./model/todolist');
    const result = await getList(database, userInfo);
    res.body = {data: result};
  } else {
    res.body = {err: 'not login'};
  }
  await next();
}));

app.use(router.post('/add', async (ctx, next) => {
  const {database, params, res} = ctx;
  const userInfo = await checkLogin(ctx);
  res.setHeader('Content-Type', 'application/json');
  if(userInfo) {
    const {addTask} = require('./model/todolist');
    const result = await addTask(database, userInfo, params);
    res.body = result;
    await next();
  } else {
    res.body = {err: 'not login'};
  }
  await next();
}));

app.use(router.post('/update', async ({database, params, res}, next) => {
  res.setHeader('Content-Type', 'application/json');
  const {updateTask} = require('./model/todolist');
  const result = await updateTask(database, params);
  res.body = result;
  await next();
}));

app.use(router.post('/login', async (ctx, next) => {
  const {database, params, res} = ctx;
  const {login} = require('./model/user');
  const result = await login(database, ctx, params);
  res.statusCode = 302;
  if(!result) { // 登录失败，跳转到login继续登录
    res.setHeader('Location', '/login.html');
  } else {
    res.setHeader('Location', '/'); // 成功，跳转到 index
  }
  await next();
}));

app.use(router.get('.*', async ({req, res}, next) => {
  // let filePath = path.resolve(__dirname, path.join('../www', url.fileURLToPath(`file:///${req.url}`)));

  let filePath = path.join(__dirname, '../www', req.url)
  filePath = path.win32.normalize(url.fileURLToPath(`file:///${filePath}`))

  if(fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if(stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if(fs.existsSync(filePath)) {
      const {ext} = path.parse(filePath);
      const stats = fs.statSync(filePath);
      const timeStamp = req.headers['if-modified-since'];
      res.statusCode = 200;
      if(timeStamp && Number(timeStamp) === stats.mtimeMs) {
        res.statusCode = 304;
      }
      const mimeType = mime.getType(ext);
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'max-age=86400');
      res.setHeader('Last-Modified', stats.mtimeMs);
      const acceptEncoding = req.headers['accept-encoding'];
      const compress = acceptEncoding && /^(text|application)\//.test(mimeType);
      let compressionEncoding;
      if(compress) {
        acceptEncoding.split(/\s*,\s*/).some((encoding) => {
          if(encoding === 'gzip') {
            res.setHeader('Content-Encoding', 'gzip');
            compressionEncoding = encoding;
            return true;
          }
          if(encoding === 'deflate') {
            res.setHeader('Content-Encoding', 'deflate');
            compressionEncoding = encoding;
            return true;
          }
          if(encoding === 'br') {
            res.setHeader('Content-Encoding', 'br');
            compressionEncoding = encoding;
            return true;
          }
          return false;
        });
      }
      if(res.statusCode === 200) {
        const fileStream = fs.createReadStream(filePath);
        if(compress && compressionEncoding) {
          let comp;
          if(compressionEncoding === 'gzip') {
            comp = zlib.createGzip();
          } else if(compressionEncoding === 'deflate') {
            comp = zlib.createDeflate();
          } else {
            comp = zlib.createBrotliCompress();
          }
          res.body = fileStream.pipe(comp);
        } else {
          res.body = fileStream;
        }
      }
    }
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.body = '<h1>Not Found</h1>';
    res.statusCode = 404;
  }

  await next();
}));

app.use(router.all('.*', async ({params, req, res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Not Found</h1>';
  res.statusCode = 404;
  await next();
}));

app.listen({
  port: 9090,
  host: '0.0.0.0',
});