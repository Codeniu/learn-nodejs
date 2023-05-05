# bable 插件

在开源社区中，有一款非常出色的高性能向量运算模块，叫做gl-matrix，它默认用 Float32Array 来存储计算数据，不使用对象构造，而是直接使用 TypedArray 结构，所以在性能上能达到极致，非常适合作为图形库的底层运算模块。

不过因为追求高性能，gl-matrix 的使用有一些不方便。它的 API 设计完全是为了性能，而不是使用方便。比如，做两个二维向量的加法，按照 gl-matrix 的写法是：

```js
const a = vec2.fromValues(1, 2);
const b = vec2.fromValues(3, 4);
const c = vec2.create();
vec2.add(c, a, b);
```

这样的写法不仅不直观，还有很多冗余的代码。如果我们能够用更简单的语法来实现这个功能就好了，比如支持下面这种写法：

```js
const a = vec2(1, 2);
const b = vec2(3, 4);
const c = vec2(a) + vec2(b);
```

当然，JavaScript 默认的加法运算是肯定不支持c = vec2(a) + vec2(b)这种写法的，因为它不知道vec2是什么。但是，如果我们能够实现一个 Babel 插件，让它识别vec2这个类型并进行转换处理，就可以实现我们的需求了。
