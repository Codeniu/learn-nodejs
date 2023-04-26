const arr = [
  [3, 2],
  [1, 3],
  [2, 1],
]

arr.sort((a, b) => b[0] + b[1] - (a[0] + a[1]))

console.log(arr)
// 输出：[[1, 'banana'], [2, 'orange'], [3, 'apple']]
