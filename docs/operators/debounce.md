# debounce

## 效果

防抖器，每次收到值都会起一个定时器，后边的会把前边未完成的取消

即一段时间内，连续的操作只有最后一次会生效



## 参数

```ts
export function debounce(): PF
export function debounce(gap: number): PF 
export function debounce(fn: Func<[any], number>): PF 
```

传数字会直接作为定时器的间隔

传函数会使用返回值作为定时器的间隔

不传默认为 0，操作会变成异步



## 使用场景

高频的输入场景

需要根据用户输入的内容，实时调用接口查询，此时建议设置成 700，有利于改善性能和用户体现

瀑布流的触底加载