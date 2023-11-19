# 管道函数

管道函数是让 `upipes` 实现对于复杂应用的核心，所有类型为 `PF / PipeFactory` 都是管道流函数

完整的类型声明

```ts
export type PipeFactory<T = any> = (context: PipeContext<T>, resolve: PipeNext, reject: PipeNext) => any
export type PF<T = any> = PipeFactory<T>
```





## 写一个管道函数

```ts
import {PF, createPipes} from "upipes"

function pf(param): PF {
  return (context, resolve, reject) => {
    const { status, value } = context
    //管道函数内部
  }
}
const p = createPipes([ pf ])
```

管道函数是一个有着 3 个参数的任意函数

实际建议使用`demo`中的方式书写，这样外层的函数用于让用户传参，内部则根据参数做些相关的操作





## `context`

一个只读的对象，属性有两个

- `status: string`
  - 表示前边是以什么状态到当前这里的
  - 只有三个值 `"success" | "error" | "close"`
- `value`
  - 前边传递到这里的值

这里的前边可以是，上一个管道函数，如果自己就是第一个，那就是外边的管道流对象传递的





## 值要如何向后传递

值的传递只有 2 种方式

1. 显示调用 `resolve/reject` 函数
2. 函数内部抛出异常，这种方式等用于默认调用了 `reject` 函数



默认情况下，函数执行完是不会继续向后执行的，不会向后执行意味着

- `p.value() / p.resolve() / finalize` 接收不到
- 这次的值被吞了

所以如果想要中断这个传递的过程，不要调用它们，不要在执行期间抛出异常即可

注意这样做并不会引发内存泄漏





## `resolve/reject`

这两方法的区别在于，分别用于向后传递不同状态的值

- `resolve -> context.status === "success"`
- `reject -> context.status === "error"`



它们的参数类型如下

```ts
export type PipeNext = (
	value?: any, 
  options?: {
    forceClose?: boolean
    skip?: boolean
    loop?: boolean
	}
) => void
```

- `value` 是要往后传递的值
- `options` 表示应该如何进行下一步，三个属性默认全是 `false`
  - `forceClose: true` 相当于，从内部调用了管道流对象的 `close()` 方法
  - `skip: true` 表示跳过自己后边的所有管道流函数，跳过类型判断，直接将传递的 `value` 变成内部最新的值
  - `loop: true` 表示是否使用最初传递的参数，从头执行

`options` 属性的优先级为从上到下，传递多个只会触发优先级最高的



注意，如果流关闭了，再调用会触发报错





## 特殊情况

在 `context.status === "close"` 时，即关闭流时，内部会以同步的方式，强行过一遍所有的管道函数，用于清理相关的副作用

在此期间调用 `resolve/reject` 时

- 如果报错，只会用 `console.error` 打印
- 如果异步调用，会报错
- 同步调用时，值仍然会传递，但最终结束后，内部最新值会被强行覆盖成 `undefined`
- 如果没有显示的调用，或者返回了 `undefined`，内部会沿用上次的值向后传递
