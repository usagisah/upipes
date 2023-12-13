# of

接收若干个参数，使其快速发射出去，是`createObservable` 简单使用的语法糖

```js
of([], 1, 2, 3).subscribe(console.log)
//打印依次为 1 2 3
```

以上写法相当于

```js
function of(pipes, ...args) {
  return createObservable(pipes, ob => {
    for (const arg of args) ob.next(arg)
    ob.close()
  })
}
```

