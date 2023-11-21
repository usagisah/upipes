# throttle

## 效果

节流器，内部会开启一个定时器，在计时内收到的值都会被吞掉



## 参数

```ts
export function throttle(): PF
export function throttle(gap: number): PF 
export function throttle(fn: Func<[any], number>): PF
```

传数字会直接作为定时器的间隔

传函数会使用返回值作为定时器的间隔

不传默认为 0，操作会变成异步



## 使用场景

防止短时间内，或者一定时间内的用户操作

短信验证码的暂停

高并发的点击事件