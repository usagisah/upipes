# upipes

一个用于组织多个函数执行的流式处理器


## found

createPipes
createEventPipes
createObservable


## pipe


## observable

todo

- createObservable 自定义订阅者
  - 允许多个订阅者，同 rxjs.subject
  - 可以取消订阅
  - 可以指定订阅次数
- interval
  - 定时器
- defer
  - 定时器
- of(Array)
  - 数序发射所有
- concatAll
  - Promise.all
- raceAll
  - Promise.race
- anyAll
  - Promise.any
- allSettled
- fromAny
  - 会结构所有的参数
  - 默认
    - 结构一维数组
    - 等待 promise
    - 等待 pipe
  - 支持传入函数自定义

## operators

todo

- buffer

  - websocket 压缩数量后发射
  - 点击了一定数量后开启

- catchError
  - 语法糖，只处理异常
- complete
  - 语法糖，结束时出发
- map 处理正常
  - 语法糖，正常时触发
- take
  - 只处理指定数量，之后自动销毁
- tap
  - 调试
- delay
  - 延迟
- filter
  - 筛选
- retry
  - 出错时，自动重试
- timeout
  - 超时后自动关闭，未完成的会直接丢弃
- mergeMap()
  - 控制并发
- switchMap(timer)
  - 设置时间内，订阅新的，丢弃旧的
- debounce(number | pipe | fn)
  - 防抖，一定时间内，多次触发同一个事件，只执行最后一次操作
- throttle
  - 节流，一定时间内，多次触发同一个事件，只执行第一次操作


