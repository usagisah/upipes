# defer

相当于`setTimeout`，内部会创建一个定时器，指定时间后发射给定值

参数有 3 个

1. 操作符数组，必传
2. 定时器，选传，默认 0
3. 要发射的值，选传，默认 undefined

**使用 demo**

```js
defer([], 1000, 90).subscribe(console.log)
```

