const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]
  }, [])
}

const result = chunk(['a', 'b', 'c', 'd'], 2)
console.log('result: ', result)
// => [['a', 'b'], ['c', 'd']]
