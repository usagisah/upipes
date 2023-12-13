# empty

## 效果

一个空的，用于占位的操作符



## 使用场景

适用于在封装操作符时，如果不满足某些条件就跳过当前操作符，例如以下`tap`操作符的实现

```ts
export function tap(fn: Func<[PipeContext]>): PF {
  if (!isFunction(fn)) return empty
  return (ctx, resolve, reject) => {
    fn(ctx)
    empty(ctx, resolve, reject)
  }
}
```

