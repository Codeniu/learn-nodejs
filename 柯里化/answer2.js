// 彩蛋 2:
// ============
// 借助 `slice` 定义一个 `take` curry 函数，该函数调用后可以取出字符串的前 n 个字符。

var take = function (x) {
  return function (str) {
    return str.split('').slice(0, x).join('')
  }
}

const take2 = take(2)
const take5 = take(5)

console.log('take2', take2('niujingxiang'))
console.log('take5', take5('niujingxiang'))

// 通过闭包的作用让 take 内部的函数记住柯里化时传入的参数 x
