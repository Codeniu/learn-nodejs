# 多进程

## 前言

1. 如何创建多进程
2. 多进程之间的通信
3. 服务器热更新


## 如何创建多进程

以下是 node.js 中 cluster 模块的主要功能：

1. cluster.fork()：该方法用于创建一个新的工作进程，该进程将是当前进程的子进程。可以使用 fork() 方法将负载分配给多个工作进程以提高性能。

2. cluster.isMaster 和 cluster.isWorker：这两个属性可用于检测当前进程是主进程还是工作进程。

3. cluster.on('exit', callback)：当一个工作进程关闭时，可以使用此方法来重新启动它。该方法接受一个回调函数，该函数在工作进程关闭时触发。

4. cluster.worker：该属性提供了当前工作进程的引用，可以使用它来执行特定于工作进程的任务。

5. cluster.disconnect()：当主进程关闭时，该方法可以用于关闭所有工作进程。

6. cluster.schedulingPolicy：此属性可用于更改工作进程的调度策略。

7. cluster.setupMaster(options)：该方法用于在主进程中设置选项，例如默认端口号和超时时间等。


创建多进程http服务：

```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

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

```
访问 `http://localhost:8000/`