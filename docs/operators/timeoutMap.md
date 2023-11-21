# timeoutMap

## 效果

在操作符 `map` 的基础上加上了超时时间，执行时内部会开个定时器，指定时间内如果没有返回视为失败



## 参数

```ts
export function timeoutMap(fn: Func<[any]>): PF
export function timeoutMap(fn: Func<[any]>, timeout: number): PF
export function timeoutMap(fn: Func<[any]>, config: Config): PF

type Config = {
  timeout?: number
  throwError?: string
  forceClose?: boolean
}
```

`timeout` 超时时间，默认`10000`，即`10秒`

`throwError` 超时时抛出的错误，默认不会抛出异常，只会忽略

`forceClose` 超时时是否直接结束外部的流

配置可以叠加







## 使用场景

一些意外比较耗时的操作，可以用于快速失败