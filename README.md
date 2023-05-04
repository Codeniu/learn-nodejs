# learn-nodejs

掘金小册，[《从前端到全栈》](https://juejin.cn/book/7133100888566005763) 的学习笔记

## fs 模块读取文件

`readFileSync` 同步读取文件，适合读取小文件。

使用 `resolve` 函数处理脚本与文件的相对位置关系。

```js
import {readFileSync} from 'fs';
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';

const url = import.meta.url; // 获取当前脚本文件的url
const path = resolve(dirname(fileURLToPath(url)), 'corpus/data.json');
const data = readFileSync(path, {encoding: 'utf-8'});
console.log(data);
```

> resolve() 方法接受任意数量的参数，每个参数都是一个路径片段。它会将这些路径片段拼接起来，并返回一个绝对路径。如果拼接后的路径不是绝对路径，则会 **自动加上当前工作目录** （process.cwd()）作为前缀。

## 获取当前模块所在目录的绝对路径

commonjs

```js
const path = require('path');

console.log(__dirname) // 文件所在目录的绝对路径
console.log(__filename) // 包含文件名

// D:\MyProjects\learn-nodejs\06_fs
// D:\MyProjects\learn-nodejs\06_fs\dirname.js

```

es6

```js
const url = import.meta.url;

console.log(url);

// file:///D:/MyProjects/learn-nodejs/06_fs/dirname.mjs
```

> 需要注意的是，__filename 和 import.meta.url 的行为有所不同，因为它们用于不同的模块系统。__filename 是 Node.js 中的一个全局变量，用于获取当前模块的文件名，而 import.meta.url 是 ECMAScript 模块中的一个属性，用于获取当前模块的 URL。

## 09_Todolist

### SQLite 简介

SQLite 是一个跨平台轻量级嵌入式的单文件数据库
