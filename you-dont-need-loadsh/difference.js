let arrays = [
  [1, 2, 3, 4, 5],
  [5, 2, 10],
]
console.log(arrays.reduce((a, b) => a.filter(c => !b.includes(c))))
// output: [1, 3, 4]
