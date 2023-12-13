# mergeAll

并发处理器，按照指定并发量，依次已发射给定参数的值



**使用 demo**

```js
mergeAll(
  [], 
  [1, defer([], 1000, 2), of([], 3)]
).subscribe(console.log)
```

参数有 3 个

1. 操作符数组，必传
2. 要发射的值数组，内部只会自动结构`createObservable`观察者实例，必传
3. 并发数量，选传，默认 1