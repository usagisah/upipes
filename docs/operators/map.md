# map

接收一个函数，函数是前边传递来的值，该函数接收一个前边的值，如果返回 `Promise` 会等待其结果

只处理成功和关闭状态的值，异常会自动透传

提供了些便利的特性



## 异常会自动透传给下一个

```js
createPipes([
  () => {
    throw 99
  },
  map(console.log),
  catchError(() => {})
])
  .next(1)
  .value()
// return 99，console.log 不会被触发
```



## 如果返回 `undefined`，则会立即发送值

返回 `undefined` 相当于 `next(preValue, { skip: true })`

```js
createPipes([map(v => {}), console.log]).next(1).value()
//map内返回 undefined，所以 1 会变成内部的最新值
//console.log 不会触发
```