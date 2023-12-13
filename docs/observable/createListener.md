# createListener

内部将`createPipes`封装成了函数的使用形式，用于创建流式风格的函数使用



## 参数 & 返回值

```ts
function createListener<
  T extends readonly any[] = any[], R = any, P = any
>(
	pfs: PF<P>[], 
	fn?: ((...args: T) => R) | undefined
): [(...args: T) => Promise<R>, Pipes<P>]
```

`createListener` 内部接受两个参数

1. `pfs` 一个操作符数组，必传
1. `fn` 接收前边参数的自定义函数，内部会被传递给 `map` 操作符，用于自定义函数的逻辑

返回值是一个数组

1. `Promise`，具体内容为管道的最终值
2. 内部使用 `createPipes` 创建出来的实例



## 使用 demo

```js
import { createListener } from "upipes"

const [fn, p] = createListener([], v => v * 10)
console.log(await fn(10)) //100
```



## 使用场景

在结合框架使用时，直接使用 `createPipes` 并不好直接拿来用，使用`createListener`可以很轻松创建出一个函数使用

建议封装时，返回的函数可以直接提供给用户使用，第二个返回值则可以用于封装内部，在某些场景下自动触发

适用于封装普通函数时使用