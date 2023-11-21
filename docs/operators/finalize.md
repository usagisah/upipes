# finalize

## 效果

只会在关闭时触发，如果有返回值则会传递给下一个，不会等待 `Promise` 结束



## 参数

```ts
function finalize(fn: Func<[any]>): PF
```

参数是一个选传的函数，该函数接收一个前边的值



## demo

```js
console.log(
  createPipes([finalize(console.log)])
    .close(1)
    .value()
)
// finalize log: 1
// value log: undefined
```





## 适用场景

当流关闭时，进行一些清楚副作用的操作
