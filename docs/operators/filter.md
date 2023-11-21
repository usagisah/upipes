# filter

## 效果

操作符会根据参数的返回值转换成布尔值



## 参数

```ts
function filter(fn: (arg: any)=>(boolean | Promise<boolean>>): PF
```



接收一个函数，函数是前边传递来的，成功状态的值，该函数接收一个前边的值，如果返回 `Promise` 会等待其结果

- `true` 继续传递
- `false` 吞掉不在传递



## demo

```js
createPipes([filter(v => v > 1)])
  .next(2)
  .next(1)
  .value()
//return 2
```



## 适用场景

筛选过滤值

