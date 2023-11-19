# finalize

参数是一个选传的函数，该函数接收一个前边的值

只会在关闭时触发，如果有返回值则会传递给下一个，不会等待 `Promise` 结束



```js
console.log(
  createPipes([finalize(console.log)])
    .close(1)
    .value()
)
// finalize log: 1
// value log: undefined
```

