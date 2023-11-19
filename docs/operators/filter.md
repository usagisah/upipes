# filter

接收一个函数，函数是前边传递来的，成功状态的值，该函数接收一个前边的值，如果返回 `Promise` 会等待其结果

操作符会根据返回值转换成布尔值

- `true` 继续传递
- `false` 吞掉不在传递



## 使用

```js
createPipes([filter(v => v > 1)])
  .next(2)
  .next(1)
  .value()
//return 2
```



## 适用场景

筛选过滤值

