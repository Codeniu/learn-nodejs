export class Vector2D extends Array {
  constructor (x = 0, y = 0) {
    super(x, y)
  }

  get x () {
    return this[0]
  }

  get y () {
    return this[1]
  }

  get len () {
    return Math.hypot(this.x, this.y)
  }

  get angle () {
    return Math.atan2(this.y, this.x)
  }
}
