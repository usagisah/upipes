# createObservable

内部将 `createPipes` 封装成了观察者的形式

和直接使用 `createPipes` 相比，它主要提供了以下的便捷功能

1. 多播：直接使用时只能有一个回调，观察者模式下可以同时存在多个订阅者（回调函数）
2. 惰性触发：直接使用时，一旦发射新的值就会立即执行，即便没有订阅者（回调）。观察者模式下如果不存在订阅者，内部会缓存所有值，直到注册了至少一个回调函数
3. 更直接的使用：回调函数形式和`createPipes`有所不同，具体看以下文章中的 `demo`



## 基本使用

```js
const o = createObservable([], o => {
  o.next(1)
  o.next(2)
  o.error(3)
  o.close(4)
})
//使用1
o.subscribe(v => console.log("next", v))
//使用2
o.subscribe({
  next: v => console.log("next", v),
  error: e => console.log("error", e),
  close: v => console.log("close", v)
})
//打印内容依次为
/*
next a
next 1
next 2
error 3
close 4
*/
```

`createObservable` 函数会创建一个观察者实例，该实例是一个经过代理的`createPipes`的返回值

参数有 2 个

1. 操作符数组，必传
2. 生产者回调，选传，该回调函数的参数和返回值一样，都是观察者的实例

消费值时需要使用 `subscribe` 进行订阅，使用形式有 2 种，参数分别对应着操作符的三种状态



## 其他方法

### isObservable

用于判断是否是 `createObservable` 的实例

```js
console.log( isObservable( createObservable([]) ) )
```



### 取消订阅

`subscribe` 函数会返回一个取消订阅函数，使用后将不再接收到新的值

```js
const o = createObservable([])
//返回值是一个取消订阅的函数
const unSubscribe = o.subscribe(console.log)
unSubscribe()
```



## 使用场景

主要用于处理

1. 一个回调函数处理的事情太多，此时可以订阅多个，达到拆解的目的
2. 封装一些有初始值的方法时，可以延迟触发，具体感受可以看*创建者*篇章