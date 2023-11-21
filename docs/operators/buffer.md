# buffer

## 效果

用户缓存前边推送的值，当达到指定数量时，会将值拼成数组，继续向后推送

比如发送了 4 个值 `1,2,3,4`，当`buffer(2)` 时，相当于会分成 2 组

一组 `[1,2]`

二组 `[3,4]`

如果中途流被关闭了，则会发送剩下所有的值



## 参数

```ts
function buffer(count?: number): PF
```

接收一个代表压缩的次数的数量



## demo

```ts
const pipes = createPipes([buffer(2), ctx => p2(console.log)])
;[1, 2, 3].forEach(pipes.next)
pipes.close(4)

//1: { status: "success", value: [1, 2] }
//2: { status: "close", value: [3, 4] }
```



## 适用场景

适用于推送频繁的场景，例如 `websocket`，缓存一定数量在批量操作有助于提高性能