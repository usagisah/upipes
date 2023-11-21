# take

## 效果

在执行指定次数后，主动关闭流

**只会统计 成功状态下 生效** ，如果要同时限制异常，可以结合`catchError` 使用



## 参数

```ts
function take(count: number): PF
```

接收一个数字类型的参数



## demo

```js
interval([take(5)], 1000).subscribe(console.log)
/*
log: 
0
1
2
3
4
*/
```

`interval` 会开启个定时器，间隔这里指定为 `1000` 毫秒，即每 `1` 秒后就推送一个值

然后通过 `take ` 限制执行次数为 `5`





## 使用场景

测试 `demo` 时用于截断

开发中作为兜底的截断操作，防止上游因为意外导致的无限制触发