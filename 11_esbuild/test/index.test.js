import {niulog} from '../src/logger'

test('niulog test', () => {
  // const arr = [1, 2, 3, 4, 5, 6];
  // const m1 = mat2d(...arr);
  // const m2 = mat2d.fromValues(...arr);
  niulog(1)
  expect(niulog('1')).toEqual('1');
});