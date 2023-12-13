# fromAll

相当于高级版的 `of`，它会将接受到的值全部发射出去，对于特定结构的值会进行自动结构

参数

1. 操作符数组，必传
2. 要发射的值的数组，必传
3. 配置，选传



## 基本使用

```js
fromAll(
  [],
  [[1, 2, 3], Promise.resolve(4), of([], 5, 6)]
)
  .subscribe(console.log)
//打印顺序为 1 2 3 5 6 4
```

默认情况下，会结构以下内容，结构深度均为 1 层

- 数组
- Promise
- createObservable实例，当 `close` 时表示完成
- 函数



## 自定义解构规则

```js
fromAll([], [new Set(["a", "b"])], {
  factory({ value, observable, done, unWrapper }) {
    if (value instanceof Set) value.forEach(observable.next), done()
    else unWrapper()
  }
}).subscribe(console.log)
```

配置`factory`函数，该函数接收 4 个参数

- `value` 参数1数组中的每一项
- `observable` 内部观察者的实例，发射的值会传给`fromAll` 的订阅者
- `done` 表示当前项处理完了，当每一项都处理完是，内部会自动 `close` 关闭流
- `unWrapper` 内部默认的解构规则