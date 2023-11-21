# mergeMap

## 效果

并发器，使用参数函数传给操作符`map`用于解构，然后根据参数限制并发执行的数量

比如限制数量为 `2`，当推送四个值 `1 2 3 4`时，`1,2` 会先经过 `map` 执行并向后推送，`3,4`等待，当`1,2`某一个结束后，`3`执行，`4`等待

如果限制数量为 `1`，就会变成队列的执行形式，即1次只执行一个



## 参数

```ts
export function mergeMap(thenFn: Func<[any]>): PF
export function mergeMap(thenFn: Func<[any]>, limit: number): PF
export function mergeMap(thenFn: Func<[any]>, limitFn: Func<[number], boolean>): PF
```

参数1是传递给 `map` 操作符的函数

参数2是可选的限制参数，数字表示限制几次。传函数时，接收一个当前的并发计数器，然后根据返回值决定是否进行限制

默认情况下，并发数是 1



## demo

```js
const pf = mergeMap(value => {
  return new Promise(r => {
    setTimeout(() => {
      r(value)
    }, 100 * value)
  })
}, 2)

const p = createPipes([pf], console.log)
p.next(2).next(5).next(1).next(1)

/*
success 2
success 1
success 1
success 5
*/
```

这里限制并发是 2，所以 `2,5`先执行，`1,1`等待，当`2,1,1` 都执行完时，`5`结束





## 使用场景

接口的并发场景，比如批量操作时，瞬时调用太多接口会造成阻塞和性能问题