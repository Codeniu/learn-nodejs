const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid}  正在运行`);

  // 衍生工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  require('fs').watch('.', {recursive: true}, (eventType) => { // 监听js文件是否更新
    if(eventType === 'change') { // 如果
      Object.entries(cluster.workers).forEach(([id, worker]) => {
        console.log('kill workder %d', worker.process.pid);
        worker.kill();
      });
      cluster.fork();
    }
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作进程共享同一个 TCP 连接
  // 在这个例子中，它是 HTTP 服务器
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello World\n${process.pid}`);
  }).listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
