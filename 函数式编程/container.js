var Container = function (x) {
  this.__value = x
}

Container.of = function (x) {
  return new Container(x)
}

// (a -> b) -> Container a -> Container b
Container.prototype.map = function (f) {
  console.log('inner')
  return Container.of(f(this.__value))
}

// 这段代码创建了一个 map 函数，
// 这个函数接收一个函数作为参数，并返回一个 container 实例，
// 其中，将上次 Container 实例存储的值作为参数传递给 f 函数
// 最后将 f 函数计算的结果存储在这个新的实例中

// ----------------------------------

Container.of(2).map(function (two) {
  return two + 2
})
//=> Container(4)

// 1.这段代码首先创建一个 Container 实例，并将 2 存储在其中。
// 2.然后，它将函数 function (two) { return two + 2 } 应用于 Container 实例中的值，
//   并将函数应用的结果存储在一个新的 Container 实例中。
// 3.新 Container 实例的值将为 4。

// ----------------------------------

Container.of('flamethrowers').map(function (s) {
  return s.toUpperCase()
})
//=> Container("FLAMETHROWERS")

console.log(
  Container.of('bombs')
    .map(str => str + ' away')
    .map(val => val.length)
  //=> Container(10)
)

var arr = [1, 2, 3, null]

console.log(
  arr
    .map(function (two) {
      return two + 2
    })
    .map(str => str + ' away')
)
//==> [3,4,5]

console.log(Container.of(null).map(str => str + ' away'))
