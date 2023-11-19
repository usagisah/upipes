# createPipes

`createPipes` 用于创建一个管道流对象，是所有功能的基石，提供了`upipes`最为基础的能力

它用于接收传递的管道函数，创建出一个管道流对象

通过管道流对象，我们可以推动一些值进去，就像是普通函数传参一样



引入位置

```ts
import { createPipes } from "upipes"
import { createPipes } from "upipes/pipes"
```



函数类型声明

```ts
export function createPipes<T = any>(pfs: PF<T>[]): Pipes 
export function createPipes<T = any>(pfs: PF<T>[], finalize: PipeConfigFinalize): Pipes 
export function createPipes<T = any>(pfs: PF<T>[], config: PipeConfig): Pipes 
```



返回值，管道流对象的类型声明

```ts
export interface Pipes<T = any> {
  next: (value?: T) => Pipes<T>
  error: (error?: any) => Pipes<T>
  close: (value?: T) => Pipes<T>
  closed: () => boolean
  value: () => T
  resolve: () => Promise<T>
  readonly __upipes_pipes__: boolean
}
```



## 创建一个管道流

```js
import { createPipes } from "upipes"
const p = createPipes([])
```

第一种使用方式需要传递一个数组，该数组接收一组管道函数

既然用了 `upipes` 就离不开各式各样的管道函数，所以第一个参数是个数组，为必传项





## 使用管道流对象推送值

管道流对象主要用于推送值，推送的意义和普通的函数调用是一样的

管道流像 `Promise` 一样会有三种状态

- 成功，不报错
- 失败，有异常
- 结束，关闭了管道流



因为有 3 种状态，所以就需要通过三个函数来调用相关的函数，它们会在管道间被传递

三个方法均为同步执行的方法，但可能会受管道函数的影响变成异步操作

- `next`，用于传递一个任意`js`变量
- `error`，用于传递一个，被标识为异常的，任意`js`变量，可以认为相当于 `throw Error()`
- `close`，手动结束管道流，当结束后，在推送值将会报错



使用如下，支持链式调用

```ts
import { createPipes } from "upipes"
const p = createPipes([])
p.next(1)
p.error(2)
p.next(3).next(4).error(5)
p.close(6)

p.next(99) //因为之前使用 close 关闭了流，所以此时调用会报错
```





## 获取返回值

管道流是可以被反复触发的，这个触发的发起者，可以是管道流内部，也可以是在外部，通过管道流对象发起

所以无法通过，平常的函数调用，`Promise` 调用，在接收返回值

获取值的方式有 3 种



### `.value()`

该方法是一个同步方法

用于获取，当前在管道流中产生的最新值

```ts
import { createPipes } from "upipes"
const p = createPipes([])
p.next(1)
p.value() // return 1
```



要注意的是，它无法获取到管道流中，当前正在执行的，即将要产生的值，因为该方法不会等待内部的异步方法结束

```ts
import { createPipes } from "upipes"
const p = createPipes([])
p.next(1) // 假设是异步的
p.value() // return undefined
```





### `.resolve()`

该方法是一个返回 `Promise` 的异步方法

永远返回，当前管道流中，下一个要产生的值

```ts
import { createPipes } from "upipes"
const p = createPipes([])
p.next(1) // 假设是异步的
p.resolve() // return Promise<1>
```





### 配置 `finalize`

该配置是一个用于订阅最新值的回调方法

```ts
import {createPipes} from "upipes"
//使用方式 1
const p = createPipes([], (status, value) => {
  //do...
})
//使用方式 2
const p = createPipes([], {
  finalize: (status, value) => {
  	//do...
	}
})

p.next(1).next(2)
```



回调函数会在所有的管道函数处理过后被调用，接收 2 个参数，返回值没有任何要求，仅用于获取最新的状态和值

- `status` 有三个只读的值 `"success" | "error" | "close"`，分别标识，成功、异常、关闭
- `value`  该状态下的值





### 返回值的特殊情况

会发现 `.value()  .resolve()` 两个方法是没有返回状态的，它们仅用于获取成功状态下的值

但存在两种特殊情况

- `p.close()` 方法后，由于结束了流，所以内部值会统一被设置成 `undefined`，所有情况下的`p.resolve()` 都会返回  `undefined`
- 管道流中使用了`skip`，这在管道函数会着重讲，它会跳过状态判断，让流直接返回。这意味着即便是异常，也会当做正常值被返回



特殊情况只发生在这两个方法上







## 其他的管道流对象方法

```ts
export interface Pipes<T = any> {
  next: (value?: T) => Pipes<T>
  error: (error?: any) => Pipes<T>
  close: (value?: T) => Pipes<T>
  value: () => T
  resolve: () => Promise<T>
  
  closed: () => boolean  //返回是否 close 关闭过的状态
  readonly __upipes_pipes__: boolean //内部判断是否是管道流对象的字段
}
```





## 其他配置属性

```ts
export function createPipes<T = any>(pfs: PF<T>[]): Pipes 
export function createPipes<T = any>(pfs: PF<T>[], finalize: PipeConfigFinalize): Pipes 
export function createPipes<T = any>(pfs: PF<T>[], config: PipeConfig): Pipes 
```



完整的配置类型

```ts
export type PipeConfig = {
  throwError?: boolean
  finalize?: PipeConfigFinalize
}
```

- `throwError`  
  - 管道函数发生了没有任何处理程序的异常时，是否继续抛出异常
  - `true` 抛异常
  - `false`，默认值，使用`console.error` 打印异常
