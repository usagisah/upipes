# tap

## 效果

`tap` 操作符用于获取当前状态的快照，不会改变接收值和向后传递的值，



## 参数

```ts
function tap(fn: Func<[PipeContext]>): PF
```

接收一个函数，该函数接收一个 `context.status` 对象

返回值不会产生任何影响



## 使用 demo

```js
createPipes([tap(console.log)])
  .next(1)
  .value()
// log: { status: "success", value: 1 } 
```





## 适用场景

调试时

采集状态时，比如根据在接口的管道函数中放一个，用于埋点采集数据