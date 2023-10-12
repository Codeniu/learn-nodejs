// 彩蛋 1:
// ============
// 包裹数组的 `slice` 函数使之成为 curry 函数
// [1,2,3].slice(0, 2)
var slice = function (start, end) {
  return arr => arr.slice(start, end)
}

const slice1 = slice(0, 1)
const slice2 = slice(0, 2)

console.log(slice1([1, 2, 3]))
console.log(slice2([1, 2, 3]))
