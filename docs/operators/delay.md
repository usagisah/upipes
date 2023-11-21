# delay

## 效果

内部会创建一个定时器，延迟指定时间后在继续推送



## 参数

```ts
export function delay(timeout: number): PF
export function delay(fn: Func<[], number>): PF
```

参数传给定时器计时，单位是 毫秒

如果传函数，会使用返回值作为时间



## demo

```js
await createPipes([delay(1000)])
  .next(1)
  .resolve()
```

一秒后返回 1



## 使用场景

测试