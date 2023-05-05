"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector2D = void 0;
class Vector2D extends Array {
  constructor(x = 0, y = 0) {
    super(x, y);
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get len() {
    return Math.hypot(this.x, this.y);
  }
  get angle() {
    return Math.atan2(this.y, this.x);
  }
}
exports.Vector2D = Vector2D;