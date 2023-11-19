# catchError

参数是一个选传的函数，该函数接收一个前边的值，如果返回 `Promise` 会等待其结果



用于处理异常，转换成成功状态

提供了些便利的特性



## 如果返回 `undefined` 或者不传，则会将 成功和失败 都转成成功

返回 `undefined` 相当于 `next(preValue, { skip: true })`

```js
createPipes([catchError(), console.log]).error("error").value()
// log: error
//console.log 不会触发
```

这里 `error()` 方法相当于抛了个异常，但是被转成了正常状态，所以没报错



## 处理异常，并向后传递

传递一个函数即可

```js
console.log(
  createPipes([catchError(e => e + 1)])
    .error("error")
    .value()
)
// log: error1
```

