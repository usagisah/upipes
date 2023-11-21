# retry

使用指定的方式，自动重头开始调用



## 参数

```ts
export function retry(): PF
export function retry(count?: number): PF
export function retry(check: Func<[PipeContext], boolean>): PF
```

传数字时，表示前边出现异常时，拦截指定的次数，拦截后重头再次执行

传函数时，会接收当前的状态对象，会根据返回值决定是否应该重启

- `true` 允许往后继续
- `false` 不允许继续，重启





## 传数字

```js
createPipes([tap(c => console.log({ ...c })), retry(3), catchError()])
  .error(1)
  .value()
/*
tap log:
{ status: 'error', value: 1 }
{ status: 'error', value: 1 }
{ status: 'error', value: 1 }
{ status: 'error', value: 1 }

log: 1
*/
```

`tap` 用于调试，查看前边执行了几次

`retry` 此时会拦截 3 次异常，并重启

第 1次进入，加上因为重启的 3 次，所以总共执行了 4 次，最后`catchError` 给转换成成功状态，返回值就是 1



## 传函数

```js
let count = -1
const myRetry = retry(() => {
  count++
  if (count === 3) return false
  return true
})
console.log(
  createPipes([tap(c => console.log({ ...c })), myRetry])
    .next(1)
    .value()
)

/*
tap log:
{ status: 'success', value: 1 }
{ status: 'success', value: 1 }
{ status: 'success', value: 1 }
{ status: 'success', value: 1 }

log:
1
*/
```

这里使用了自己的计数器，无论成功失败都重启，次数是 3





## 使用场景

接口的报错重试