// 练习 3:
// ============
// 定义一个shot函数，转换字符串如示例格式
// shout("send in the clowns");
// => "SEND IN THE CLOWNS!"

const compose = function (f, g) {
  return function (str) {
    return f(g(str))
  }
}

const toUpperCase = function (str) {
  return str.toUpperCase()
}

const exclaim = function (str) {
  return str + '!'
}

var shout = compose(toUpperCase, exclaim)

// 实际上

// var shout = function (x) {
//   return exclaim(toUpperCase(x))
// }
console.log('shout: ', shout('my name is codeniu'))
