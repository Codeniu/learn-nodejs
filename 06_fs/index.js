// import { readFileSync } from 'fs'
// import { fileURLToPath } from 'url'
// import { dirname, resolve } from 'path'

// const url = import.meta.url // 获取当前脚本文件的url
// const path = resolve(dirname(fileURLToPath(url)), 'corpus/data.json')
// const data = readFileSync(path, { encoding: 'utf-8' })
// console.log(data)

const fs = require('fs')

try {
  fs.mkdirSync('./new-directory/b.txt')
  console.log('Directory created successfully.')
} catch (err) {
  console.error(err)
}
